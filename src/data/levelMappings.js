/**
 * Level mappings for all characters.
 * Contains attribute data for each level (1-99) for every character.
 */
import levelMappingsData from './characters/level_mappings.json';

export const LEVEL_MAPPINGS = levelMappingsData;

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
