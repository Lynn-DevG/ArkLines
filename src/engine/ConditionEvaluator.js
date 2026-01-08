/**
 * ConditionEvaluator - 条件评估器
 * 
 * 用于统一处理技能释放条件、行为生效条件、变体条件等的判断
 * 
 * 条件结构：
 * {
 *   type: 'buff_check' | 'attribute_check' | 'action_history' | 'combo',
 *   target: 'self' | 'ally' | 'other_ally' | 'main_char' | 'enemy' | 'target_enemy' | 'any',
 *   // 根据 type 不同有不同的参数
 *   ...params,
 *   subConditions: []  // 子条件，与主条件为 AND 关系，子条件之间为 OR 关系
 * }
 * 
 * 多个条件之间为 OR 关系（任一通过即可）
 */

export class ConditionEvaluator {
    /**
     * @param {Object} context - 评估上下文
     * @param {Object} context.buffManager - Buff管理器实例
     * @param {Object} context.actionHistory - 历史行为记录
     * @param {Object} context.comboManager - 连击管理器
     * @param {Array} context.characters - 所有角色
     * @param {Object} context.enemy - 敌人数据
     * @param {string} context.sourceCharId - 执行条件检查的角色ID
     * @param {string} context.mainCharId - 当前主控角色ID
     * @param {number} context.currentTime - 当前时间
     */
    constructor(context) {
        this.context = context;
    }

    /**
     * 评估条件数组（OR关系）
     * @param {Array|Object} conditions - 条件或条件数组
     * @returns {boolean}
     */
    evaluate(conditions) {
        if (!conditions) return true;
        
        // 单个条件对象
        if (!Array.isArray(conditions)) {
            return this.evaluateSingle(conditions);
        }
        
        // 空数组视为无条件
        if (conditions.length === 0) return true;
        
        // 多个条件，OR关系
        return conditions.some(cond => this.evaluateSingle(cond));
    }

    /**
     * 评估单个条件
     * @param {Object} condition
     * @returns {boolean}
     */
    evaluateSingle(condition) {
        if (!condition || !condition.type) return true;

        let result = false;

        switch (condition.type) {
            case 'buff_check':
                result = this.checkBuff(condition);
                break;
            case 'attribute_check':
                result = this.checkAttribute(condition);
                break;
            case 'action_history':
                result = this.checkActionHistory(condition);
                break;
            case 'combo':
                result = this.checkCombo(condition);
                break;
            case 'buff_stacks':
                // 兼容旧格式
                result = this.checkBuffStacks(condition);
                break;
            case 'is_main_char':
                result = this.checkIsMainChar(condition);
                break;
            case 'enemy_state':
                result = this.checkEnemyState(condition);
                break;
            default:
                console.warn(`未知的条件类型: ${condition.type}`);
                return false;
        }

        // 如果主条件通过，检查子条件
        if (result && condition.subConditions && condition.subConditions.length > 0) {
            // 子条件之间为 OR 关系
            result = condition.subConditions.some(sub => this.evaluateSingle(sub));
        }

        return result;
    }

