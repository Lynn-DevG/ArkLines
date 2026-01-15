/**
 * 技能图标工具函数
 * 用于获取技能图标路径和元素颜色配置
 */

/**
 * 元素颜色映射
 */
export const ELEMENT_COLORS = {
    emag: '#f4c20b',
    blaze: '#fd613d',
    cold: '#2bbcc4',
    physical: '#5e5e5e',
    nature: '#a8bd04',
    // 中文元素名映射（兼容）
    '电磁': '#f4c20b',
    '灼热': '#fd613d',
    '寒冷': '#2bbcc4',
    '物理': '#5e5e5e',
    '自然': '#a8bd04',
};

/**
 * 元素名称标准化（中文转英文）
 */
export const ELEMENT_NAME_MAP = {
    '电磁': 'emag',
    '灼热': 'blaze',
    '寒冷': 'cold',
    '物理': 'physical',
    '自然': 'nature',
    'electric': 'emag',
    'fire': 'blaze',
    'ice': 'cold',
};

/**
 * 武器类型到普攻图标的映射
 */
const WEAPON_ICON_MAP = {
    'one_handed_sword': 'dist/assets/icons/icon_attack_sword.png',
    'two_handed_sword': 'dist/assets/icons/icon_attack_claym.png',
    'caster_unit': 'dist/assets/icons/icon_attack_funnel.png',
    'polearm': 'dist/assets/icons/icon_attack_lance.png',
    'handgun': 'dist/assets/icons/icon_attack_pistol.png',
    // 中文武器名映射
    '单手剑': 'dist/assets/icons/icon_attack_sword.png',
    '双手剑': 'dist/assets/icons/icon_attack_claym.png',
    '施术单元': 'dist/assets/icons/icon_attack_funnel.png',
    '长柄武器': 'dist/assets/icons/icon_attack_lance.png',
    '手铳': 'dist/assets/icons/icon_attack_pistol.png',
};

/**
 * 角色ID到图标前缀的映射
 * charId 的后缀部分可能与图标文件名前缀不完全一致
 */
const CHAR_ICON_PREFIX_MAP = {
    'chr_0003_endminf': 'endmin',
    'chr_0004_pelica': 'pelica',
    'chr_0005_chen': 'chen',
    'chr_0006_wolfgd': 'wolfgd',
    'chr_0007_ikut': 'ikut',
    'chr_0009_azrila': 'azrila',
    'chr_0011_seraph': 'seraph',
    'chr_0012_avywen': 'avywen',
    'chr_0013_aglina': 'aglina',
    'chr_0014_aurora': 'aurora',
    'chr_0015_lifeng': 'lifeng',
    'chr_0016_laevat': 'laevat',
    'chr_0017_yvonne': 'yvonne',
    'chr_0018_dapan': 'dapan',
    'chr_0019_karin': 'karin',
    'chr_0020_meurs': 'meurs',
    'chr_0021_whiten': 'whiten',
    'chr_0022_bounda': 'bounda',
    'chr_0023_antal': 'antal',
    'chr_0024_deepfin': 'deepfin',
    'chr_0025_ardelia': 'ardelia',
    'chr_0026_lastrite': 'lastrite',
    'chr_0029_pograni': 'pograni',
};

/**
 * 角色ID到文件夹名的映射
 * 基于 name_en，去掉空格后转大写
 */
const CHAR_FOLDER_MAP = {
    'chr_0003_endminf': 'ENDMINISTRATOR',
    'chr_0004_pelica': 'PERLICA',
    'chr_0005_chen': 'CHENQIANYU',
    'chr_0006_wolfgd': 'WULFGARD',
    'chr_0007_ikut': 'ARCLIGHT',
    'chr_0009_azrila': 'EMBER',
    'chr_0011_seraph': 'XAIHI',
    'chr_0012_avywen': 'AVYWENNA',
    'chr_0013_aglina': 'GILBERTA',
    'chr_0014_aurora': 'SNOWSHINE',
    'chr_0015_lifeng': 'LIFENG',
    'chr_0016_laevat': 'LAEVATAIN',
    'chr_0017_yvonne': 'YVONNE',
    'chr_0018_dapan': 'DAPAN',
    'chr_0019_karin': 'AKEKURI',
    'chr_0020_meurs': 'CATCHER',
    'chr_0021_whiten': 'ESTELLA',
    'chr_0022_bounda': 'FLUORITE',
    'chr_0023_antal': 'ANTAL',
    'chr_0024_deepfin': 'ALESH',
    'chr_0025_ardelia': 'ARDELIA',
    'chr_0026_lastrite': 'LASTRITE',
    'chr_0029_pograni': 'POGRANICHNK',
};

