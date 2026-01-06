import { SKILLS } from '../data/skills.js';

/**
 * Validates if a skill can be placed/executed at a given time.
 */
export class ConstraintValidator {
    static validate(charId, skillId, time, context) {
        // context: { sp, ultEnergy, cooldowns }
        // cooldowns: { [skillId]: nextAvailableTime }

        const skill = SKILLS[skillId];
        if (!skill) return { valid: false, reason: 'Unknown Skill' };

        // 1. SP Check (Tactical)
        if (skill.spCost > 0) {
            if (context.sp < skill.spCost) {
                return { valid: false, reason: 'Not enough SP' };
            }
        }

        // 2. Ultimate Energy Check
        if (skill.type === 'ULTIMATE') {
            const currentEnergy = context.ultEnergy[charId] || 0;
            // Assuming 100 max for now, or fetch from Char Data
            if (currentEnergy < (skill.energyCost || 100)) {
                return { valid: false, reason: 'Ult not ready' };
            }
        }

        // 3. Cooldown Check
        // Context contains pre-calculated 'cooldowns' map from simulateResourceStateAt
        if (context.cooldowns && context.cooldowns[skillId] > time) {
            return { valid: false, reason: `Cooldown (${(context.cooldowns[skillId] - time).toFixed(1)}s)` };
        }

        // 4. Chain Condition
        if (skill.type === 'CHAIN') {
            // Must satisfy condition (e.g. Enemy broken? Previous skill?)
            // We allow placement but maybe warn.
        }

        return { valid: true };
    }
}
