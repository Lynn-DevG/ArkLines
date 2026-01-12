/**
 * Skill Schema Definition - 技能数据结构定义
 * 
 * 本文件定义了技能数据的标准结构，用于数据验证和文档参考
 */

/**
 * 技能类型枚举
 */
export const SKILL_TYPE = {
    BASIC: 'BASIC',           // 普通攻击
    TACTICAL: 'TACTICAL',     // 战技
    CHAIN: 'CHAIN',           // 连携技
    ULTIMATE: 'ULTIMATE'      // 终结技
};

/**
 * 技能类型配置（包含显示名称、颜色、图标）
 */
export const SKILL_TYPES = {
    [SKILL_TYPE.BASIC]: {
        name: '普通攻击',
        color: 'bg-slate-600',
        icon: 'Swords'
    },
    [SKILL_TYPE.TACTICAL]: {
        name: '战技',
        color: 'bg-blue-600',
        icon: 'Zap'
    },
    [SKILL_TYPE.CHAIN]: {
        name: '连携技',
        color: 'bg-purple-600',
        icon: 'Hexagon'
    },
    [SKILL_TYPE.ULTIMATE]: {
        name: '终结技',
        color: 'bg-amber-600',
        icon: 'Sparkles'
    }
};

/**
 * 行为类型枚举
 */
export const ACTION_TYPE = {
    DAMAGE: 'damage',                     // 造成伤害
    ADD_STAGGER: 'add_stagger',           // 增加失衡值
    RECOVER_USP_SELF: 'recover_usp_self', // 回复自身终结技能量
    RECOVER_USP_TEAM: 'recover_usp_team', // 回复全队终结技能量
    RECOVER_ATB: 'recover_atb',           // 回复技力
    ADD_BUFF: 'add_buff',                 // 添加buff
    CONSUME_BUFF: 'consume_buff'          // 消耗buff
};

/**
 * 目标类型枚举
 */
export const TARGET_TYPE = {
    SELF: 'self',                 // 自身
    ALLY: 'ally',                 // 自身或队友
    OTHER_ALLY: 'other_ally',     // 其它队友
    MAIN_CHAR: 'main_char',       // 主控角色
    ENEMY: 'enemy',               // 敌人
    TARGET_ENEMY: 'target_enemy', // 目标敌人（当前攻击目标）
    ANY: 'any'                    // 任意目标
};

/**
 * 条件类型枚举
 */
export const CONDITION_TYPE = {
    BUFF_CHECK: 'buff_check',           // 检查目标buff
    ATTRIBUTE_CHECK: 'attribute_check', // 检查目标属性
    ACTION_HISTORY: 'action_history',   // 检查历史行为
    COMBO: 'combo',                     // 检查连击状态
    BUFF_STACKS: 'buff_stacks',         // 检查buff层数（兼容旧格式）
    IS_MAIN_CHAR: 'is_main_char',       // 检查是否为主控
    ENEMY_STATE: 'enemy_state'          // 检查敌人状态
};

/**
 * 比较方式枚举
 */
export const COMPARE_TYPE = {
    EQ: 'eq',   // 等于
    GT: 'gt',   // 大于
    LT: 'lt',   // 小于
    GTE: 'gte', // 大于等于
    LTE: 'lte', // 小于等于
    NE: 'ne'    // 不等于
};

/**
 * 历史行为类型枚举
 */
export const HISTORY_ACTION_TYPE = {
    APPLY_BUFF: 'apply_buff',       // 施加buff
    RECEIVE_BUFF: 'receive_buff',   // 获得buff
    CONSUME_BUFF: 'consume_buff',   // 消耗buff
    BUFF_CONSUMED: 'buff_consumed', // 被消耗buff
    BUFF_EXPIRED: 'buff_expired',   // buff自然结束
    CAST_SKILL: 'cast_skill',       // 释放技能
    DEAL_DAMAGE: 'deal_damage'      // 造成伤害
};

/**
 * 技能数据结构示例/模板
 * 
 * @typedef {Object} SkillDefinition
 * @property {string} id - 技能ID，用于查找索引
 * @property {string} name - 技能名称，显示用
 * @property {string} type - 技能类型 (BASIC|TACTICAL|CHAIN|ULTIMATE)
 * @property {number} duration - 技能持续时间（秒）
 * @property {number} [cooldown] - 冷却时间（秒），通常只有连携技有
 * @property {number} [atbCost] - 技力消耗，通常只有战技有，默认100
 * @property {number} [uspCost] - 终结技能量消耗，只有终结技有
 * @property {number} [uspGain] - 技能完成后获得的终结技能量
 * @property {string} [element] - 伤害属性 (physical|blaze|cold|nature|emag)
 * @property {Array<Condition>} [chainCondition] - 连携条件（通常只有连携技需要）
 * @property {Array<Action>} actions - 技能行为数组
 * @property {Array<SkillVariant>} [variants] - 技能变体数组
 */

