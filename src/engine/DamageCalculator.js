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
        // 从 action 配置中读取 scalingKey，用于在 JSON 中查找对应的倍率
        let multiplier = 0;
        if (context.skillId) {
            const scalingKey = skillNode.scalingKey || 'atk_scale';
            multiplier = getSkillValue(context.skillId, scalingKey, context.skillLevel || 1, skillNode.index || null);
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
        // levelIndex 用于从数组中获取对应等级的数值 (等级1-4对应索引0-3)
        const levelIndex = Math.min(Math.max(0, anomalyLevel - 1), 3);

        let multiplier = 0;
        let element = 'Physical';

        const type = String(anomalyType).toLowerCase();

        // 燃烧 DoT tick (每秒伤害)
        if (type.includes('burn') || type === 'status_burn') {
            // 每秒持续伤害基础倍率 = 12% + 12% * 异常等级
            multiplier = 0.12 + 0.12 * anomalyLevel;
            element = 'Fire';
        }
        // 法术爆发 (同元素附着反应)
        else if (type === 'burst') {
            // 法术爆发伤害倍率 = 160%
            multiplier = 1.60;
            element = context.element || 'Fire';
        }
        // 导电/腐蚀/燃烧 初始伤害
        else if (type.includes('conduct') || type === 'status_conduct') {
            // 基础倍率 = 80% + 80% * 异常等级
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'Electric';
        }
        else if (type.includes('corrosion') || type === 'status_corrosion') {
            // 基础倍率 = 80% + 80% * 异常等级
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'Nature';
        }
        // 冻结
        else if (type.includes('freeze') || type === 'status_freeze') {
            // 基础倍率 = 130%
            multiplier = 1.30;
            element = 'Ice';
        }
        // 碎冰 (冻结后施加破防或物理异常触发)
        else if (type.includes('shatter') || type === 'status_shatter') {
            // 基础倍率 = 120% + 120% * 本次冻结的异常等级
            multiplier = 1.20 + 1.20 * anomalyLevel;
            element = 'Physical'; // 碎冰造成物理伤害
        }
        // 猛击
        else if (type.includes('slam') || type === 'status_slam') {
            // 伤害倍率 = 150% + 150% * 消耗的破防层数
            multiplier = 1.50 + 1.50 * anomalyLevel;
            element = 'Physical';
        }
        // 碎甲
        else if (type.includes('sunder') || type === 'status_sunder') {
            // 额外伤害倍率 = 50% + 50% * 破防层数
            multiplier = 0.50 + 0.50 * anomalyLevel;
            element = 'Physical';
        }
        // 击飞/倒地
        else if (type.includes('launch') || type.includes('knockdown') || type === 'status_launch' || type === 'status_knockdown') {
            // 伤害倍率 = 120%
            multiplier = 1.20;
            element = 'Physical';
        }
        else {
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