    /**
     * 检查目标是否拥有特定buff
     * @param {Object} condition
     * @param {string} condition.buffId - buff ID
     * @param {number} condition.stacks - 比较层数
     * @param {string} condition.compare - 比较方式: 'eq'|'gt'|'lt'|'gte'|'lte'
     * @param {string} condition.target - 检查目标
     */
    checkBuff(condition) {
        const { buffId, stacks = 1, compare = 'gte', target = 'self' } = condition;
        const targets = this.resolveTargets(target);
        
        for (const targetId of targets) {
            const currentStacks = this.context.buffManager?.getBuffStackCount(targetId, buffId) || 0;
            if (this.compare(currentStacks, stacks, compare)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 兼容旧的 buff_stacks 条件格式
     */
    checkBuffStacks(condition) {
        const { buffId, min = 1 } = condition;
        return this.checkBuff({
            buffId,
            stacks: min,
            compare: 'gte',
            target: condition.target || 'self'
        });
    }

    /**
     * 检查目标属性
     * @param {Object} condition
     * @param {string} condition.attribute - 属性类型: 'hp'|'atk'|'def'|'usp'|'atb' 等
     * @param {number} condition.value - 比较值
     * @param {string} condition.compare - 比较方式
     * @param {string} condition.target - 检查目标
     */
    checkAttribute(condition) {
        const { attribute, value, compare = 'gte', target = 'self' } = condition;
        const targets = this.resolveTargets(target);
        
        for (const targetId of targets) {
            const targetObj = this.getTargetObject(targetId);
            if (!targetObj) continue;
            
            let currentValue = 0;
            
            switch (attribute) {
                case 'hp':
                    currentValue = targetObj.stats?.currentHp || targetObj.hp || 0;
                    break;
                case 'hp_percent':
                    const maxHp = targetObj.stats?.baseHp || targetObj.maxHp || 1;
                    const curHp = targetObj.stats?.currentHp || targetObj.hp || 0;
                    currentValue = curHp / maxHp;
                    break;
                case 'atk':
                    currentValue = targetObj.stats?.atk || targetObj.atk || 0;
                    break;
                case 'def':
                    currentValue = targetObj.stats?.def || targetObj.def || 0;
                    break;
                case 'usp':
                    currentValue = this.context.usp?.[targetId] || 0;
                    break;
                case 'atb':
                    currentValue = this.context.atb || 0;
                    break;
                case 'poise':
                    currentValue = targetObj.stats?.currentPoise || 0;
                    break;
                default:
                    currentValue = targetObj[attribute] || targetObj.stats?.[attribute] || 0;
            }
            
            if (this.compare(currentValue, value, compare)) {
                return true;
            }
        }
        return false;
    }

    /**
     * 检查历史行为
     * @param {Object} condition
     * @param {string} condition.actionType - 行为类型: 'apply_buff'|'receive_buff'|'consume_buff'|'buff_consumed'|'buff_expired'|'cast_skill'|'deal_damage'
     * @param {number} condition.timeWindow - 判断时间窗口（秒），默认4秒
     * @param {string} condition.target - 检查目标
     * @param {Object} condition.params - 额外参数（buffId, skillType等）
     */
    checkActionHistory(condition) {
        const { 
            actionType, 
            timeWindow = 4, 
            target = 'self',
            params = {}
        } = condition;
        
        const history = this.context.actionHistory;
        if (!history) return false;
        
        const currentTime = this.context.currentTime || 0;
        const windowStart = currentTime - timeWindow;
        const targets = this.resolveTargets(target);
        
        // 筛选时间窗口内的历史记录
        const relevantHistory = history.filter(record => 
            record.time >= windowStart && 
            record.time <= currentTime &&
            targets.includes(record.sourceId || record.targetId)
        );
        
        for (const record of relevantHistory) {
            let match = false;
            
            switch (actionType) {
                case 'apply_buff':
                    // 检查是否施加过特定buff
                    match = record.type === 'BUFF_APPLIED' &&
                        record.buffId === params.buffId &&
                        (!params.buffTarget || record.targetId === params.buffTarget);
                    break;
                    
                case 'receive_buff':
                    // 检查是否获得过特定buff
                    match = record.type === 'BUFF_RECEIVED' &&
                        record.buffId === params.buffId &&
                        (!params.buffSource || record.sourceId === params.buffSource);
                    break;
                    
                case 'consume_buff':
                    // 检查是否消耗过特定buff
                    match = record.type === 'BUFF_CONSUMED' &&
                        record.buffId === params.buffId &&
                        (!params.consumeTarget || record.targetId === params.consumeTarget);
                    break;
                    
                case 'buff_consumed':
                    // 检查是否被消耗过特定buff
                    match = record.type === 'BUFF_WAS_CONSUMED' &&
                        record.buffId === params.buffId &&
                        (!params.consumer || record.consumerId === params.consumer);
                    break;
                    
                case 'buff_expired':
                    // 检查buff是否自然结束
                    match = record.type === 'BUFF_EXPIRED' &&
                        record.buffId === params.buffId;
                    break;
                    
                case 'cast_skill':
                    // 检查是否释放过特定类型技能
                    match = record.type === 'SKILL_CAST' &&
                        (!params.skillType || record.skillType === params.skillType) &&
                        (!params.skillId || record.skillId === params.skillId);
                    break;
                    
                case 'deal_damage':
                    // 检查是否用特定类型技能造成过伤害
                    match = record.type === 'DAMAGE_DEALT' &&
                        (!params.skillType || record.skillType === params.skillType) &&
                        (!params.damageType || record.damageType === params.damageType);
                    break;
                    
                default:
                    break;
            }
            
            if (match) return true;
        }
        
        return false;
    }

    /**
     * 检查连击状态
     * @param {Object} condition
     * @param {number|string} condition.value - 连击段数或 'heavy' 表示重击
     */
    checkCombo(condition) {
        const { value } = condition;
        const comboManager = this.context.comboManager;
        const sourceCharId = this.context.sourceCharId;
        const currentTime = this.context.currentTime || 0;
        
        if (!comboManager) return false;
        
        const prediction = comboManager.predictNext?.(sourceCharId, currentTime, false);
        if (!prediction) return false;
        
        if (value === 'heavy') {
            return prediction.isHeavy === true;
        }
        
        return prediction.step === value && !prediction.isHeavy;
    }

    /**
     * 检查是否为主控角色
     */
    checkIsMainChar(condition) {
        const sourceCharId = this.context.sourceCharId;
        const mainCharId = this.context.mainCharId;
        return sourceCharId === mainCharId;
    }

    /**
     * 检查敌人状态
     * @param {Object} condition
     * @param {string} condition.state - 状态类型: 'staggered'|'frozen'|'burning' 等
     */
    checkEnemyState(condition) {
        const { state } = condition;
        const enemy = this.context.enemy;
        const buffManager = this.context.buffManager;
        
        if (!enemy || !buffManager) return false;
        
        const enemyId = enemy.id || 'enemy_01';
        
        switch (state) {
            case 'staggered':
                // 失衡状态（通过检查 status_stun buff）
                return buffManager.getBuffStackCount(enemyId, 'status_stun') > 0;
            case 'frozen':
                return buffManager.getBuffStackCount(enemyId, 'status_freeze') > 0;
            case 'burning':
                return buffManager.getBuffStackCount(enemyId, 'status_burn') > 0;
            case 'conducting':
                return buffManager.getBuffStackCount(enemyId, 'status_conduct') > 0;
            case 'corroding':
                return buffManager.getBuffStackCount(enemyId, 'status_corrosion') > 0;
            case 'has_break':
                return buffManager.getBuffStackCount(enemyId, 'status_break') > 0;
            default:
                // 检查是否有特定buff
                return buffManager.getBuffStackCount(enemyId, state) > 0;
        }
    }

    /**
     * 解析目标类型，返回目标ID数组
     */
    resolveTargets(targetType) {
        const { characters, enemy, sourceCharId, mainCharId } = this.context;
        
        switch (targetType) {
            case 'self':
                return sourceCharId ? [sourceCharId] : [];
                
            case 'ally':
                // 自身或任一队友
                return characters?.map(c => c.id) || [];
                
            case 'other_ally':
                // 其它队友（不包括自身）
                return characters?.filter(c => c.id !== sourceCharId).map(c => c.id) || [];
                
            case 'main_char':
                return mainCharId ? [mainCharId] : [];
                
            case 'enemy':
            case 'target_enemy':
                return enemy ? [enemy.id || 'enemy_01'] : ['enemy_01'];
                
            case 'any':
            default:
                // 所有可能的目标
                const all = characters?.map(c => c.id) || [];
                if (enemy) all.push(enemy.id || 'enemy_01');
                return all;
        }
    }

    /**
     * 根据ID获取目标对象
     */
    getTargetObject(targetId) {
        const { characters, enemy } = this.context;
        
        // 检查是否是敌人
        if (enemy && (enemy.id === targetId || targetId === 'enemy_01')) {
            return enemy;
        }
        
        // 检查是否是角色
        return characters?.find(c => c.id === targetId);
    }

    /**
     * 通用比较方法
     */
    compare(a, b, method) {
        switch (method) {
            case 'eq':
                return a === b;
            case 'gt':
                return a > b;
            case 'lt':
                return a < b;
            case 'gte':
                return a >= b;
            case 'lte':
                return a <= b;
            case 'ne':
                return a !== b;
            default:
                return a >= b;
        }
    }
}

/**
 * 创建条件评估器的便捷函数
 */
export function createConditionEvaluator(context) {
    return new ConditionEvaluator(context);
}

/**
 * 快速评估条件（无需创建实例）
 */
export function evaluateCondition(conditions, context) {
    const evaluator = new ConditionEvaluator(context);
    return evaluator.evaluate(conditions);
}