/**
 * 行为数据结构
 * 
 * @typedef {Object} Action
 * @property {string} type - 行为类型
 * @property {string} [target] - 行为目标，默认 'enemy'
 * @property {number} [targetCount] - 目标数量，默认 1
 * @property {number} offset - 行为时间偏移（秒）
 * @property {Array<Condition>} [condition] - 行为生效条件
 * @property {Array<Action>} [derivedActions] - 衍生行为
 * @property {Array<ActionVariant>} [variants] - 行为变体
 * 
 * // 伤害类型特有参数
 * @property {number|string} [damageRatio] - 伤害倍率，可以是数值或映射key
 * @property {number} [atb] - 命中恢复的技力
 * @property {number} [poise] - 增加的失衡值
 * 
 * // Buff类型特有参数
 * @property {string} [buffId] - buff ID
 * @property {number} [stacks] - buff层数
 * @property {number} [duration] - buff持续时间（覆盖默认）
 * 
 * // 数值类型特有参数
 * @property {number|string} [value] - 数值，可以是数值或映射key
 */

/**
 * 条件数据结构
 * 
 * @typedef {Object} Condition
 * @property {string} type - 条件类型
 * @property {string} [target] - 检查目标
 * @property {Array<Condition>} [subConditions] - 子条件（AND关系后的OR条件）
 * 
 * // buff_check 特有参数
 * @property {string} [buffId] - buff ID
 * @property {number} [stacks] - 比较层数
 * @property {string} [compare] - 比较方式
 * 
 * // attribute_check 特有参数
 * @property {string} [attribute] - 属性类型 (hp|atk|def|usp|atb|poise等)
 * @property {number} [value] - 比较值
 * 
 * // action_history 特有参数
 * @property {string} [actionType] - 历史行为类型
 * @property {number} [timeWindow] - 时间窗口（秒），默认4秒
 * @property {Object} [params] - 额外参数
 * 
 * // combo 特有参数
 * @property {number|string} [value] - 连击段数或'heavy'
 */

/**
 * 技能变体数据结构
 * 
 * @typedef {Object} SkillVariant
 * @property {string} id - 变体ID
 * @property {string} name - 变体名称
 * @property {Array<Condition>} condition - 变体条件（必须有）
 * @property {number} [duration] - 覆盖持续时间
 * @property {number} [atbCost] - 覆盖技力消耗
 * @property {number} [uspCost] - 覆盖终结技能量消耗
 * @property {number} [uspGain] - 覆盖能量获取
 * @property {Array<Action>} [actions] - 覆盖行为数组
 * // ... 其它可覆盖的技能属性
 */

/**
 * 行为变体数据结构
 * 
 * @typedef {Object} ActionVariant
 * @property {Array<Condition>} condition - 变体条件（必须有）
 * // ... 其它覆盖的行为参数
 */

/**
 * 将旧格式技能数据转换为新格式
 * @param {Object} oldSkill - 旧格式技能数据
 * @returns {Object} - 新格式技能数据
 */
export function convertLegacySkill(oldSkill) {
    const newSkill = {
        id: oldSkill.id,
        name: oldSkill.name,
        type: oldSkill.type,
        duration: oldSkill.duration,
        element: oldSkill.element,
        actions: []
    };

    // 可选字段
    if (oldSkill.cooldown) newSkill.cooldown = oldSkill.cooldown;
    if (oldSkill.atbCost) newSkill.atbCost = oldSkill.atbCost;
    if (oldSkill.uspCost) newSkill.uspCost = oldSkill.uspCost;
    if (oldSkill.uspGain) newSkill.uspGain = oldSkill.uspGain;
    if (oldSkill.uspReply) newSkill.uspReply = oldSkill.uspReply;
    if (oldSkill.animationTime) newSkill.animationTime = oldSkill.animationTime;

    // 转换 damage_ticks -> actions (type: damage)
    if (oldSkill.damage_ticks && Array.isArray(oldSkill.damage_ticks)) {
        oldSkill.damage_ticks.forEach((tick, index) => {
            newSkill.actions.push({
                type: ACTION_TYPE.DAMAGE,
                target: TARGET_TYPE.ENEMY,
                offset: tick.offset || 0,
                element: oldSkill.element || 'physical',
                atb: tick.atb || 0,
                poise: tick.poise || 0,
                index: index + 1,
                // 保留原始数据以便兼容
                _legacy: { ...tick }
            });
        });
    }

    // 转换 anomalies -> actions (type: add_buff)
    if (oldSkill.anomalies && Array.isArray(oldSkill.anomalies)) {
        oldSkill.anomalies.forEach(anomalyGroup => {
            if (!Array.isArray(anomalyGroup)) return;
            
            anomalyGroup.forEach(anomaly => {
                newSkill.actions.push({
                    type: ACTION_TYPE.ADD_BUFF,
                    target: TARGET_TYPE.ENEMY,
                    offset: anomaly.offset || 0,
                    buffId: anomaly.type,
                    stacks: anomaly.stacks || 1,
                    duration: anomaly.duration || undefined,
                    hideDuration: anomaly.hideDuration,
                    // 保留原始数据
                    _legacy: { ...anomaly }
                });
            });
        });
    }

    // 按 offset 排序 actions
    newSkill.actions.sort((a, b) => a.offset - b.offset);

    // 转换变体
    if (oldSkill.variants && Array.isArray(oldSkill.variants)) {
        newSkill.variants = oldSkill.variants.map(variant => {
            const newVariant = {
                id: variant.id,
                name: variant.name,
                condition: variant.condition ? [variant.condition] : null
            };

            // 复制可覆盖的属性
            if (variant.type) newVariant.skillType = variant.type;
            if (variant.duration !== undefined) newVariant.duration = variant.duration;
            if (variant.uspGain !== undefined) newVariant.uspGain = variant.uspGain;

            // 转换变体的 damage_ticks
            if (variant.damage_ticks && Array.isArray(variant.damage_ticks)) {
                newVariant.actions = variant.damage_ticks.map((tick, index) => ({
                    type: ACTION_TYPE.DAMAGE,
                    target: TARGET_TYPE.ENEMY,
                    offset: tick.offset || 0,
                    element: oldSkill.element || 'physical',
                    atb: tick.atb || 0,
                    poise: tick.poise || 0,
                    index: index + 1,
                    _legacy: { ...tick }
                }));
            }

            return newVariant;
        });
    }

    // 保留原始数据引用（便于调试和向后兼容）
    newSkill._legacyFormat = oldSkill;

    return newSkill;
}

