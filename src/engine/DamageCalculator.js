import { getSkillValue } from '../data/levelMappings.js';

/**
 * Damage Calculator Engine
 * Implements the formula from design.md
 */

export class DamageCalculator {
    static calculate(attacker, target, skillNode, context) {
        // context includes active buffs, breaking state, etc.
        // context should now also include skillId and skillLevel

        // 1. Base Damage Zone
        const baseAtk = this.calculateAttack(attacker, context);

        // Dynamic Multiplier (Skill Multiplier)
        let multiplier = 0;
        if (context.skillId) {
            multiplier = getSkillValue(context.skillId, 'atk_scale', context.skillLevel || 1, skillNode.index || null);
        } else {
            multiplier = skillNode.multiplier || 0;
        }

        // Weakness Zone (Weaken) = Product(1 - weaken_effect)
        const weakenMult = this.calculateWeaken(context);

        let baseDamage = multiplier * baseAtk * weakenMult;

        // 2. Crit Zone
        const critRate = (attacker.stats.critRate || 0) + (context.critRateBonus || 0);
        const critDmg = (attacker.stats.critDmg || 0.5) + (context.critDmgBonus || 0);
        let critMult = 1.0;
        if (Math.random() < critRate) {
            critMult = 1 + critDmg;
        }

        // 3. Damage Bonus Zone (1 + Additive)
        const dmgBonus = 1 + this.sumModifiers(context, 'dmg_bonus', skillNode);

        // 4. Damage Reduction Zone (1 - Reduc)
        const dmgReduc = 1 - this.sumModifiers(context, 'dmg_reduc', skillNode);

        // 5. Vulnerability Zone (1 + Vuln)
        const vulnerability = 1 + this.sumModifiers(context, 'vulnerability', skillNode);

        // 6. Amplification Zone (1 + Amp) - Named Buffs
        const amplification = 1 + this.sumModifiers(context, 'amplification', skillNode);

        // 7. Shelter Zone (1 - Max(Shelter)) - Named Buffs
        const shelter = 1 - this.maxModifier(context, 'shelter', skillNode);

        // 8. Fragile Zone (1 + Fragile) - Named Buffs
        const fragile = 1 + this.sumModifiers(context, 'fragile', skillNode);

        // 9. Defense Zone
        const defMult = this.calculateDefMult(target, context);

        // 10. Stun/Poise Vulnerability (Renamed stagger to poise in context)
        let stunMult = 1.0;
        if (target.isStunned || target.status === 'stunned') { // Simplified check
            stunMult = 1.3; // Fixed coefficient
        } else if (context.isPoiseBroken) {
            stunMult = 1.3;
        }

        // 11. Resistance Zone
        const resMult = this.calculateResMult(target, skillNode.element, context);

        // Final Calculation
        let finalDamage = baseDamage
            * critMult
            * dmgBonus
            * dmgReduc
            * vulnerability
            * amplification
            * shelter
            * fragile
            * defMult
            * stunMult
            * resMult;

        return Math.floor(finalDamage);
    }

    static calculateAttack(attacker, context) {
        // Formula: [(Base + Weap) * (1 + %) + Flat] * (1 + AttrBonus)
        let atk = attacker.stats.baseAtk || 0;

        // Mock Attribute Bonus
        const main = attacker.stats[attacker.mainAttr] || 0;
        const sub = attacker.stats[attacker.subAttr] || 0;
        const attrBonus = (main * 0.005) + (sub * 0.002);

        return atk * (1 + attrBonus);
    }

    static calculateDefMult(target, context) {
        const def = target.stats.baseDef || 0;
        if (def >= 0) {
            return 100 / (def + 100);
        } else {
            return 2 - Math.pow(0.99, -def);
        }
    }

    static calculateResMult(target, element, context) {
        if (!element) return 1.0;
        const lowerElement = element.toLowerCase();
        const resKey = `res_${lowerElement}`;
        const resValue = target.stats[resKey] || 0;
        const shred = this.sumModifiers(context, 'res_shred', null);
        const finalRes = resValue - shred;
        return (100 - finalRes) / 100;
    }

    static sumModifiers(context, type, skillNode) {
        let sum = 0;
        if (!context.activeModifiers) return 0;

        context.activeModifiers.forEach(mod => {
            if (mod.type === type) {
                if (mod.condition && skillNode) {
                    const el = (skillNode.element || '').toLowerCase();
                    const isMagic = ['fire', 'ice', 'nature', 'electric', 'emag', 'blaze', 'cold'].includes(el);
                    const isPhys = el === 'physical';

                    if (mod.condition.type === 'magic' && !isMagic) return;
                    if (mod.condition.type === 'physical' && !isPhys) return;
                }
                sum += mod.value;
            }
        });
        return sum;
    }

    static maxModifier(context, type, skillNode) {
        let max = 0;
        if (!context.activeModifiers) return 0;
        context.activeModifiers.forEach(mod => {
            if (mod.type === type) {
                if (mod.condition) {
                    if (skillNode) {
                        const isMagic = ['Fire', 'Ice', 'Nature', 'Electric'].includes(skillNode.element);
                        const isPhys = skillNode.element === 'Physical' || (skillNode.element && skillNode.element.toLowerCase() === 'physical');

                        if (mod.condition.type === 'magic' && !isMagic) return;
                        if (mod.condition.type === 'physical' && !isPhys) return;
                    }
                }
                if (mod.value > max) {
                    max = mod.value;
                }
            }
        });
        return max;
    }

    static calculateReactionDamage(anomalyType, context, enemyStats) {
        const sourceAtk = context.sourceChar ? this.calculateAttack(context.sourceChar, context) : 500;
        const anomalyLevel = context.level || 1;

        let multiplier = 0;
        let element = 'physical';

        const type = String(anomalyType).toLowerCase();

        if (type.includes('burn') || type === 'blaze') {
            multiplier = 0.12 + 0.12 * anomalyLevel;
            element = 'blaze';
        } else if (type === 'burst') {
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'physical';
        } else {
            // Default/Fallback
            multiplier = 0.1 * anomalyLevel;
        }

        const resMult = this.calculateResMult({ stats: enemyStats }, element, context);
        return Math.floor(sourceAtk * multiplier * resMult);
    }

    static calculateWeaken(context) {
        return 1.0;
    }
}
