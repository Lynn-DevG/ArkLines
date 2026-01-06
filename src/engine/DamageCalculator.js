/**
 * Damage Calculator Engine
 * Implements the formula from design.md
 */

export class DamageCalculator {
    static calculate(attacker, target, skillNode, context) {
        // context includes active buffs, breaking state, etc.

        // 1. Base Damage Zone
        const baseAtk = this.calculateAttack(attacker, context);
        const multiplier = skillNode.multiplier || 0; // Skill Multiplier
        // Weakness Zone (Weaken) = Product(1 - weaken_effect)
        const weakenMult = this.calculateWeaken(context);

        let baseDamage = multiplier * baseAtk * weakenMult;

        // 2. Crit Zone
        // TODO: Random vs Fixed setting
        const critRate = (attacker.stats.critRate || 0) + (context.critRateBonus || 0);
        const critDmg = (attacker.stats.critDmg || 0.5) + (context.critDmgBonus || 0);
        let critMult = 1.0;
        if (Math.random() < critRate) {
            critMult = 1 + critDmg;
        }

        // 3. Damage Bonus Zone (1 + Additive)
        const dmgBonus = 1 + this.sumModifiers(context, 'dmg_bonus', skillNode);

        // 4. Damage Reduction Zone (1 - Reduc)
        const dmgReduc = 1 - this.sumModifiers(context, 'dmg_reduc', skillNode); // Capped at 1?

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

        // 10. Stun/Break Vulnerability
        let stunMult = 1.0;
        if (target.isStunned) {
            stunMult = 1.3; // Fixed coefficient
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
        // Attribute Bonus: Main * 0.005 + Sub * 0.002
        let atk = attacker.stats.baseAtk || 0;
        // ... add weapon/buff logic here

        // Mock Attribute Bonus
        const main = attacker.stats[attacker.mainAttr] || 0;
        const sub = attacker.stats[attacker.subAttr] || 0;
        const attrBonus = (main * 0.005) + (sub * 0.002);

        return atk * (1 + attrBonus);
    }

    static calculateDefMult(target, context) {
        // Def Efficiency = 0.01
        // Formula: 100 / (Def + 100)
        const def = target.stats.baseDef || 0; // + modifiers

        // Handle negative def (if any debuffs reduce it below 0)
        if (def >= 0) {
            return 100 / (def + 100);
        } else {
            return 2 - Math.pow(0.99, -def);
        }
    }

    static calculateResMult(target, element, context) {
        // Element Res Map
        const resValue = target.stats[`res_${element}`] || 0;

        // Add shred from context
        // Example: 'res_shred' = value (absolute reduction?)
        // Design says: "Current Res - Res Shred"

        const shred = this.sumModifiers(context, 'res_shred', null);
        const finalRes = resValue - shred;

        return (100 - finalRes) / 100;
    }

    static sumModifiers(context, type, skillNode) {
        // Extract multipliers of 'type' from context.buffs 
        let sum = 0;
        if (!context.activeModifiers) return 0;

        context.activeModifiers.forEach(mod => {
            if (mod.type === type) {
                // Check condition
                if (mod.condition) {
                    if (skillNode) {
                        // Check Magic/Physical
                        const isMagic = ['Fire', 'Ice', 'Nature', 'Electric'].includes(skillNode.element);
                        const isPhys = skillNode.element === 'Physical';

                        if (mod.condition.type === 'magic' && !isMagic) return;
                        if (mod.condition.type === 'physical' && !isPhys) return;
                        if (mod.condition.type === 'stun' && !mod.condition.active) {
                            // Usually stun condition implies target IS stunned.
                            // Handled by context setup.
                        }
                    }
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
                        const isPhys = skillNode.element === 'Physical';

                        if (mod.condition.type === 'magic' && !isMagic) return;
                        if (mod.condition.type === 'physical' && !isPhys) return;
                        if (mod.condition.type === 'stun' && !mod.condition.active) {
                            // handled by context
                        }
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
        // Design.md 2.3.2 Reaction Damage
        // Base Reaction Damage = 160% * Attack (Source)
        // Assume context.sourceChar passed.

        const sourceAtk = context.sourceChar ? this.calculateAttack(context.sourceChar, context) : 500;
        const anomalyLevel = context.level || 1; // Passed from event

        let multiplier = 0;

        switch (anomalyType) {
            case 'status_burn': // DoT
                // Burn: 12% + 12% * Lv
                multiplier = 0.12 + 0.12 * anomalyLevel;
                break;

            // Direct Damage Anomalies (Explosion on Trigger)
            // Note: TimelineSimulator might treat app as Reaction event, but 'Reaction Damage' usually refers to the burst?
            // Or only DoT?
            // Burn is DoT.
            // Shatter (Ice) is Burst. 120% + 120% * Lv
            // Discharge (Electric) is implicit in Conduct? No, Conduct is vuln.
            // Design says: "法术爆发伤害倍率 = 160%". This is for Same-Element Stacking (Attachment 4 layers?)
            // Design says: "Conduct/Corrosion/Burn Base = 80% + 80% * Lv" (Initial Burst?)
            // "Burn DoT = 12%..."

            // Let's implement the Initial Burst if this is called for it.
            // Assuming this method is called for the 'REACTION' event burst.

            case 'BURST': // Placeholder for generic reaction burst?
                multiplier = 0.80 + 0.80 * anomalyLevel;
                break;

            default:
                // Default Burn DoT tick call uses 'status_burn'
                if (anomalyType === 'status_burn') {
                    multiplier = 0.12 + 0.12 * anomalyLevel;
                } else {
                    return 0;
                }
        }

        // Apply Res
        // Reactions usually elemental.
        // Burn = Fire.
        let element = 'Physical';
        if (anomalyType === 'status_burn') element = 'Fire';

        const resMult = this.calculateResMult({ stats: enemyStats }, element, context);

        return Math.floor(sourceAtk * multiplier * resMult);
    }

    static calculateWeaken(context) {
        // Product(1 - v)
        // For simplicity returning 1.0
        return 1.0;
    }
}
