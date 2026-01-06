/**
 * Character data configuration.
 * Sourced from character_info.json with additional computed fields.
 */
import characterInfoData from './characters/character_info.json';
import { getLevelStats as getLevelStatsFromMapping } from './levelMappings';

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
