/**
 * Character data configuration.
 * Sourced from character_info.json with additional computed fields.
 */
import characterInfoData from './characters/character_info.json';
import { getLevelStats as getLevelStatsFromMapping } from './levelMappings';
import { getWeaponAtk, getWeaponAttrBonus, WEAPONS } from './weapons';

/**
 * Process character data to add any missing fields and ensure compatibility.
 */
function processCharacterData(characters) {
    return characters.map(char => {
        // Get initial stats from level mappings (level 1, elite 0)
        const levelData = getLevelStatsFromMapping(char.id, 1, 0);

        // Define stats structure based on available data or fallbacks
        const computedStats = levelData ? {
            hp: levelData.hp,
            atk: levelData.atk,
            def: 0,
            strength: levelData.strength,
            agility: levelData.agility,
            intelligence: levelData.intelligence,
            willpower: levelData.willpower,
            baseHp: levelData.hp,
            baseAtk: levelData.atk,
            baseDef: 0
        } : {
            // Fallback values if level mapping is missing
            hp: 500,
            atk: char.stats.maxAtk ? Math.round(char.stats.maxAtk * 0.1) : 30,
            def: 0,
            strength: char.stats.baseStrength || 10,
            agility: char.stats.baseAgility || 10,
            intelligence: char.stats.baseIntelligence || 10,
            willpower: char.stats.baseWillpower || 10,
            baseHp: 500,
            baseAtk: 30,
            baseDef: 0
        };

        return {
            ...char,
            // Per design.md, character base defense is 0
            baseDef: 0,
            baseHp: computedStats.baseHp,
            // Ensure stats object includes all computed fields for initialization
            stats: {
                ...char.stats,
                ...computedStats
            },
        };
    });
}

export const CHARACTERS = processCharacterData(characterInfoData);

/**
 * Get character stats at a specific level using level mappings.
 * @param {Object} character - The character object
 * @param {number} level - The target level (1-99)
 * @param {number} eliteLevel - Optional elite level
 * @returns {Object} Computed stats at the specified level
 */
export function getCharacterStatsAtLevel(character, level, eliteLevel = null) {
    const levelData = getLevelStatsFromMapping(character.id, level, eliteLevel);

    if (!levelData) {
        // Fallback to simple scaling if no level data
        const scale = 1 + (level - 1) * 0.05;
        return {
            atk: Math.floor(character.stats.baseAtk * scale),
            def: Math.floor(character.baseDef * scale),
            hp: Math.floor(character.baseHp * scale),
            strength: Math.floor(character.stats.baseStrength * scale),
            agility: Math.floor(character.stats.baseAgility * scale),
            intelligence: Math.floor(character.stats.baseIntelligence * scale),
            willpower: Math.floor(character.stats.baseWillpower * scale),
        };
    }

    return {
        atk: levelData.atk,
        def: 0, // Character base defense is 0 per design.md
        hp: levelData.hp,
        strength: levelData.strength,
        agility: levelData.agility,
        intelligence: levelData.intelligence,
        willpower: levelData.willpower,
        spellLevelCoef: levelData.spellLevelCoef,
        normalAttackRange: levelData.normalAttackRange,
        eliteLevel: levelData.eliteLevel,
    };
}

/**
 * Legacy function for backward compatibility.
 * @deprecated Use getCharacterStatsAtLevel instead
 */
export const getLevelStatsLegacy = (baseStats, level) => {
    const scale = 1 + (level - 1) * 0.05;
    return {
        atk: Math.floor(baseStats.baseAtk * scale),
        def: Math.floor(baseStats.baseDef * scale),
        hp: Math.floor(baseStats.baseHp * scale),
        str: Math.floor(baseStats.strength * scale),
        agi: Math.floor(baseStats.agility * scale),
        int: Math.floor(baseStats.intelligence * scale),
        wil: Math.floor(baseStats.willpower * scale),
    };
};

