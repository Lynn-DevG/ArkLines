/**
 * Level mappings for all characters.
 * Contains attribute data for each level (1-99) for every character.
 */
import levelMappingsData from './characters/level_mappings.json';
import skillMappingsData from './skills/characters_skill_lv_mappings.json';

export const LEVEL_MAPPINGS = levelMappingsData;

// Index skill mappings for fast lookup
// Structure: skillId -> key -> { "1级值": "...", ... }
const SKILL_VALUE_INDEX = {};
skillMappingsData.forEach(entry => {
    const { skill_id, key } = entry;
    if (!SKILL_VALUE_INDEX[skill_id]) {
        SKILL_VALUE_INDEX[skill_id] = {};
    }
    SKILL_VALUE_INDEX[skill_id][key] = entry;
});

/**
 * Get the stats for a specific character at a specific level.
 * @param {string} charId - The character ID (e.g., 'chr_0017_yvonne')
 * @param {number} level - The character level (1-99)
 * @param {number} eliteLevel - Optional elite level filter (0-4), defaults to highest available
 * @returns {Object|null} The stats object for the character at that level, or null if not found
 */
export function getLevelStats(charId, level, eliteLevel = null) {
    const charData = LEVEL_MAPPINGS[charId];
    if (!charData || !charData.levels) {
        return null;
    }

    // Find all entries for this level
    const levelEntries = charData.levels.filter(l => l.level === level);

    if (levelEntries.length === 0) {
        return null;
    }

    // If eliteLevel is specified, find exact match
    if (eliteLevel !== null) {
        return levelEntries.find(l => l.eliteLevel === eliteLevel) || null;
    }

    // Otherwise, return the highest elite level for this level
    return levelEntries.reduce((max, curr) =>
        curr.eliteLevel > max.eliteLevel ? curr : max
        , levelEntries[0]);
}

/**
 * Get a specific skill value at a given level.
 * @param {string} skillId - The skill ID
 * @param {string} key - The attribute key (e.g., 'atk_scale', 'atb', 'usp', 'poise')
 * @param {number} level - The skill level (1-12)
 * @param {number|string|null} index - Optional index for multi-stage skills (e.g., 2 for 'atk_scale2')
 * @returns {number} The value, or 0 if not found
 */
export function getSkillValue(skillId, key, level, index = null) {
    // 1. Strip 'skill_' prefix
    let baseId = skillId.replace(/^skill_/, '');
    const levelKey = `${level}级值`;

    /**
     * Try multiple lookup strategies:
     * 1. If it's an attack, try baseId + index (e.g., ..._attack1)
     * 2. If index > 1, try baseId + key + index (e.g., id: skill, key: atk_scale2)
     * 3. Fallback to baseId + key
     */
    const lookupQueue = [];

    if (index) {
        // Strategy 1: Suffix on ID (common for basic attacks)
        lookupQueue.push({ id: `${baseId}${index}`, key: key });
        // Strategy 2: Suffix on Key (common for multi-stage tactical/ults)
        lookupQueue.push({ id: baseId, key: `${key}${index}` });
    }
    // Strategy 3: Exact match
    lookupQueue.push({ id: baseId, key: key });

    for (const lookup of lookupQueue) {
        const charSkillData = SKILL_VALUE_INDEX[lookup.id];
        if (charSkillData && charSkillData[lookup.key]) {
            const entry = charSkillData[lookup.key];
            const val = entry[levelKey];
            if (val !== undefined) return parseFloat(val);
        }
    }

    // Fallback for 'key1' if no index provided
    if (!index) {
        const charSkillData = SKILL_VALUE_INDEX[baseId];
        if (charSkillData && charSkillData[`${key}1`]) {
            return parseFloat(charSkillData[`${key}1`][levelKey] || 0);
        }
    }

    return 0;
}

/**
 * Get all stats for a specific skill at a given level.
 * Used for dynamic skill data initialization.
 * @param {string} skillId 
 * @param {number} level 
 * @returns {Object}
 */
export function getSkillStatsAtLevel(skillId, level) {
    const skillData = SKILL_VALUE_INDEX[skillId];
    if (!skillData) return {};
    const stats = {};
    const levelKey = `${level}级值`;
    for (const key in skillData) {
        const val = skillData[key][levelKey];
        if (val !== undefined) {
            stats[key] = parseFloat(val);
        }
    }
    return stats;
}

/**
 * Get the base stats (level 1) for a character.
 * @param {string} charId - The character ID
 * @returns {Object|null} The base stats object
 */
export function getBaseStats(charId) {
    return getLevelStats(charId, 1, 0);
}

/**
 * Get the max stats (level 99) for a character.
 * @param {string} charId - The character ID
 * @returns {Object|null} The max stats object
 */
export function getMaxStats(charId) {
    return getLevelStats(charId, 99, 4);
}
