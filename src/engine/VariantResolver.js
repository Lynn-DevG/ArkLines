/**
 * VariantResolver - 统一的变体解析器
 * 
 * 用于在时间轴编辑和模拟过程中一致地解析技能变体。
 * 提供可在 UI 层使用的简化版本（基于时间轴状态）
 * 和完整版本（基于模拟状态）
 */
import { SKILLS } from '../data/skills.js';
import { ComboManager } from './ComboManager.js';

/**
 * 在编辑阶段（无完整模拟状态）解析技能变体
 * 
 * 支持的条件类型：
 * - combo: 基于连击状态
 * - action_history: 基于已放置的技能
 * 
 * @param {Object} action - 当前 action { id, skillId, charId, startTime }
 * @param {Array} allActions - 所有已放置的 actions
 * @returns {Object} 解析后的技能定义（包含变体覆盖）
 */
export function resolveVariantForTimeline(action, allActions) {
    const skillDef = SKILLS[action.skillId];
    if (!skillDef) return null;
    
    // 如果没有变体，直接返回原始定义
    if (!skillDef.variants || skillDef.variants.length === 0) {
        return skillDef;
    }
    
    // 计算连击状态
    let comboInfo = { step: 1, isHeavy: false };
    
    if (skillDef.type === 'BASIC') {
        // 获取该角色所有普攻，按时间排序
        const charBasicActions = allActions
            .filter(a => a.charId === action.charId && SKILLS[a.skillId]?.type === 'BASIC')
            .sort((a, b) => a.startTime - b.startTime);
        
        const cm = new ComboManager();
        
        for (const act of charBasicActions) {
            const pred = cm.predictNext(act.charId, act.startTime, true);
            // 匹配目标 action
            if (act.id === action.id || 
                (act.charId === action.charId && 
                 act.skillId === action.skillId && 
                 Math.abs(act.startTime - action.startTime) < 0.01)) {
                comboInfo = pred;
                break;
            }
        }
    }
    
    // 查找匹配的变体
    const matchedVariant = skillDef.variants.find(variant => {
        if (!variant.condition) return false;
        
        const conditions = Array.isArray(variant.condition) ? variant.condition : [variant.condition];
        
        for (const cond of conditions) {
            if (matchCondition(cond, {
                comboInfo,
                action,
                allActions
            })) {
                return true;
            }
        }
        return false;
    });
    
    if (matchedVariant) {
        const { condition, ...overrides } = matchedVariant;
        return { ...skillDef, ...overrides };
    }
    
    return skillDef;
}

/**
 * 匹配单个条件
 * @param {Object} cond - 条件对象
 * @param {Object} context - 上下文
 * @returns {boolean}
 */
function matchCondition(cond, context) {
    const { comboInfo, action, allActions } = context;
    
    switch (cond.type) {
        case 'combo':
            // 连击条件
            if (cond.value === 'heavy' && comboInfo.isHeavy) return true;
            if (cond.value === comboInfo.step && !comboInfo.isHeavy) return true;
            return false;
            
        case 'action_history':
            // 检查是否在指定时间内使用过某技能
            return checkActionHistory(cond, action, allActions);
            
        // 以下条件在编辑阶段无法准确评估，返回 false
        // 这些条件需要在模拟时通过 ConditionEvaluator 评估
        case 'buff_check':
        case 'attribute_check':
        case 'is_main_char':
        case 'enemy_state':
            return false;
            
        default:
            return false;
    }
}

/**
 * 检查 action_history 条件
 * 
 * 统一参数格式（与 ConditionEvaluator 保持一致）：
 * - actionType: 'cast_skill' | 'deal_damage' 等
 * - timeWindow: 时间窗口（秒），默认4秒
 * - target: 检查目标，默认 'self'
 * - params: { skillType, skillId, variantType, isHeavy } 等额外参数
 * 
 * 兼容旧格式：skillId, skillType, within
 * 
 * 注意：deal_damage 类型会计算实际伤害时间（startTime + damage.offset）
 */