/**
 * 验证技能数据结构
 * @param {Object} skill - 技能数据
 * @returns {{ valid: boolean, errors: string[] }}
 */
export function validateSkill(skill) {
    const errors = [];

    if (!skill.id) errors.push('缺少技能ID');
    if (!skill.name) errors.push('缺少技能名称');
    if (!skill.type || !Object.values(SKILL_TYPE).includes(skill.type)) {
        errors.push(`无效的技能类型: ${skill.type}`);
    }
    if (typeof skill.duration !== 'number' || skill.duration < 0) {
        errors.push(`无效的持续时间: ${skill.duration}`);
    }

    // 验证 actions
    if (skill.actions && Array.isArray(skill.actions)) {
        skill.actions.forEach((action, index) => {
            if (!action.type) {
                errors.push(`行为 ${index} 缺少类型`);
            }
            if (typeof action.offset !== 'number') {
                errors.push(`行为 ${index} 缺少时间偏移`);
            }
        });
    }

    // 验证变体
    if (skill.variants && Array.isArray(skill.variants)) {
        skill.variants.forEach((variant, index) => {
            if (!variant.condition) {
                errors.push(`变体 ${index} (${variant.name}) 缺少条件`);
            }
        });
    }

    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 创建空白技能模板
 */
export function createSkillTemplate(type = SKILL_TYPE.BASIC) {
    const template = {
        id: '',
        name: '',
        type,
        duration: 1,
        element: 'physical',
        actions: []
    };

    switch (type) {
        case SKILL_TYPE.TACTICAL:
            template.atbCost = 100;
            template.uspGain = 6.5;
            break;
        case SKILL_TYPE.CHAIN:
            template.cooldown = 15;
            template.uspGain = 10;
            break;
        case SKILL_TYPE.ULTIMATE:
            template.uspCost = 100;
            template.uspReply = 0;
            break;
    }

    return template;
}

/**
 * 创建行为模板
 */
export function createActionTemplate(type = ACTION_TYPE.DAMAGE) {
    const template = {
        type,
        offset: 0,
        target: TARGET_TYPE.ENEMY
    };

    switch (type) {
        case ACTION_TYPE.DAMAGE:
            template.atb = 0;
            template.poise = 10;
            break;
        case ACTION_TYPE.ADD_BUFF:
            template.buffId = '';
            template.stacks = 1;
            break;
        case ACTION_TYPE.CONSUME_BUFF:
            template.buffId = '';
            template.stacks = 1;
            break;
        case ACTION_TYPE.RECOVER_USP_SELF:
        case ACTION_TYPE.RECOVER_USP_TEAM:
        case ACTION_TYPE.RECOVER_ATB:
        case ACTION_TYPE.ADD_STAGGER:
            template.value = 0;
            break;
    }

    return template;
}

/**
 * 创建条件模板
 */
export function createConditionTemplate(type = CONDITION_TYPE.BUFF_CHECK) {
    const template = {
        type,
        target: TARGET_TYPE.SELF
    };

    switch (type) {
        case CONDITION_TYPE.BUFF_CHECK:
            template.buffId = '';
            template.stacks = 1;
            template.compare = COMPARE_TYPE.GTE;
            break;
        case CONDITION_TYPE.ATTRIBUTE_CHECK:
            template.attribute = 'hp';
            template.value = 0;
            template.compare = COMPARE_TYPE.GTE;
            break;
        case CONDITION_TYPE.ACTION_HISTORY:
            template.actionType = HISTORY_ACTION_TYPE.CAST_SKILL;
            template.timeWindow = 4;
            template.params = {};
            break;
        case CONDITION_TYPE.COMBO:
            template.value = 1;
            break;
    }

    return template;
}

