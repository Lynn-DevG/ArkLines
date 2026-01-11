/**
 * targetResolver.js - 统一目标解析工具
 * 
 * 供 ActionExecutor、ConditionEvaluator、VariantResolver 共用
 */

/**
 * 解析目标类型，返回目标ID数组
 * 
 * @param {string} targetType - 目标类型
 * @param {Object} context - 上下文
 * @param {Array} context.characters - 所有角色
 * @param {Object} context.enemy - 敌人对象
 * @param {string} context.sourceCharId - 来源角色ID
 * @param {string} context.mainCharId - 主控角色ID
 * @param {number} count - 返回的最大目标数量（默认无限制）
 * @returns {Array<string>} 目标ID数组
 */
export function resolveTargets(targetType, context, count = Infinity) {
    const { characters, enemy, sourceCharId, mainCharId } = context;
    let candidates = [];
    
    switch (targetType) {
        case 'self':
            return sourceCharId ? [sourceCharId] : [];
            
        case 'ally':
            // 自身或任一队友
            candidates = characters?.map(c => c.id) || [];
            break;
            
        case 'other_ally':
            // 其它队友（不包括自身）
            candidates = characters?.filter(c => c.id !== sourceCharId).map(c => c.id) || [];
            break;
            
        case 'main_char':
            return mainCharId ? [mainCharId] : [];
            
        case 'enemy':
        case 'target_enemy':
            return enemy ? [enemy.id || 'enemy_01'] : ['enemy_01'];
            
        case 'team':
            // 特殊目标：team 用于全队共享的 buff
            return ['team'];
            
        case 'any':
        default:
            // 所有可能的目标
            candidates = characters?.map(c => c.id) || [];
            if (enemy) candidates.push(enemy.id || 'enemy_01');
            break;
    }
    
    return count === Infinity ? candidates : candidates.slice(0, count);
}

/**
 * 解析单个目标ID（简化版，用于简单场景）
 * 
 * @param {string} targetType - 目标类型
 * @param {string} sourceCharId - 来源角色ID
 * @param {Object} enemy - 敌人对象
 * @returns {string} 目标ID
 */
export function resolveTargetId(targetType, sourceCharId, enemy) {
    switch (targetType) {
        case 'self':
            return sourceCharId;
        case 'enemy':
        case 'target_enemy':
        default:
            return enemy?.id || 'enemy_01';
    }
}

/**
 * 根据ID获取目标对象
 * 
 * @param {string} targetId - 目标ID
 * @param {Object} context - 上下文
 * @param {Array} context.characters - 所有角色
 * @param {Object} context.enemy - 敌人对象
 * @returns {Object|null} 目标对象
 */
export function getTargetObject(targetId, context) {
    const { characters, enemy } = context;
    
    // 检查是否是敌人
    if (enemy && (enemy.id === targetId || targetId === 'enemy_01')) {
        return enemy;
    }
    
    // 检查是否是角色
    return characters?.find(c => c.id === targetId) || null;
}