/**
 * 获取包含武器加成的角色属性
 * @param {Object} character - 角色对象（包含 mainAttr, stats 等字段）
 * @param {number} level - 角色等级 (1-99)
 * @param {Object|null} weaponConfig - 武器配置 { id, level, mainAttrLevel, subAttrLevel }
 * @param {number} eliteLevel - 可选的精英等级
 * @returns {Object} 包含武器加成的完整属性
 */
export function getCharacterStatsWithWeapon(character, level, weaponConfig = null, eliteLevel = null) {
    // 获取角色基础属性
    const baseStats = getCharacterStatsAtLevel(character, level, eliteLevel);
    
    // 初始化武器加成对象
    const weaponBonuses = {
        atkPercent: 0,
        hpPercent: 0,
        physicalDamage: 0,
        magicDamage: 0,
        fireDamage: 0,
        iceDamage: 0,
        electricDamage: 0,
        natureDamage: 0,
        critRate: 0,
        ultimateChargeRate: 0,
        artsIntensity: 0,
        healEfficiency: 0
    };
    
    // 如果没有武器配置，直接返回基础属性
    if (!weaponConfig || !weaponConfig.id || !WEAPONS[weaponConfig.id]) {
        return {
            ...baseStats,
            weaponAtk: 0,
            weaponBonuses
        };
    }
    
    const weaponLevel = weaponConfig.level || 1;
    const mainAttrLevel = weaponConfig.mainAttrLevel || 1;
    const subAttrLevel = weaponConfig.subAttrLevel || 1;
    
    // 获取武器攻击力
    const weaponAtk = getWeaponAtk(weaponConfig.id, weaponLevel);
    
    // 获取武器属性加成（分别使用主属性和次要属性等级）
    const attrBonus = getWeaponAttrBonus(weaponConfig.id, mainAttrLevel, subAttrLevel, character.mainAttr);
    
    // 处理主属性加成（固定值加到四维属性上）
    let strengthBonus = 0;
    let agilityBonus = 0;
    let intelligenceBonus = 0;
    let willpowerBonus = 0;
    
    if (attrBonus.mainAttr) {
        const { type, value } = attrBonus.mainAttr;
        switch (type) {
            case 'strength':
                strengthBonus = value;
                break;
            case 'agility':
                agilityBonus = value;
                break;
            case 'intelligence':
                intelligenceBonus = value;
                break;
            case 'willpower':
                willpowerBonus = value;
                break;
        }
    }
    
    // 处理次要属性加成
    if (attrBonus.subAttr) {
        const { type, value } = attrBonus.subAttr;
        switch (type) {
            case 'atkPercent':
                weaponBonuses.atkPercent = value;
                break;
            case 'hpPercent':
                weaponBonuses.hpPercent = value;
                break;
            case 'physicalDamage':
                weaponBonuses.physicalDamage = value;
                break;
            case 'magicDamage':
                weaponBonuses.magicDamage = value;
                break;
            case 'fireDamage':
                weaponBonuses.fireDamage = value;
                break;
            case 'iceDamage':
                weaponBonuses.iceDamage = value;
                break;
            case 'electricDamage':
                weaponBonuses.electricDamage = value;
                break;
            case 'natureDamage':
                weaponBonuses.natureDamage = value;
                break;
            case 'critRate':
                weaponBonuses.critRate = value;
                break;
            case 'ultimateChargeRate':
                weaponBonuses.ultimateChargeRate = value;
                break;
            case 'artsIntensity':
                weaponBonuses.artsIntensity = value;
                break;
            case 'healEfficiency':
                weaponBonuses.healEfficiency = value;
                break;
        }
    }
    
    // 计算最终属性（武器攻击力和四维属性加成直接加算）
    return {
        ...baseStats,
        // 武器攻击力单独返回，伤害计算时需要
        weaponAtk,
        // 四维属性已含武器加成
        strength: baseStats.strength + strengthBonus,
        agility: baseStats.agility + agilityBonus,
        intelligence: baseStats.intelligence + intelligenceBonus,
        willpower: baseStats.willpower + willpowerBonus,
        // 武器提供的独立加成（供伤害计算使用）
        weaponBonuses
    };
}
