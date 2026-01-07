export const BUFFS = {
    // ============================================
    // 法术附着 (Elemental Attachments)
    // 持续时间无限，最高4层
    // ============================================
    'blaze_attach': {
        id: 'blaze_attach',
        name: '灼热附着',
        type: 'ATTACHMENT',
        element: 'Fire',
        maxLayers: 4,
        description: '灼热属性附着。与其他附着反应时触发燃烧。'
    },
    'cold_attach': {
        id: 'cold_attach',
        name: '寒冷附着',
        type: 'ATTACHMENT',
        element: 'Ice',
        maxLayers: 4,
        description: '寒冷属性附着。与其他附着反应时触发冻结。'
    },
    'nature_attach': {
        id: 'nature_attach',
        name: '自然附着',
        type: 'ATTACHMENT',
        element: 'Nature',
        maxLayers: 4,
        description: '自然属性附着。与其他附着反应时触发腐蚀。'
    },
    'emag_attach': {
        id: 'emag_attach',
        name: '电磁附着',
        type: 'ATTACHMENT',
        element: 'Electric',
        maxLayers: 4,
        description: '电磁属性附着。与其他附着反应时触发导电。'
    },

    // ============================================
    // 法术异常 (Elemental Anomalies)
    // 由不同类型附着反应触发
    // ============================================
    'status_burn': {
        id: 'status_burn',
        name: '燃烧',
        type: 'ANOMALY',
        element: 'Fire',
        duration: 10,
        tickInterval: 1.0,
        effect: 'dot',
        // 基础倍率 = 80% + 80% * 异常等级
        // 每秒持续伤害基础倍率 = 12% + 12% * 异常等级
        baseScale: [0.80, 1.60, 2.40, 3.20],
        dotScale: [0.12, 0.24, 0.36, 0.48],
        description: '造成持续一段时间的灼热伤害。刷新时重置持续时间，伤害按新燃烧计算。'
    },
    'status_freeze': {
        id: 'status_freeze',
        name: '冻结',
        type: 'ANOMALY',
        element: 'Ice',
        // 持续时间根据附着层数：6/7/8/9秒
        durations: [6, 7, 8, 9],
        effect: 'stun',
        // 基础倍率 = 130%
        baseScale: 1.30,
        description: '目标无法行动。冻结期间施加破防或物理异常可触发碎冰。'
    },
    'status_shatter': {
        id: 'status_shatter',
        name: '碎冰',
        type: 'ANOMALY',
        element: 'Physical', // 碎冰造成物理伤害
        effect: 'instant',
        // 基础倍率 = 120% + 120% * 本次冻结的异常等级
        baseScale: [1.20, 2.40, 3.60, 4.80],
        description: '冻结后施加破防或物理异常时触发，造成物理伤害并消耗冻结状态。'
    },
    'status_corrosion': {
        id: 'status_corrosion',
        name: '腐蚀',
        type: 'ANOMALY',
        element: 'Nature',
        duration: 15,
        effect: 'res_shred',
        maxLayers: 4,
        // 根据异常等级：
        // 1层：初始3.6，每秒额外减抗0.84，上限12
        // 2层：初始4.8，每秒额外减抗1.12，上限16
        // 3层：初始6，每秒额外减抗1.4，上限20
        // 4层：初始7.2，每秒额外减抗1.68，上限24
        baseScale: [0.80, 1.60, 2.40, 3.20],
        initialResShred: [3.6, 4.8, 6.0, 7.2],
        resShredPerSec: [0.84, 1.12, 1.4, 1.68],
        maxResShred: [12, 16, 20, 24],
        description: '持续时间内所有抗性逐渐降低，10秒达到上限。刷新时继承已有减抗数值。'
    },
    'status_conduct': {
        id: 'status_conduct',
        name: '导电',
        type: 'ANOMALY',
        element: 'Electric',
        duration: 12,
        effect: 'vulnerability_magic',
        // 根据异常等级：12%/16%/20%/24%
        baseScale: [0.80, 1.60, 2.40, 3.20],
        values: [0.12, 0.16, 0.20, 0.24],
        description: '持续时间内受到的法术伤害增加。'
    },

    // ============================================
    // 破防状态 (Break Status)
    // ============================================
    'status_break': {
        id: 'status_break',
        name: '破防',
        type: 'DEBUFF',
        maxLayers: 4,
        description: '破防层数，持续时间无限。可被物理异常消耗或叠加。'
    },

    // ============================================
    // 失衡状态 (Stagger Status)
    // ============================================
    'status_stun': {
        id: 'status_stun',
        name: '失衡',
        type: 'STUN',
        duration: 5,
        effect: 'vulnerability_stun',
        value: 0.3,
        description: '目标处于失衡状态，受到的伤害增加30%。'
    },

    // ============================================
    // 物理异常 (Physical Anomalies)
    // 目标没有破防时施加一层破防，已有破防时触发异常效果
    // ============================================
    'status_sunder': {
        id: 'status_sunder',
        name: '碎甲',
        type: 'PHYSICAL_ANOMALY',
        effect: 'vulnerability_phys',
        // 额外伤害倍率 = 50% + 50% * 破防层数
        damageScale: [0.50, 1.00, 1.50, 2.00],
        // 易伤根据消耗的破防层数：11%/14%/17%/20%
        values: [0.11, 0.14, 0.17, 0.20],
        // 持续时间根据消耗的破防层数：12/18/24/30秒
        durations: [12, 18, 24, 30],
        description: '如果敌人没有破防，则叠加一层破防。如果敌人已有破防，消耗所有破防层数，使敌人在一段时间内受到的物理伤害增加。'
    },
    'status_slam': {
        id: 'status_slam',
        name: '猛击',
        type: 'PHYSICAL_ANOMALY',
        effect: 'instant_damage',
        // 伤害倍率 = 150% + 150% * 消耗的破防层数
        damageScale: [1.50, 3.00, 4.50, 6.00],
        description: '如果敌人没有破防，则叠加一层破防。如果敌人已有破防，消耗所有破防层数，根据消耗层数造成物理伤害。'
    },
    'status_launch': {
        id: 'status_launch',
        name: '击飞',
        type: 'PHYSICAL_ANOMALY',
        effect: 'poise_damage',
        // 伤害倍率 = 120%
        damageScale: 1.20,
        poiseValue: 10,
        description: '如果敌人没有破防，则叠加一层破防。如果敌人已有破防，叠加一层破防，对敌人积累10点失衡值。'
    },
    'status_knockdown': {
        id: 'status_knockdown',
        name: '倒地',
        type: 'PHYSICAL_ANOMALY',
        effect: 'poise_damage',
        // 伤害倍率 = 120%
        damageScale: 1.20,
        poiseValue: 10,
        description: '如果敌人没有破防，则叠加一层破防。如果敌人已有破防，叠加一层破防，对敌人积累10点失衡值。'
    },

    // ============================================
    // 具名增益 - 增幅 (Amplify)
    // 增加目标造成的伤害，多个来源加算
    // ============================================
    'buff_amplify_physical': {
        id: 'buff_amplify_physical',
        name: '物理增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Physical',
        stackRule: 'additive',
        description: '增加造成的物理伤害，多个来源加算。'
    },
    'buff_amplify_magic': {
        id: 'buff_amplify_magic',
        name: '法术增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Magic',
        stackRule: 'additive',
        description: '增加造成的法术伤害，多个来源加算。'
    },
    'buff_amplify_fire': {
        id: 'buff_amplify_fire',
        name: '灼热增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Fire',
        stackRule: 'additive',
        description: '增加造成的灼热伤害，多个来源加算。'
    },
    'buff_amplify_ice': {
        id: 'buff_amplify_ice',
        name: '寒冷增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Ice',
        stackRule: 'additive',
        description: '增加造成的寒冷伤害，多个来源加算。'
    },
    'buff_amplify_nature': {
        id: 'buff_amplify_nature',
        name: '自然增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Nature',
        stackRule: 'additive',
        description: '增加造成的自然伤害，多个来源加算。'
    },
    'buff_amplify_electric': {
        id: 'buff_amplify_electric',
        name: '电磁增幅',
        type: 'NAMED_BUFF',
        category: 'amplify',
        damageType: 'Electric',
        stackRule: 'additive',
        description: '增加造成的电磁伤害，多个来源加算。'
    },

    // ============================================
    // 具名减益 - 脆弱 (Vulnerable)
    // 增加目标受到的伤害，多个来源加算
    // ============================================
    'debuff_vulnerable_physical': {
        id: 'debuff_vulnerable_physical',
        name: '物理脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Physical',
        stackRule: 'additive',
        description: '增加受到的物理伤害，多个来源加算。'
    },
    'debuff_vulnerable_magic': {
        id: 'debuff_vulnerable_magic',
        name: '法术脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Magic',
        stackRule: 'additive',
        description: '增加受到的法术伤害，多个来源加算。'
    },
    'debuff_vulnerable_fire': {
        id: 'debuff_vulnerable_fire',
        name: '灼热脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Fire',
        stackRule: 'additive',
        description: '增加受到的灼热伤害，多个来源加算。'
    },
    'debuff_vulnerable_ice': {
        id: 'debuff_vulnerable_ice',
        name: '寒冷脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Ice',
        stackRule: 'additive',
        description: '增加受到的寒冷伤害，多个来源加算。'
    },
    'debuff_vulnerable_nature': {
        id: 'debuff_vulnerable_nature',
        name: '自然脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Nature',
        stackRule: 'additive',
        description: '增加受到的自然伤害，多个来源加算。'
    },
    'debuff_vulnerable_electric': {
        id: 'debuff_vulnerable_electric',
        name: '电磁脆弱',
        type: 'NAMED_DEBUFF',
        category: 'vulnerable',
        damageType: 'Electric',
        stackRule: 'additive',
        description: '增加受到的电磁伤害，多个来源加算。'
    },

    // ============================================
    // 具名增益 - 庇护 (Protection)
    // 降低目标受到的所有伤害，多个来源仅取最高值
    // ============================================
    'buff_protection': {
        id: 'buff_protection',
        name: '庇护',
        type: 'NAMED_BUFF',
        category: 'protection',
        stackRule: 'max',
        description: '降低受到的所有伤害，多个来源仅取最高值生效。'
    },

    // ============================================
    // 具名减益 - 虚弱 (Weaken)
    // 降低目标的攻击力，多个来源累乘
    // ============================================
    'debuff_weaken': {
        id: 'debuff_weaken',
        name: '虚弱',
        type: 'NAMED_DEBUFF',
        category: 'weaken',
        stackRule: 'multiplicative',
        description: '降低目标的攻击力，多个来源累乘生效。'
    },

    // ============================================
    // 具名增益 - 连击 (Combo)
    // 增加全队下一个战技或终结技伤害，最高4层
    // ============================================
    'buff_combo': {
        id: 'buff_combo',
        name: '连击',
        type: 'NAMED_BUFF',
        category: 'combo',
        maxLayers: 4,
        // 每层效果：30%/45%/60%/75%
        values: [0.30, 0.45, 0.60, 0.75],
        stackRule: 'layer',
        consumeOn: ['skill', 'ultimate'],
        description: '增加全队释放的下一个战技或终结技伤害，层数可叠加（最高4层）。任何角色释放战技或终结技时消耗并清空。'
    },

    // ============================================
    // 通用词缀效果 (Affix Effects)
    // ============================================
    'affix_slow': {
        id: 'affix_slow',
        name: '减速',
        type: 'AFFIX',
        effect: 'slow',
        description: '降低目标移动速度。'
    },

    // ============================================
    // 角色Buff示例 (Character Buffs)
    // 由角色技能施加的特殊状态
    // ============================================
    'buff_atk_up': {
        id: 'buff_atk_up',
        name: '攻击力提升',
        type: 'CHARACTER_BUFF',
        statMod: { atk: 0.2 },
        description: '攻击力提升20%。'
    },
    'buff_fire_infusion': {
        id: 'buff_fire_infusion',
        name: '灼热附魔',
        type: 'CHARACTER_BUFF',
        special: 'convert_basic_to_fire',
        description: '普通攻击转化为灼热伤害。'
    },

    // ============================================
    // 角色专属Buff (Character-Specific Buffs)
    // 各角色技能施加的专属状态效果，目标可能是敌人或自身
    // ============================================
    'endmin_debuff': {
        id: 'endmin_debuff',
        name: '源石结晶',
        type: 'CHARACTER_BUFF',
        description: '附着源石结晶，在一段时间内将敌人封印。施加物理异常和破防会击碎源石结晶并额外造成物理伤害。'
    },
    'antal_buff': {
        id: 'antal_buff',
        name: '聚焦',
        type: 'CHARACTER_BUFF',
        description: '安塔尔的唯一标记，被聚焦的敌人受到电磁脆弱和灼热脆弱，同时最多聚焦1个敌人。'
    },
    'dapan_buff': {
        id: 'dapan_buff',
        name: '备料',
        type: 'CHARACTER_BUFF',
        description: '当处于备料状态时，连携技命中敌人后立即恢复40%冷却时间并消耗一层备料状态。'
    },
    'lastrite_buff': {
        id: 'lastrite_buff',
        name: '低温灌注',
        type: 'CHARACTER_BUFF',
        description: '持续时间内发动重击时，会生成别礼的幻影，对目标进行追击，造成寒冷伤害，施加寒冷附着。'
    },
    'pograni_buff': {
        id: 'pograni_buff',
        name: '铁誓',
        type: 'CHARACTER_BUFF',
        maxLayers: 5,
        description: '当有敌人受到物理异常效果或骏卫的连携技伤害后，消耗1点铁誓召唤一名盾卫对其发动袭扰，造成物理伤害并恢复一定技力。当消耗的铁誓是最后一点时，四名盾卫发动决胜，对其造成大量物理伤害并恢复大量技力。'
    }
};

