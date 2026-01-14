/**
 * skillSlots.js
 *
 * Utilities to map a character's skillId to its slot (basic/tactical/chain/ultimate)
 * and to fetch per-slot skill levels.
 *
 * IMPORTANT:
 * - This file is intentionally framework-agnostic (no React imports)
 * - Keep backward compatibility with legacy `char.skillLevel`
 */
 
export const SKILL_SLOTS = /** @type {const} */ (['basic', 'tactical', 'chain', 'ultimate']);
 
/**
 * @param {any} maybeSlot
 * @returns {maybeSlot is (typeof SKILL_SLOTS)[number]}
 */
export function isSkillSlot(maybeSlot) {
  return SKILL_SLOTS.includes(maybeSlot);
}
 
/**
 * Get skill slot key for a character's skillId.
 * @param {Object|null|undefined} char
 * @param {string|null|undefined} skillId
 * @returns {'basic'|'tactical'|'chain'|'ultimate'|null}
 */
export function getSkillSlotForCharacterSkillId(char, skillId) {
  if (!char?.skills || !skillId) return null;
  if (char.skills.basic === skillId) return 'basic';
  if (char.skills.tactical === skillId) return 'tactical';
  if (char.skills.chain === skillId) return 'chain';
  if (char.skills.ultimate === skillId) return 'ultimate';
  return null;
}
 
/**
 * Get per-slot skill level with fallback:
 * - preferred: char.skillLevelsBySlot[slot]
 * - fallback: char.skillLevel (legacy)
 * - fallback: defaultLevel
 *
 * @param {Object|null|undefined} char
 * @param {'basic'|'tactical'|'chain'|'ultimate'} slot
 * @param {number} [defaultLevel=1]
 * @returns {number}
 */
export function getSkillLevelBySlot(char, slot, defaultLevel = 1) {
  const raw =
    char?.skillLevelsBySlot?.[slot] ??
    char?.skillLevel ??
    defaultLevel;
 
  const n = Number(raw);
  if (!Number.isFinite(n)) return defaultLevel;
  // clamp to 1..12 by design.md
  return Math.max(1, Math.min(12, Math.floor(n)));
}
 
/**
 * Get skill level for a given skillId (mapped to slot first).
 * If the skillId can't be mapped, falls back to legacy `char.skillLevel`.
 *
 * @param {Object|null|undefined} char
 * @param {string|null|undefined} skillId
 * @param {number} [defaultLevel=1]
 * @returns {number}
 */
export function getSkillLevelForSkillId(char, skillId, defaultLevel = 1) {
  const slot = getSkillSlotForCharacterSkillId(char, skillId);
  if (slot) return getSkillLevelBySlot(char, slot, defaultLevel);
  // legacy fallback
  const raw = char?.skillLevel ?? defaultLevel;
  const n = Number(raw);
  if (!Number.isFinite(n)) return defaultLevel;
  return Math.max(1, Math.min(12, Math.floor(n)));
}
 