function checkActionHistory(cond, action, allActions) {
    // 统一参数格式，兼容旧格式
    const actionType = cond.actionType || 'cast_skill';
    const timeWindow = cond.timeWindow ?? cond.within ?? 4;
    const target = cond.target || 'self';
    const params = cond.params || {};
    
    // 兼容旧格式的 skillId 和 skillType
    const skillId = params.skillId || cond.skillId;
    const skillType = params.skillType || cond.skillType;
    const variantType = params.variantType;
    const isHeavy = params.isHeavy;
    
    // 支持 cast_skill 和 deal_damage 类型
    if (actionType !== 'cast_skill' && actionType !== 'deal_damage') {
        return false;
    }
    
    // 解析检查目标（传递当前action时间用于main_char推断）
    const targetCharIds = resolveTargetCharIds(target, action.charId, allActions, action.startTime);
    
    // 查找是否在指定时间内使用过目标技能
    return allActions.some(a => {
        // 检查目标角色
        if (!targetCharIds.includes(a.charId)) return false;
        
        const aSkill = SKILLS[a.skillId];
        if (!aSkill) return false;
        
        // 检查技能ID
        if (skillId && a.skillId !== skillId) return false;
        
        // 检查技能类型
        if (skillType && aSkill.type !== skillType) return false;
        
        // 解析该 action 对应的变体（用于 variantType 和 isHeavy 检查）
        const resolvedSkill = resolveVariantForTimeline(a, allActions);
        
        // 检查变体类型
        if (variantType) {
            const matchedVariantType = resolvedSkill?.variantType;
            if (matchedVariantType !== variantType) return false;
        }
        
        // 检查是否为重击（isHeavy 参数）
        // 重击通过 variantType === 'heavy' 来判断
        if (isHeavy !== undefined) {
            const isHeavyAction = resolvedSkill?.variantType === 'heavy';
            if (isHeavy !== isHeavyAction) return false;
        }
        
        // 计算事件发生的时间
        let eventTime = a.startTime;
        
        if (actionType === 'deal_damage') {
            // deal_damage: 使用第一个 damage action 的 offset 作为伤害时间
            const actions = resolvedSkill?.actions || [];
            const damageAction = actions.find(act => act.type === 'damage');
            if (damageAction) {
                eventTime = a.startTime + (damageAction.offset || 0);
            }
        }
        
        // 检查时间窗口：连携技释放时间必须在事件发生之后
        if (action.startTime < eventTime) return false;
        
        // 检查时间窗口：连携技释放时间必须在事件发生后的 timeWindow 内
        if ((action.startTime - eventTime) > timeWindow) return false;
        
        return true;
    });
}

/**
 * 检查 action_history 条件（导出供 ConstraintValidator 使用）
 * 
 * @param {Object} cond - 条件对象
 * @param {Object} action - 当前 action
 * @param {Array} allActions - 所有已放置的 actions
 * @returns {boolean}
 */
export function checkActionHistoryCondition(cond, action, allActions) {
    return checkActionHistory(cond, action, allActions);
}

/**
 * 解析检查目标角色ID列表
 * 
 * @param {string} target - 目标类型
 * @param {string} sourceCharId - 来源角色ID
 * @param {Array} allActions - 所有已放置的 actions
 * @param {number} [beforeTime] - 可选，用于 main_char 推断时的时间点
 */
function resolveTargetCharIds(target, sourceCharId, allActions, beforeTime = Infinity) {
    // 获取所有角色ID
    const allCharIds = [...new Set(allActions.map(a => a.charId))];
    
    switch (target) {
        case 'self':
            return [sourceCharId];
        case 'ally':
            // 自身或任一队友
            return allCharIds;
        case 'other_ally':
            // 其它队友（不包括自身）
            return allCharIds.filter(id => id !== sourceCharId);
        case 'main_char':
            // 在编辑阶段，通过检查普攻来推断主控角色
            // 找到在 beforeTime 之前最近一次普攻的角色
            const basicActions = allActions
                .filter(a => {
                    const skill = SKILLS[a.skillId];
                    return skill?.type === 'BASIC' && a.startTime < beforeTime;
                })
                .sort((a, b) => b.startTime - a.startTime);
            
            if (basicActions.length > 0) {
                // 返回最近释放普攻的角色
                return [basicActions[0].charId];
            }
            // 如果没有普攻记录，返回所有角色（乐观匹配）
            return allCharIds;
        default:
            return allCharIds;
    }
}

/**
 * 获取解析后的技能持续时间
 */
export function getResolvedDuration(action, allActions) {
    const resolved = resolveVariantForTimeline(action, allActions);
    return resolved?.duration || 0;
}

/**
 * 获取解析后的技能 actions
 */
export function getResolvedActions(action, allActions) {
    const resolved = resolveVariantForTimeline(action, allActions);
    return resolved?.actions || resolved?.damage_ticks || [];
}

/**
 * 为一组 actions 批量解析变体（用于提高性能）
 * @param {Array} actions - 所有 actions
 * @returns {Map} action.id -> resolvedSkillDef 的映射
 */
export function batchResolveVariants(actions) {
    const resolvedMap = new Map();
    
    for (const action of actions) {
        const resolved = resolveVariantForTimeline(action, actions);
        if (resolved) {
            resolvedMap.set(action.id, resolved);
        }
    }
    
    return resolvedMap;
}