// ============================================
// 法术反应 (Elemental Reactions)
// 已有附着（A类型）+ 新附着（B类型）-> 触发B类型对应的异常
// ============================================
export const REACTIONS = {
    // 触发元素 -> 对应异常
    'Fire': 'status_burn',
    'Ice': 'status_freeze',
    'Nature': 'status_corrosion',
    'Electric': 'status_conduct'
};

// ============================================
// 附着到元素的映射
// ============================================
export const ATTACHMENT_TO_ELEMENT = {
    'blaze_attach': 'Fire',
    'cold_attach': 'Ice',
    'nature_attach': 'Nature',
    'emag_attach': 'Electric'
};

// ============================================
// 元素到附着的映射
// ============================================
export const ELEMENT_TO_ATTACHMENT = {
    'Fire': 'blaze_attach',
    'Ice': 'cold_attach',
    'Nature': 'nature_attach',
    'Electric': 'emag_attach'
};

// ============================================
// 物理异常类型列表
// ============================================
export const PHYSICAL_ANOMALY_TYPES = [
    'status_sunder',  // 碎甲
    'status_slam',    // 猛击
    'status_launch',  // 击飞
    'status_knockdown' // 倒地
];

// ============================================
// 法术异常类型列表
// ============================================
export const MAGIC_ANOMALY_TYPES = [
    'status_burn',      // 燃烧
    'status_freeze',    // 冻结
    'status_shatter',   // 碎冰
    'status_corrosion', // 腐蚀
    'status_conduct'    // 导电
];