/**
 * 获取标准化的元素名称
 * @param {string} element - 元素名称（可能是中文或英文）
 * @returns {string} 标准化的英文元素名
 */
export function normalizeElement(element) {
    if (!element) return 'physical';
    const raw = String(element);
    const lower = raw.toLowerCase();
    const normalized = ELEMENT_NAME_MAP[raw] || ELEMENT_NAME_MAP[lower];
    return normalized || lower;
}

/**
 * 获取元素对应的颜色
 * @param {string} element - 元素名称
 * @returns {string} 颜色值
 */
export function getElementColor(element) {
    const normalizedElement = normalizeElement(element);
    return ELEMENT_COLORS[normalizedElement] || ELEMENT_COLORS.physical;
}

/**
 * 获取普通攻击图标路径（根据武器类型）
 * @param {string} weaponType - 武器类型
 * @returns {string} 图标路径
 */
export function getBasicAttackIcon(weaponType) {
    return WEAPON_ICON_MAP[weaponType] || 'dist/assets/icons/default_icon.png';
}

/**
 * 获取角色图标文件夹名
 * @param {string} charId - 角色ID
 * @param {string} nameEn - 角色英文名（备用）
 * @returns {string} 文件夹名
 */
export function getCharFolderName(charId, nameEn = null) {
    if (CHAR_FOLDER_MAP[charId]) {
        return CHAR_FOLDER_MAP[charId];
    }
    // 如果没有映射，尝试从 nameEn 生成
    if (nameEn) {
        return nameEn.replace(/\s+/g, '').toUpperCase();
    }
    // 最后尝试从 charId 提取
    const parts = charId.split('_');
    return parts[parts.length - 1].toUpperCase();
}

/**
 * 获取角色图标前缀
 * @param {string} charId - 角色ID
 * @returns {string} 图标前缀
 */
export function getCharIconPrefix(charId) {
    if (CHAR_ICON_PREFIX_MAP[charId]) {
        return CHAR_ICON_PREFIX_MAP[charId];
    }
    // 如果没有映射，从 charId 提取后缀
    const parts = charId.split('_');
    return parts[parts.length - 1];
}

/**
 * 获取技能图标路径
 * @param {string} charId - 角色ID
 * @param {string} skillType - 技能类型: 'basic' | 'tactical' | 'chain' | 'ultimate'
 * @param {string} weaponType - 武器类型（仅普攻需要）
 * @param {string} nameEn - 角色英文名（备用）
 * @returns {string} 图标路径
 */
export function getSkillIcon(charId, skillType, weaponType = null, nameEn = null) {
    // 普通攻击使用武器图标
    if (skillType === 'basic') {
        return getBasicAttackIcon(weaponType);
    }

    const folderName = getCharFolderName(charId, nameEn);
    const iconPrefix = getCharIconPrefix(charId);

    const iconNameMap = {
        'tactical': `icon_skill_${iconPrefix}_01.png`,
        'chain': `icon_combo_skill_${iconPrefix}_01.png`,
        'ultimate': `icon_ultimate_skill_${iconPrefix}_01.png`,
    };

    const iconName = iconNameMap[skillType];
    if (!iconName) {
        return 'dist/assets/icons/default_icon.png';
    }

    return `dist/assets/avatars/${folderName}/${iconName}`;
}

/**
 * 技能类型配置
 */
export const SKILL_TYPE_CONFIG = {
    basic: {
        name: '普攻',
        order: 0,
    },
    tactical: {
        name: '战技',
        order: 1,
    },
    chain: {
        name: '连携技',
        order: 2,
    },
    ultimate: {
        name: '终结技',
        order: 3,
    },
};

/**
 * 获取角色头像路径
 * @param {string} charId - 角色ID
 * @param {string} nameEn - 角色英文名（备用）
 * @returns {string} 头像图片路径
 */
export function getCharacterAvatar(charId, nameEn = null) {
    const folderName = getCharFolderName(charId, nameEn);
    return `dist/assets/avatars/${folderName}/${folderName}.png`;
}
