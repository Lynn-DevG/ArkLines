import { SKILLS } from '../data/skills.js';
import { checkActionHistoryCondition } from './VariantResolver.js';

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

    /**
     * 检查技能释放条件是否满足（用于编辑阶段验证）
     * 
     * @param {Object} skillDef - 技能定义
     * @param {Object} action - 当前 action { id, skillId, charId, startTime }
     * @param {Array} allActions - 所有已放置的 actions
     * @returns {{valid: boolean, reason?: string}} 验证结果
     */
    static checkSkillCondition(skillDef, action, allActions) {
        // 如果技能没有 condition，则无需检查
        if (!skillDef.condition) {
            return { valid: true };
        }
        
        const conditions = Array.isArray(skillDef.condition) ? skillDef.condition : [skillDef.condition];
        
        // 条件之间是 OR 关系，任一满足即可
        for (const cond of conditions) {
            if (this.matchCondition(cond, action, allActions)) {
                return { valid: true };
            }
        }
        
        return { 
            valid: false, 
            reason: '释放条件不满足' 
        };
    }

    /**
     * 匹配单个条件
     */
    static matchCondition(cond, action, allActions) {
        switch (cond.type) {
            case 'action_history':
                return checkActionHistoryCondition(cond, action, allActions);
                
            // 以下条件在编辑阶段无法准确评估
            // buff_check, attribute_check 等需要在模拟时才能确定
            // 为了不阻止用户放置技能，这里返回 true（乐观评估）
            case 'buff_check':
            case 'attribute_check':
            case 'is_main_char':
            case 'enemy_state':
                return true; // 乐观评估，让用户可以放置，模拟时再验证
                
            default:
                return true;
        }
    }
}