// ============================================
// Buff ID 别名映射
// 将技能数据中使用的旧名称映射到标准 buff ID
// ============================================
export const BUFF_ID_ALIASES = {
    // 法术异常
    'burning': 'status_burn',
    'conductive': 'status_conduct',
    'corrosion': 'status_corrosion',
    'frozen': 'status_freeze',
    'ice_shatter': 'status_shatter',
    
    // 物理异常
    'knockdown': 'status_knockdown',
    'knockup': 'status_launch',
    'armor_break': 'status_break',
    
    // 具名减益
    'physical_vulnerable': 'debuff_vulnerable_physical',
    'spell_vulnerable': 'debuff_vulnerable_magic',
    
    // 增幅效果
    'fire_enhance': 'buff_amplify_fire',
    'pulse_enhance': 'buff_amplify_electric'
};

/**
 * 解析 buff ID，支持别名映射
 * @param {string} buffId - 原始 buff ID（可能是别名）
 * @returns {string} - 标准化的 buff ID
 */
export function resolveBuffId(buffId) {
    return BUFF_ID_ALIASES[buffId] || buffId;
}

/**
 * 获取 buff 定义，支持别名
 * @param {string} buffId - 原始 buff ID（可能是别名）
 * @returns {object|undefined} - buff 定义对象
 */
export function getBuffDef(buffId) {
    const resolvedId = resolveBuffId(buffId);
    return BUFFS[resolvedId];
}
