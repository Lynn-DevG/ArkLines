/**
 * Weapon data configuration.
 * Loads and processes weapon data from CSV files.
 */

// ============================================================================
// 武器类型映射
// ============================================================================

/**
 * 武器类型映射：CSV中的数字类型 <-> 角色的字符串类型
 */
export const WEAPON_TYPE_MAP = {
    1: 'one_handed_sword',
    2: 'caster_unit',
    3: 'two_handed_sword',
    5: 'polearm',
    6: 'handgun'
};

export const WEAPON_TYPE_REVERSE_MAP = {
    'one_handed_sword': 1,
    'caster_unit': 2,
    'two_handed_sword': 3,
    'polearm': 5,
    'handgun': 6
};

export const WEAPON_TYPE_NAMES = {
    1: '单手剑',
    2: '施术单元',
    3: '双手剑',
    5: '长柄武器',
    6: '手铳'
};

// ============================================================================
// CSV数据 - 武器基础信息
// ============================================================================

const WEAPON_CSV_DATA = [
    { name: "工业零点一", nameEn: "Industry 0.1", weaponId: "wpn_claym_0003", weaponType: 3, rarity: 4, levelTemplateId: "r4_100", mainAttrId: "wpn_attr_str_low", subAttrId: "wpn_sp_attr_atk_low" },
    { name: "遗忘", nameEn: "Oblivion", weaponId: "wpn_funnel_0009", weaponType: 2, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "典范", nameEn: "Exemplar", weaponId: "wpn_claym_0004", weaponType: 3, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_str_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "破碎君王", nameEn: "Sundered Prince", weaponId: "wpn_claym_0008", weaponType: 3, rarity: 6, levelTemplateId: "r6_105", mainAttrId: "wpn_attr_str_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "昔日精品", nameEn: "Former Finery", weaponId: "wpn_claym_0006", weaponType: 3, rarity: 6, levelTemplateId: "r6_110", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_hp_high" },
    { name: "大雷斑", nameEn: "Thunderberge", weaponId: "wpn_claym_0007", weaponType: 3, rarity: 6, levelTemplateId: "r6_110", mainAttrId: "wpn_attr_str_high", subAttrId: "wpn_sp_attr_hp_high" },
    { name: "作品：众生", nameEn: "Opus: The Living", weaponId: "wpn_pistol_0006", weaponType: 6, rarity: 5, levelTemplateId: "r5_103", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_magicdam_mid" },
    { name: "淬火者", nameEn: "Quencher", weaponId: "wpn_claym_0009", weaponType: 3, rarity: 4, levelTemplateId: "r4_110", mainAttrId: "wpn_attr_will_low", subAttrId: "wpn_sp_attr_hp_low" },
    { name: "骑士精神", nameEn: "Detonation Unit", weaponId: "wpn_funnel_0010", weaponType: 2, rarity: 6, levelTemplateId: "r6_90", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_hp_high" },
    { name: "达尔霍夫7", nameEn: "Darhoff 7", weaponId: "wpn_claym_0010", weaponType: 3, rarity: 3, levelTemplateId: "r3_105", mainAttrId: "wpn_attr_main_low", subAttrId: null },
    { name: "显赫声名", nameEn: "Eminent Repute", weaponId: "wpn_sword_0013", weaponType: 1, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_agi_high", subAttrId: "wpn_sp_attr_phydam_high" },
    { name: "探骊", nameEn: "Seeker of Dark Lung", weaponId: "wpn_claym_0011", weaponType: 3, rarity: 5, levelTemplateId: "r5_98", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_usgs_mid" },
    { name: "终点之声", nameEn: "Finishing Call", weaponId: "wpn_claym_0012", weaponType: 3, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_hp_mid" },
    { name: "天使杀手", nameEn: "Aggeloslayer", weaponId: "wpn_lance_0008", weaponType: 5, rarity: 4, levelTemplateId: "r4_95", mainAttrId: "wpn_attr_will_low", subAttrId: "wpn_sp_attr_magicdam_low" },
    { name: "扶摇", nameEn: "Rapid Ascent", weaponId: "wpn_sword_0011", weaponType: 1, rarity: 6, levelTemplateId: "r6_105", mainAttrId: "wpn_attr_agi_high", subAttrId: "wpn_sp_attr_crirate_high" },
    { name: "赫拉芬格", nameEn: "Khravengger", weaponId: "wpn_claym_0013", weaponType: 3, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_str_high", subAttrId: "wpn_sp_attr_crystdam_high" },
    { name: "作品：蚀象", nameEn: "Opus: Etch Figure", weaponId: "wpn_funnel_0006", weaponType: 2, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_main_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "奥佩罗77", nameEn: "Opero 77", weaponId: "wpn_lance_0009", weaponType: 5, rarity: 3, levelTemplateId: "r3_100", mainAttrId: "wpn_attr_main_low", subAttrId: null },
    { name: "黯色火炬", nameEn: "Umbral Torch", weaponId: "wpn_sword_0010", weaponType: 1, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_main_high", subAttrId: "wpn_sp_attr_firedam_high" },
    { name: "古渠", nameEn: "Ancient Canal", weaponId: "wpn_claym_0014", weaponType: 3, rarity: 5, levelTemplateId: "r5_105", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_phy_spell_mid" },
    { name: "荧光雷羽", nameEn: "Fluorescent Roc", weaponId: "wpn_funnel_0003", weaponType: 2, rarity: 4, levelTemplateId: "r4_100", mainAttrId: "wpn_attr_will_low", subAttrId: "wpn_sp_attr_atk_low" },
    { name: "O.B.J.重荷", nameEn: "OBJ Heavy Burden", weaponId: "wpn_claym_0015", weaponType: 3, rarity: 5, levelTemplateId: "r5_105", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_hp_mid" },
    { name: "全自动骇新星", nameEn: "Hypernova Auto", weaponId: "wpn_funnel_0001", weaponType: 2, rarity: 4, levelTemplateId: "r4_95", mainAttrId: "wpn_attr_wisd_low", subAttrId: "wpn_sp_attr_magicdam_low" },
    { name: "吉米尼12", nameEn: "Jiminy 12", weaponId: "wpn_funnel_0002", weaponType: 2, rarity: 3, levelTemplateId: "r3_95", mainAttrId: "wpn_attr_main_low", subAttrId: null },
    { name: "坚城铸造者", nameEn: "Fortmaker", weaponId: "wpn_sword_0007", weaponType: 1, rarity: 5, levelTemplateId: "r5_95", mainAttrId: "wpn_attr_wisd_mid", subAttrId: "wpn_sp_attr_magicdam_mid" },
    { name: "迷失荒野", nameEn: "Wild Wanderer", weaponId: "wpn_funnel_0004", weaponType: 2, rarity: 5, levelTemplateId: "r5_90", mainAttrId: "wpn_attr_wisd_mid", subAttrId: "wpn_sp_attr_electrondam_mid" },
    { name: "十二问", nameEn: "Twelve Questions", weaponId: "wpn_sword_0018", weaponType: 1, rarity: 5, levelTemplateId: "r5_105", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_atk_mid" },
    { name: "悼亡诗", nameEn: "Stanza of Memorials", weaponId: "wpn_funnel_0005", weaponType: 2, rarity: 5, levelTemplateId: "r5_97", mainAttrId: "wpn_attr_wisd_mid", subAttrId: "wpn_sp_attr_atk_mid" },
    { name: "莫奈何", nameEn: "Monaihe", weaponId: "wpn_funnel_0007", weaponType: 2, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_will_mid", subAttrId: "wpn_sp_attr_usgs_mid" },
    { name: "应急手段", nameEn: "Contingent Measure", weaponId: "wpn_sword_0008", weaponType: 1, rarity: 4, levelTemplateId: "r4_100", mainAttrId: "wpn_attr_agi_low", subAttrId: "wpn_sp_attr_phydam_low" },
    { name: "逐鳞3.0", nameEn: "Finchaser 3.0", weaponId: "wpn_sword_0020", weaponType: 1, rarity: 5, levelTemplateId: "r5_95", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_usgs_mid" },
    { name: "爆破单元", nameEn: "Chivalric Virtues", weaponId: "wpn_funnel_0008", weaponType: 2, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_phy_spell_high" },
    { name: "使命必达", nameEn: "Delivery Guaranteed", weaponId: "wpn_funnel_0011", weaponType: 2, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_usgs_high" },
    { name: "布道自由", nameEn: "Freedom to Proselytize", weaponId: "wpn_funnel_0012", weaponType: 2, rarity: 5, levelTemplateId: "r5_95", mainAttrId: "wpn_attr_will_mid", subAttrId: "wpn_sp_attr_heal_mid" },
    { name: "向心之引", nameEn: "Cohesive Traction", weaponId: "wpn_lance_0006", weaponType: 5, rarity: 5, levelTemplateId: "r5_97", mainAttrId: "wpn_attr_will_mid", subAttrId: "wpn_sp_attr_electrondam_mid" },
    { name: "沧溟星梦", nameEn: "Dreams of the Starry Beach", weaponId: "wpn_funnel_0013", weaponType: 2, rarity: 6, levelTemplateId: "r6_90", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_heal_high" },
    { name: "O.B.J.术识", nameEn: "OBJ Arts Identifier", weaponId: "wpn_funnel_0014", weaponType: 2, rarity: 5, levelTemplateId: "r5_95", mainAttrId: "wpn_attr_wisd_mid", subAttrId: "wpn_sp_attr_phy_spell_mid" },
    { name: "寻路者道标", nameEn: "Pathfinder's Beacon", weaponId: "wpn_lance_0003", weaponType: 5, rarity: 4, levelTemplateId: "r4_100", mainAttrId: "wpn_attr_agi_low", subAttrId: "wpn_sp_attr_atk_low" },
    { name: "嵌合正义", nameEn: "Chimeric Justice", weaponId: "wpn_lance_0004", weaponType: 5, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_usgs_mid" },
    { name: "骁勇", nameEn: "Valiant", weaponId: "wpn_lance_0010", weaponType: 5, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_agi_high", subAttrId: "wpn_sp_attr_phydam_high" },
    { name: "J.E.T.", nameEn: "JET", weaponId: "wpn_lance_0011", weaponType: 5, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "负山", nameEn: "Mountain Bearer", weaponId: "wpn_lance_0012", weaponType: 5, rarity: 6, levelTemplateId: "r6_110", mainAttrId: "wpn_attr_agi_high", subAttrId: "wpn_sp_attr_phydam_high" },
    { name: "艺术暴君", nameEn: "Artzy Tyrannical", weaponId: "wpn_pistol_0010", weaponType: 6, rarity: 6, levelTemplateId: "r6_110", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_crirate_high" },
    { name: "O.B.J.尖峰", nameEn: "OBJ Razorhorn", weaponId: "wpn_lance_0013", weaponType: 5, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_will_mid", subAttrId: "wpn_sp_attr_phydam_mid" },
    { name: "佩科5", nameEn: "Peco 5", weaponId: "wpn_pistol_0001", weaponType: 6, rarity: 3, levelTemplateId: "r3_95", mainAttrId: "wpn_attr_main_low", subAttrId: null },
    { name: "呼啸守卫", nameEn: "Howling Guard", weaponId: "wpn_pistol_0002", weaponType: 6, rarity: 4, levelTemplateId: "r4_100", mainAttrId: "wpn_attr_wisd_low", subAttrId: "wpn_sp_attr_atk_low" },
    { name: "长路", nameEn: "Long Road", weaponId: "wpn_pistol_0003", weaponType: 6, rarity: 4, levelTemplateId: "r4_90", mainAttrId: "wpn_attr_str_low", subAttrId: "wpn_sp_attr_magicdam_low" },
    { name: "白夜新星", nameEn: "White Night Nova", weaponId: "wpn_sword_0014", weaponType: 1, rarity: 6, levelTemplateId: "r6_105", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_phy_spell_high" },
    { name: "理性告别", nameEn: "Rational Farewell", weaponId: "wpn_pistol_0004", weaponType: 6, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_str_mid", subAttrId: "wpn_sp_attr_firedam_mid" },
    { name: "领航者", nameEn: "Navigator", weaponId: "wpn_pistol_0005", weaponType: 6, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_main_high", subAttrId: "wpn_sp_attr_usgs_high" },
    { name: "楔子", nameEn: "Wedge", weaponId: "wpn_pistol_0008", weaponType: 6, rarity: 6, levelTemplateId: "r6_105", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "熔铸火焰", nameEn: "Forgeborn Scathe", weaponId: "wpn_sword_0006", weaponType: 1, rarity: 6, levelTemplateId: "r6_110", mainAttrId: "wpn_attr_wisd_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "同类相食", nameEn: "Clannibal", weaponId: "wpn_pistol_0009", weaponType: 6, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_str_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "不知归", nameEn: "Never Rest", weaponId: "wpn_sword_0016", weaponType: 1, rarity: 6, levelTemplateId: "r6_95", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "O.B.J.迅极", nameEn: "OBJ Velocitous", weaponId: "wpn_pistol_0012", weaponType: 6, rarity: 5, levelTemplateId: "r5_105", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_usgs_mid" },
    { name: "塔尔11", nameEn: "Tarr 11", weaponId: "wpn_sword_0003", weaponType: 1, rarity: 3, levelTemplateId: "r3_100", mainAttrId: "wpn_attr_main_low", subAttrId: null },
    { name: "钢铁余音", nameEn: "Sundering Steel", weaponId: "wpn_sword_0005", weaponType: 1, rarity: 5, levelTemplateId: "r5_105", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_phydam_mid" },
    { name: "浪潮", nameEn: "Wave Tide", weaponId: "wpn_sword_0009", weaponType: 1, rarity: 4, levelTemplateId: "r4_95", mainAttrId: "wpn_attr_wisd_low", subAttrId: "wpn_sp_attr_atk_low" },
    { name: "热熔切割器", nameEn: "Thermite Cutter", weaponId: "wpn_sword_0012", weaponType: 1, rarity: 6, levelTemplateId: "r6_90", mainAttrId: "wpn_attr_will_high", subAttrId: "wpn_sp_attr_atk_high" },
    { name: "仰止", nameEn: "Aspirant", weaponId: "wpn_sword_0015", weaponType: 1, rarity: 5, levelTemplateId: "r5_100", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_phydam_mid" },
    { name: "O.B.J.轻芒", nameEn: "OBJ Edge of Lightness", weaponId: "wpn_sword_0019", weaponType: 1, rarity: 5, levelTemplateId: "r5_90", mainAttrId: "wpn_attr_agi_mid", subAttrId: "wpn_sp_attr_atk_mid" },
    { name: "宏愿", nameEn: "Grand Vision", weaponId: "wpn_sword_0021", weaponType: 1, rarity: 6, levelTemplateId: "r6_100", mainAttrId: "wpn_attr_agi_high", subAttrId: "wpn_sp_attr_atk_high" },
];

// ============================================================================
// CSV数据 - 武器属性技能
// ============================================================================

const WEAPON_ATTR_DATA = {
    // 主属性加成（固定值）
    "wpn_attr_str_low": { displayName: "力量提升·小", addType: "strength", values: [12, 21, 31, 40, 50, 60, 56, 79, 93] },
    "wpn_attr_str_mid": { displayName: "力量提升·中", addType: "strength", values: [16, 28, 41, 54, 67, 80, 92, 105, 124] },
    "wpn_attr_str_high": { displayName: "力量提升·大", addType: "strength", values: [20, 36, 52, 68, 84, 100, 116, 132, 156] },
    "wpn_attr_agi_low": { displayName: "敏捷提升·小", addType: "agility", values: [12, 21, 31, 40, 50, 60, 56, 79, 93] },
    "wpn_attr_agi_mid": { displayName: "敏捷提升·中", addType: "agility", values: [16, 28, 41, 54, 67, 80, 92, 105, 124] },
    "wpn_attr_agi_high": { displayName: "敏捷提升·大", addType: "agility", values: [20, 36, 52, 68, 84, 100, 116, 132, 156] },
    "wpn_attr_wisd_low": { displayName: "智识提升·小", addType: "intelligence", values: [12, 21, 31, 40, 50, 60, 56, 79, 93] },
    "wpn_attr_wisd_mid": { displayName: "智识提升·中", addType: "intelligence", values: [16, 28, 41, 54, 67, 80, 92, 105, 124] },
    "wpn_attr_wisd_high": { displayName: "智识提升·大", addType: "intelligence", values: [20, 36, 52, 68, 84, 100, 116, 132, 156] },
    "wpn_attr_will_low": { displayName: "意志提升·小", addType: "willpower", values: [12, 21, 31, 40, 50, 60, 56, 79, 93] },
    "wpn_attr_will_mid": { displayName: "意志提升·中", addType: "willpower", values: [16, 28, 41, 54, 67, 80, 92, 105, 124] },
    "wpn_attr_will_high": { displayName: "意志提升·大", addType: "willpower", values: [20, 36, 52, 68, 84, 100, 116, 132, 156] },
    "wpn_attr_main_low": { displayName: "主属性提升·小", addType: "mainAttr", values: [8, 15, 21, 28, 35, 42, 48, 55, 65] },
    "wpn_attr_main_high": { displayName: "主属性提升·大", addType: "mainAttr", values: [14, 25, 36, 47, 58, 70, 81, 92, 109] },
    
    // 次要属性加成（百分比或固定值）
    "wpn_sp_attr_atk_low": { displayName: "攻击提升·小", addType: "atkPercent", values: [0.03, 0.054, 0.078, 0.102, 0.126, 0.15, 0.174, 0.198, 0.234] },
    "wpn_sp_attr_atk_mid": { displayName: "攻击提升·中", addType: "atkPercent", values: [0.04, 0.072, 0.104, 0.136, 0.168, 0.2, 0.232, 0.264, 0.312] },
    "wpn_sp_attr_atk_high": { displayName: "攻击提升·大", addType: "atkPercent", values: [0.05, 0.09, 0.13, 0.17, 0.21, 0.25, 0.29, 0.33, 0.39] },
    "wpn_sp_attr_hp_low": { displayName: "生命提升·小", addType: "hpPercent", values: [0.06, 0.108, 0.156, 0.204, 0.252, 0.3, 0.348, 0.396, 0.468] },
    "wpn_sp_attr_hp_mid": { displayName: "生命提升·中", addType: "hpPercent", values: [0.08, 0.144, 0.208, 0.272, 0.336, 0.4, 0.464, 0.528, 0.624] },
    "wpn_sp_attr_hp_high": { displayName: "生命提升·大", addType: "hpPercent", values: [0.1, 0.18, 0.26, 0.34, 0.42, 0.5, 0.58, 0.66, 0.78] },
    "wpn_sp_attr_phydam_low": { displayName: "物理伤害提升·小", addType: "physicalDamage", values: [0.0333, 0.06, 0.0867, 0.1133, 0.14, 0.1667, 0.1933, 0.22, 0.26] },
    "wpn_sp_attr_phydam_mid": { displayName: "物理伤害提升·中", addType: "physicalDamage", values: [0.0444, 0.08, 0.1156, 0.1511, 0.1867, 0.2222, 0.2578, 0.2933, 0.3467] },
    "wpn_sp_attr_phydam_high": { displayName: "物理伤害提升·大", addType: "physicalDamage", values: [0.0556, 0.1, 0.1444, 0.1889, 0.2333, 0.2778, 0.3222, 0.3667, 0.4333] },
    "wpn_sp_attr_magicdam_low": { displayName: "法术伤害提升·小", addType: "magicDamage", values: [0.03, 0.06, 0.09, 0.11, 0.14, 0.17, 0.19, 0.22, 0.26] },
    "wpn_sp_attr_magicdam_mid": { displayName: "法术伤害提升·中", addType: "magicDamage", values: [0.04, 0.08, 0.12, 0.15, 0.19, 0.22, 0.26, 0.29, 0.35] },
    "wpn_sp_attr_firedam_mid": { displayName: "灼热伤害提升·中", addType: "fireDamage", values: [0.0444, 0.08, 0.1156, 0.1511, 0.1867, 0.2222, 0.2578, 0.2933, 0.3467] },
    "wpn_sp_attr_firedam_high": { displayName: "灼热伤害提升·大", addType: "fireDamage", values: [0.0556, 0.1, 0.1444, 0.1889, 0.2333, 0.2778, 0.3222, 0.3667, 0.4333] },
    "wpn_sp_attr_crystdam_high": { displayName: "寒冷伤害提升·大", addType: "iceDamage", values: [0.0556, 0.1, 0.1444, 0.1889, 0.2333, 0.2778, 0.3222, 0.3667, 0.4333] },
    "wpn_sp_attr_electrondam_mid": { displayName: "电磁伤害提升·中", addType: "electricDamage", values: [0.0444, 0.08, 0.1156, 0.1511, 0.1867, 0.2222, 0.2578, 0.2933, 0.3467] },
    "wpn_sp_attr_crirate_high": { displayName: "暴击率提升·大", addType: "critRate", values: [0.025, 0.045, 0.046, 0.085, 0.105, 0.125, 0.145, 0.165, 0.195] },
    "wpn_sp_attr_usgs_mid": { displayName: "终结技充能效率提升·中", addType: "ultimateChargeRate", values: [0.05, 0.09, 0.12, 0.16, 0.2, 0.24, 0.28, 0.31, 0.37] },
    "wpn_sp_attr_usgs_high": { displayName: "终结技充能效率提升·大", addType: "ultimateChargeRate", values: [0.06, 0.11, 0.15, 0.2, 0.25, 0.3, 0.35, 0.39, 0.46] },
    "wpn_sp_attr_phy_spell_mid": { displayName: "源石技艺强度提升·中", addType: "artsIntensity", values: [8, 14, 20, 27, 33, 40, 46, 52, 62] },
    "wpn_sp_attr_phy_spell_high": { displayName: "源石技艺强度提升·大", addType: "artsIntensity", values: [10, 18, 26, 34, 42, 50, 58, 66, 78] },
    "wpn_sp_attr_heal_mid": { displayName: "治疗效率提升·中", addType: "healEfficiency", values: [0.05, 0.09, 0.12, 0.16, 0.2, 0.24, 0.28, 0.31, 0.37] },
    "wpn_sp_attr_heal_high": { displayName: "治疗效率提升·大", addType: "healEfficiency", values: [0.06, 0.11, 0.15, 0.2, 0.25, 0.3, 0.35, 0.39, 0.46] },
};

// ============================================================================
// CSV数据 - 武器攻击力等级映射
// ============================================================================

const WEAPON_ATK_MAPPING = {
    // levelTemplateId: [lv1, lv2, ..., lv99]
    "r6_90": [45,50,54,59,63,68,72,77,81,86,90,95,99,104,108,113,117,122,126,131,135,140,144,149,153,158,162,167,171,176,180,185,189,194,198,203,207,212,216,221,225,230,234,239,243,248,252,257,261,266,270,275,279,284,288,293,297,302,306,311,315,320,324,329,333,338,342,347,351,356,360,365,369,374,378,383,387,392,396,401,405,410,414,419,423,428,432,437,441,446,450,455,459,464,468,473,477,482,486],
    "r6_95": [48,52,57,62,67,71,76,81,86,90,95,100,105,109,114,119,124,128,133,138,143,147,152,157,162,166,171,176,181,185,190,195,200,204,209,214,219,223,228,233,238,242,247,252,257,261,266,271,276,280,285,290,295,299,304,309,314,318,323,328,333,337,342,347,352,356,361,366,371,375,380,385,390,394,399,404,409,413,418,423,428,432,437,442,447,451,456,461,466,470,475,480,485,489,494,499,504,508,513],
    "r6_100": [50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,205,210,215,220,225,230,235,240,245,250,255,260,265,270,275,280,285,290,295,300,305,310,315,320,325,330,335,340,345,350,355,360,365,370,375,380,385,390,395,400,405,410,415,420,425,430,435,440,445,450,455,460,465,470,475,480,485,490,495,500,505,510,515,520,525,530,535,540],
    "r6_105": [53,58,63,68,74,79,84,89,95,100,105,110,116,121,126,131,137,142,147,152,158,163,168,173,179,184,189,194,200,205,210,215,221,226,231,236,242,247,252,257,263,268,273,278,284,289,294,299,305,310,315,320,326,331,336,341,347,352,357,362,368,373,378,383,389,394,399,404,410,415,420,425,431,436,441,446,452,457,462,467,473,478,483,488,494,499,504,509,515,520,525,530,536,541,546,551,557,562,567],
    "r6_110": [55,61,66,72,77,83,88,94,99,105,110,116,121,127,132,138,143,149,154,160,165,171,176,182,187,193,198,204,209,215,220,226,231,237,242,248,253,259,264,270,275,281,286,292,297,303,308,314,319,325,330,336,341,347,352,358,363,369,374,380,385,391,396,402,407,413,418,424,429,435,440,446,451,457,462,468,473,479,484,490,495,501,506,512,517,523,528,534,539,545,550,556,561,567,572,578,583,589,594],
    "r5_90": [37,41,45,49,52,56,60,63,67,71,75,78,82,86,90,93,97,101,105,108,112,116,120,123,127,131,134,138,142,146,149,153,157,161,164,168,172,176,179,183,187,190,194,198,202,205,209,213,217,220,224,228,232,235,239,243,247,250,254,258,261,265,269,273,276,280,284,288,291,295,299,303,306,310,314,317,321,325,329,332,336,340,344,347,351,355,359,362,366,370,374,377,381,385,388,392,396,400,403],
    "r5_95": [39,43,47,51,55,59,63,67,71,75,79,83,87,91,95,99,103,106,110,114,118,122,126,130,134,138,142,146,150,154,158,162,166,170,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,233,237,240,244,248,252,256,260,264,268,272,276,280,284,288,292,296,300,304,308,311,315,319,323,327,331,335,339,343,347,351,355,359,363,367,371,375,378,382,386,390,394,398,402,406,410,414,418,422,426],
    "r5_97": [40,44,48,52,56,60,64,68,72,76,81,85,89,93,97,101,105,109,113,117,121,125,129,133,137,141,145,149,153,157,161,165,169,173,177,181,185,189,193,197,201,205,209,213,217,221,225,229,233,238,242,246,250,254,258,262,266,270,274,278,282,286,290,294,298,302,306,310,314,318,322,326,330,334,338,342,346,350,354,358,362,366,370,374,378,382,386,390,394,399,403,407,411,415,419,423,427,431,435],
    "r5_98": [41,45,49,53,57,61,65,69,73,77,81,85,89,94,98,102,106,110,114,118,122,126,130,134,138,142,146,150,154,159,163,167,171,175,179,183,187,191,195,199,203,207,211,216,220,224,228,232,236,240,244,248,252,256,261,265,269,273,277,281,285,289,293,297,301,305,309,313,317,321,325,329,333,338,342,346,350,354,358,362,366,370,374,378,382,386,390,394,399,403,407,411,415,419,423,427,431,435,439],
    "r5_100": [42,46,50,54,58,62,66,71,75,79,83,87,91,95,100,104,108,112,116,120,125,129,133,137,141,145,149,154,158,162,166,170,174,178,183,187,191,195,199,203,208,212,216,220,224,228,232,237,241,245,249,253,257,261,266,270,274,278,282,286,291,295,299,303,307,311,315,320,324,328,332,336,340,344,349,353,357,361,365,369,374,378,382,386,390,394,398,403,407,411,415,419,423,427,432,436,440,444,448],
    "r5_103": [43,47,51,56,60,64,68,73,77,81,85,90,94,98,103,107,111,115,120,124,128,133,137,141,145,150,154,158,162,167,171,175,180,184,188,192,197,201,205,209,214,218,222,227,231,235,240,244,248,252,256,261,265,269,274,278,282,286,291,295,299,303,308,312,316,321,325,329,333,338,342,346,351,355,359,363,368,372,376,380,385,389,393,398,402,406,410,415,419,423,427,432,436,440,445,449,453,457,462],
    "r5_105": [44,48,52,57,61,65,70,74,78,83,87,92,96,100,105,109,113,118,122,126,131,135,139,144,148,153,157,161,166,170,174,179,183,187,192,196,200,205,209,214,218,222,227,231,235,240,244,248,253,257,261,266,270,275,279,283,288,292,296,301,305,309,314,318,322,327,331,336,340,344,349,353,357,362,366,370,375,379,383,388,392,397,401,405,410,414,418,423,427,431,436,440,444,449,453,458,462,466,471],
    "r5_110": [46,50,55,59,64,68,73,78,82,87,91,96,100,105,110,114,119,123,128,132,137,142,146,151,155,160,164,169,173,178,183,187,192,196,201,205,210,215,219,224,228,233,237,242,247,251,256,260,265,269,274,278,283,288,292,297,301,306,310,315,320,324,329,333,338,342,347,352,356,361,365,370,374,379,383,388,393,397,402,406,411,415,420,425,429,434,438,443,447,452,457,461,466,470,475,479,484,488,493],
    "r4_90": [31,34,37,40,43,47,50,53,56,59,62,65,68,71,74,78,81,84,87,90,93,96,99,102,105,109,112,115,118,121,124,127,130,133,136,140,143,146,149,152,155,158,161,164,167,171,174,177,180,183,186,189,192,195,198,202,205,208,211,214,217,220,223,226,229,233,236,239,242,245,248,251,254,257,260,264,267,270,273,276,279,282,285,288,291,295,298,301,304,307,310,313,316,319,322,326,329,332,335],
    "r4_95": [33,36,39,43,46,49,52,56,59,62,65,69,72,75,79,82,85,88,92,95,98,101,105,108,111,115,118,121,124,128,131,134,137,141,144,147,151,154,157,160,164,167,170,173,177,180,183,187,190,193,196,200,203,206,209,213,216,219,223,226,229,232,236,239,242,245,249,252,255,259,262,265,268,272,275,278,281,285,288,291,295,298,301,304,308,311,314,317,321,324,327,330,334,337,340,344,347,350,353],
    "r4_100": [34,38,41,45,48,52,55,59,62,65,69,72,76,79,83,86,90,93,96,100,103,107,110,114,117,121,124,127,131,134,138,141,145,148,152,155,158,162,165,169,172,176,179,183,186,189,193,196,200,203,207,210,214,217,220,224,227,231,234,238,241,245,248,251,255,258,262,265,269,272,276,279,282,286,289,293,296,300,303,307,310,313,317,320,324,327,331,334,338,341,344,348,351,355,358,362,365,369,372],
    "r4_110": [38,42,45,49,53,57,61,64,68,72,76,80,83,87,91,95,99,102,106,110,114,117,121,125,129,133,136,140,144,148,152,155,159,163,167,171,174,178,182,186,189,193,197,201,205,208,212,216,220,224,227,231,235,239,242,246,250,254,258,261,265,269,273,277,280,284,288,292,296,299,303,307,311,314,318,322,326,330,333,337,341,345,349,352,356,360,364,368,371,375,379,383,386,390,394,398,402,405,409],
    "r3_95": [27,30,33,35,38,41,43,46,49,52,54,57,60,62,65,68,71,73,76,79,81,84,87,90,92,95,98,100,103,106,109,111,114,117,120,122,125,128,130,133,136,139,141,144,147,149,152,155,158,160,163,166,168,171,174,177,179,182,185,187,190,193,196,198,201,204,206,209,212,215,217,220,223,225,228,231,234,236,239,242,244,247,250,253,255,258,261,263,266,269,272,274,277,280,282,285,288,291,293],
    "r3_100": [29,31,34,37,40,43,46,49,51,54,57,60,63,66,69,71,74,77,80,83,86,89,91,94,97,100,103,106,109,111,114,117,120,123,126,129,132,134,137,140,143,146,149,152,154,157,160,163,166,169,172,174,177,180,183,186,189,192,194,197,200,203,206,209,212,214,217,220,223,226,229,232,234,237,240,243,246,249,252,254,257,260,263,266,269,272,274,277,280,283,286,289,292,294,297,300,303,306,309],
    "r3_105": [30,33,36,39,42,45,48,51,54,57,60,63,66,69,72,75,78,81,84,87,90,93,96,99,102,105,108,111,114,117,120,123,126,129,132,135,138,141,144,147,150,153,156,159,162,165,168,171,174,177,180,183,186,189,192,195,198,201,204,207,210,213,216,219,222,225,228,231,234,237,240,243,246,249,252,255,258,261,264,267,270,273,276,279,282,285,288,291,294,297,300,303,306,309,312,315,318,321,324],
};

// ============================================================================
// 构建武器索引
// ============================================================================

/**
 * 武器数据索引（按weaponId）
 */
export const WEAPONS = {};

WEAPON_CSV_DATA.forEach(weapon => {
    WEAPONS[weapon.weaponId] = {
        id: weapon.weaponId,
        name: weapon.name,
        nameEn: weapon.nameEn,
        rarity: weapon.rarity,
        weaponType: weapon.weaponType,
        weaponTypeStr: WEAPON_TYPE_MAP[weapon.weaponType],
        levelTemplateId: weapon.levelTemplateId,
        mainAttrId: weapon.mainAttrId,
        subAttrId: weapon.subAttrId
    };
});

// ============================================================================
// API 函数
// ============================================================================

/**
 * 按角色武器类型获取可用武器列表
 * @param {string} weaponTypeStr - 角色的武器类型字符串（如 'one_handed_sword'）
 * @returns {Array} 武器列表，按稀有度降序排列
 */
export function getWeaponsByType(weaponTypeStr) {
    const weaponTypeNum = WEAPON_TYPE_REVERSE_MAP[weaponTypeStr];
    if (!weaponTypeNum) return [];
    
    return Object.values(WEAPONS)
        .filter(w => w.weaponType === weaponTypeNum)
        .sort((a, b) => b.rarity - a.rarity); // 高稀有度优先
}

/**
 * 获取武器在指定等级的攻击力
 * @param {string} weaponId - 武器ID
 * @param {number} level - 武器等级 (1-99)
 * @returns {number} 攻击力数值
 */
export function getWeaponAtk(weaponId, level) {
    const weapon = WEAPONS[weaponId];
    if (!weapon) return 0;
    
    const atkArray = WEAPON_ATK_MAPPING[weapon.levelTemplateId];
    if (!atkArray) return 0;
    
    const idx = Math.max(0, Math.min(level - 1, atkArray.length - 1));
    return atkArray[idx];
}

/**
 * 获取武器属性加成
 * @param {string} weaponId - 武器ID
 * @param {number} mainAttrLevel - 主属性技能等级 (1-9)
 * @param {number} subAttrLevel - 次要属性技能等级 (1-9)
 * @param {string} characterMainAttr - 角色的主属性类型（用于解析"主属性"加成）
 * @returns {Object} 属性加成对象
 */
export function getWeaponAttrBonus(weaponId, mainAttrLevel, subAttrLevel = null, characterMainAttr = null) {
    const weapon = WEAPONS[weaponId];
    if (!weapon) return { mainAttr: null, subAttr: null };
    
    const result = {
        mainAttr: null,
        subAttr: null
    };
    
    // 如果 subAttrLevel 未传入，则使用 mainAttrLevel（向后兼容）
    const actualSubAttrLevel = subAttrLevel !== null ? subAttrLevel : mainAttrLevel;
    
    const mainLvIdx = Math.max(0, Math.min(mainAttrLevel - 1, 8)); // 1-9 -> 0-8
    const subLvIdx = Math.max(0, Math.min(actualSubAttrLevel - 1, 8));
    
    // 主属性加成
    if (weapon.mainAttrId && WEAPON_ATTR_DATA[weapon.mainAttrId]) {
        const attrData = WEAPON_ATTR_DATA[weapon.mainAttrId];
        let attrType = attrData.addType;
        
        // 如果是主属性类型，需要根据角色主属性解析
        if (attrType === 'mainAttr' && characterMainAttr) {
            attrType = characterMainAttr;
        }
        
        result.mainAttr = {
            type: attrType,
            value: attrData.values[mainLvIdx],
            displayName: attrData.displayName
        };
    }
    
    // 次要属性加成
    if (weapon.subAttrId && WEAPON_ATTR_DATA[weapon.subAttrId]) {
        const attrData = WEAPON_ATTR_DATA[weapon.subAttrId];
        result.subAttr = {
            type: attrData.addType,
            value: attrData.values[subLvIdx],
            displayName: attrData.displayName
        };
    }
    
    return result;
}

/**
 * 获取武器完整信息（包含计算后的属性）
 * @param {string} weaponId - 武器ID
 * @param {number} level - 武器等级 (1-99)
 * @param {number} mainAttrLevel - 主属性技能等级 (1-9)
 * @param {number} subAttrLevel - 次要属性技能等级 (1-9)
 * @param {string} characterMainAttr - 角色主属性
 * @returns {Object|null} 武器完整信息
 */
export function getWeaponInfo(weaponId, level = 1, mainAttrLevel = 1, subAttrLevel = 1, characterMainAttr = null) {
    const weapon = WEAPONS[weaponId];
    if (!weapon) return null;
    
    return {
        ...weapon,
        atk: getWeaponAtk(weaponId, level),
        ...getWeaponAttrBonus(weaponId, mainAttrLevel, subAttrLevel, characterMainAttr)
    };
}

