import { getSkillValue } from '../data/levelMappings.js';

/**
 * Damage Calculator Engine
 * Implements the formula from design.md
 * 
 * 常规伤害 = 基础伤害区 * 暴击区 * 伤害加成区 * 伤害减免区 * 易伤区 * 增幅区 * 庇护区 * 脆弱区 * 防御区 * 失衡易伤区 * 抗性区 * 特殊加成区
 * 异常伤害 = 上述公式 * 法术等级区 * 源石技艺强度区
 */

// 暴击模式枚举
export const CRIT_MODE = {
    RANDOM: 'random',      // 按暴击率随机
    ALWAYS: 'always',      // 固定暴击
    NEVER: 'never'         // 固定非暴击
};

export class DamageCalculator {
    /**
     * 计算常规伤害
     * @param {Object} attacker - 攻击者
     * @param {Object} target - 目标
     * @param {Object} skillNode - 技能节点配置
     * @param {Object} context - 计算上下文
     * @param {string} context.critMode - 暴击模式 (random/always/never)
     * @param {Object} context.activeModifiers - 激活的修正效果
     * @param {string} context.skillId - 技能ID
     * @param {number} context.skillLevel - 技能等级
     * @param {string} context.skillType - 技能类型 (BASIC/SKILL/CHAIN/ULTIMATE)
     * @param {boolean} context.isPoiseBroken - 是否处于失衡状态
     * @param {number} context.comboStacks - 连击层数 (0-4)
     */
    static calculate(attacker, target, skillNode, context) {
        // 1. 基础伤害区 = 伤害倍率 * 攻击力 * 虚弱区
        const baseAtk = this.calculateAttack(attacker, context);

        // 获取伤害倍率
        let multiplier = 0;
        if (context.skillId) {
            const scalingKey = skillNode.scalingKey || 'atk_scale';
            multiplier = getSkillValue(context.skillId, scalingKey, context.skillLevel || 1, skillNode.index || null);
        } else {
            multiplier = skillNode.multiplier || 0;
        }

        // 虚弱区 = Π(1 - 虚弱效果)
        const weakenMult = this.calculateWeaken(context);

        const baseDamage = multiplier * baseAtk * weakenMult;

        // 2. 暴击区 - 支持三种模式
        const critMult = this.calculateCrit(attacker, context);

        // 3. 伤害加成区 = 1 + Σ伤害加成
        const dmgBonus = 1 + this.sumModifiers(context, 'dmg_bonus', skillNode);

        // 4. 伤害减免区 = 1 - Σ伤害减免
        const dmgReduc = 1 - this.sumModifiers(context, 'dmg_reduc', skillNode);

        // 5. 易伤区 = 1 + Σ易伤效果
        const vulnerability = 1 + this.sumModifiers(context, 'vulnerability', skillNode);

        // 6. 增幅区 = 1 + Σ增幅效果 (加算)
        const amplification = 1 + this.sumModifiers(context, 'amplification', skillNode);

        // 7. 庇护区 = 1 - max(庇护效果)
        const shelter = 1 - this.maxModifier(context, 'shelter', skillNode);

        // 8. 脆弱区 = 1 + Σ脆弱效果
        const fragile = 1 + this.sumModifiers(context, 'fragile', skillNode);

        // 9. 防御区
        const defMult = this.calculateDefMult(target, skillNode, context);

        // 10. 失衡易伤区
        const stunMult = this.calculateStunMult(target, context);

        // 11. 抗性区
        const resMult = this.calculateResMult(target, skillNode.element, context);

        // 12. 特殊加成区 - 连击伤害加成
        const specialMult = this.calculateSpecialMult(context, skillNode);

        // 最终伤害计算
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
            * resMult
            * specialMult;

        return Math.floor(finalDamage);
    }

    /**
     * 计算攻击力
     * 公式: [(干员基础攻击力 + 武器基础攻击力) * (1 + 百分比加成) + 固定数值加成] * (1 + 能力值加成)
     * 能力值加成 = 主能力 * 0.005 + 副能力 * 0.002
     */
    static calculateAttack(attacker, context) {
        // 干员基础攻击力
        const charBaseAtk = attacker.stats?.baseAtk || 0;
        
        // 武器基础攻击力
        const weaponAtk = attacker.weapon?.baseAtk || attacker.stats?.weaponAtk || 0;
        
        // 攻击力百分比加成 (从装备、天赋、buff等)
        const atkPercent = this.sumModifiers(context, 'atk_percent', null);
        
        // 攻击力固定数值加成
        const atkFlat = this.sumModifiers(context, 'atk_flat', null);

        // 能力值加成
        const mainAttr = attacker.mainAttr || 'strength';
        const subAttr = attacker.subAttr || 'agility';
        const main = attacker.stats?.[mainAttr] || 0;
        const sub = attacker.stats?.[subAttr] || 0;
        const attrBonus = (main * 0.005) + (sub * 0.002);

        // 完整公式
        const finalAtk = ((charBaseAtk + weaponAtk) * (1 + atkPercent) + atkFlat) * (1 + attrBonus);
        
        return finalAtk;
    }

    /**
     * 计算虚弱区
     * 虚弱区 = Π(1 - 虚弱效果)
     * 多个虚弱效果累乘
     */
    static calculateWeaken(context) {
        if (!context.activeModifiers) return 1.0;

        let result = 1.0;
        context.activeModifiers.forEach(mod => {
            if (mod.type === 'weaken') {
                result *= (1 - (mod.value || 0));
            }
        });

        return result;
    }

    /**
     * 计算暴击区
     * 支持三种模式: random(随机), always(固定暴击), never(固定非暴击)
     */
    static calculateCrit(attacker, context) {
        const critRate = (attacker.stats?.critRate || 0) + (context.critRateBonus || 0);
        const critDmg = (attacker.stats?.critDmg || 0.5) + (context.critDmgBonus || 0);
        
        const critMode = context.critMode || CRIT_MODE.RANDOM;
        
        switch (critMode) {
            case CRIT_MODE.ALWAYS:
                // 固定暴击
                return 1 + critDmg;
            case CRIT_MODE.NEVER:
                // 固定非暴击
                return 1.0;
            case CRIT_MODE.RANDOM:
            default:
                // 按暴击率随机
                if (Math.random() < critRate) {
                    return 1 + critDmg;
                }
                return 1.0;
        }
    }

    /**
     * 计算防御区
     * 当伤害类型为真实伤害时，防御区 = 1
     * 当实际防御力 >= 0，防御区 = 100 / (实际防御力 + 100)
     * 当实际防御力 < 0，防御区 = 2 - 0.99^(-实际防御力)
     */
    static calculateDefMult(target, skillNode, context) {
        // 真实伤害无视防御
        if (skillNode?.element?.toLowerCase() === 'true' || skillNode?.ignoreDefense) {
            return 1.0;
        }

        const baseDef = target.stats?.baseDef || 0;
        
        // 防御力修正 (减防效果)
        const defReduction = this.sumModifiers(context, 'def_reduction', null);
        const def = baseDef * (1 - defReduction);

        if (def >= 0) {
            return 100 / (def + 100);
        } else {
            return 2 - Math.pow(0.99, -def);
        }
    }

    /**
     * 计算失衡易伤区
     * 失衡时 = 1.3
     * 非失衡时 = 1.0
     */
    static calculateStunMult(target, context) {
        const isStunned = target.isStunned || target.status === 'stunned' || context.isPoiseBroken;
        
        if (isStunned) {
            return 1.3; // 固定失衡易伤系数
        }
        
        return 1.0;
    }

    /**
     * 计算抗性区
     * 抗性区 = 属性承伤系数 + 抗性降低/100 - 抗性提升/100
     * 属性承伤系数 = (100 - 属性抗性) / 100
     */
    static calculateResMult(target, element, context) {
        if (!element) return 1.0;
        
        const lowerElement = element.toLowerCase();
        const resKey = `res_${lowerElement}`;
        const resValue = target.stats?.[resKey] || 0;
        
        // 减抗效果
        const shred = this.sumModifiers(context, 'res_shred', null);
        
        const finalRes = resValue - shred;
        return (100 - finalRes) / 100;
    }

    /**
     * 计算特殊加成区
     * 目前仅包含连击加成
     * 连击伤害加成 = 1 + 连击层数加成
     * 层数效果: 30%/45%/60%/75%
     */
    static calculateSpecialMult(context, skillNode) {
        let mult = 1.0;

        // 连击加成 - 仅对战技和终结技生效
        const skillType = context.skillType || skillNode?.type;
        if (skillType === 'SKILL' || skillType === 'ULTIMATE') {
            const comboStacks = context.comboStacks || 0;
            if (comboStacks > 0 && comboStacks <= 4) {
                // 每层效果：30%/45%/60%/75%
                const comboValues = [0.30, 0.45, 0.60, 0.75];
                mult *= (1 + comboValues[comboStacks - 1]);
            }
        }

        return mult;
    }

    /**
     * 汇总修正器 (加算)
     */
    static sumModifiers(context, type, skillNode) {
        let sum = 0;
        if (!context.activeModifiers) return 0;

        context.activeModifiers.forEach(mod => {
            if (mod.type === type) {
                // 条件检查
                if (mod.condition && skillNode) {
                    const el = (skillNode.element || '').toLowerCase();
                    const isMagic = ['fire', 'ice', 'nature', 'electric', 'emag', 'blaze', 'cold'].includes(el);
                    const isPhys = el === 'physical';

                    if (mod.condition.type === 'magic' && !isMagic) return;
                    if (mod.condition.type === 'physical' && !isPhys) return;
                    
                    // 技能类型条件
                    if (mod.condition.skillType) {
                        const skillType = context.skillType || skillNode?.type;
                        if (mod.condition.skillType !== skillType) return;
                    }
                    
                    // 元素类型条件
                    if (mod.condition.element) {
                        if (mod.condition.element.toLowerCase() !== el) return;
                    }
                }
                sum += mod.value || 0;
            }
        });
        return sum;
    }

    /**
     * 获取修正器最大值
     */
    static maxModifier(context, type, skillNode) {
        let max = 0;
        if (!context.activeModifiers) return 0;

        context.activeModifiers.forEach(mod => {
            if (mod.type === type) {
                if (mod.condition && skillNode) {
                    const el = (skillNode.element || '').toLowerCase();
                    const isMagic = ['fire', 'ice', 'nature', 'electric'].includes(el);
                    const isPhys = el === 'physical';

                    if (mod.condition.type === 'magic' && !isMagic) return;
                    if (mod.condition.type === 'physical' && !isPhys) return;
                }
                if ((mod.value || 0) > max) {
                    max = mod.value;
                }
            }
        });
        return max;
    }

    /**
     * 计算异常/爆发伤害
     * 异常伤害 = 基础伤害区 * 其他乘区 * 法术等级区 * 源石技艺强度区
     * 
     * @param {string} anomalyType - 异常类型
     * @param {Object} context - 计算上下文
     * @param {Object} context.sourceChar - 触发者角色
     * @param {number} context.level - 异常等级 (1-4)
     * @param {string} context.element - 元素类型 (用于法术爆发)
     * @param {number} context.charLevel - 角色等级 (用于法术等级区)
     * @param {number} context.artsStrength - 源石技艺强度
     * @param {Object} enemyStats - 敌人属性
     */
    static calculateReactionDamage(anomalyType, context, enemyStats) {
        const sourceAtk = context.sourceChar ? this.calculateAttack(context.sourceChar, context) : 500;
        const anomalyLevel = context.level || 1;

        let multiplier = 0;
        let element = 'Physical';
        let isMagic = false; // 是否为法术伤害，影响法术等级区

        const type = String(anomalyType).toLowerCase();

        // === 法术异常伤害倍率 ===
        
        // 燃烧初始伤害
        if (type === 'burn_initial' || type === 'status_burn_initial') {
            // 初始伤害倍率 = 80% + 80% * 异常等级
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'Fire';
            isMagic = true;
        }
        // 燃烧 DoT (每秒伤害)
        else if (type.includes('burn_dot') || type === 'burn_tick') {
            // 每秒持续伤害基础倍率 = 12% + 12% * 异常等级
            multiplier = 0.12 + 0.12 * anomalyLevel;
            element = 'Fire';
            isMagic = true;
        }
        // 兼容旧的燃烧类型 - 默认为DoT
        else if (type.includes('burn') || type === 'status_burn') {
            multiplier = 0.12 + 0.12 * anomalyLevel;
            element = 'Fire';
            isMagic = true;
        }
        // 法术爆发 (同元素附着反应)
        else if (type === 'burst') {
            // 法术爆发伤害倍率 = 160%
            multiplier = 1.60;
            element = context.element || 'Fire';
            isMagic = true;
        }
        // 导电初始伤害
        else if (type.includes('conduct') || type === 'status_conduct') {
            // 基础倍率 = 80% + 80% * 异常等级
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'Electric';
            isMagic = true;
        }
        // 腐蚀初始伤害
        else if (type.includes('corrosion') || type === 'status_corrosion') {
            // 基础倍率 = 80% + 80% * 异常等级
            multiplier = 0.80 + 0.80 * anomalyLevel;
            element = 'Nature';
            isMagic = true;
        }
        // 冻结
        else if (type.includes('freeze') || type === 'status_freeze') {
            // 基础倍率 = 130%
            multiplier = 1.30;
            element = 'Ice';
            isMagic = true;
        }
        // 碎冰 (冻结后施加破防或物理异常触发)
        else if (type.includes('shatter') || type === 'status_shatter') {
            // 基础倍率 = 120% + 120% * 本次冻结的异常等级
            multiplier = 1.20 + 1.20 * anomalyLevel;
            element = 'Physical'; // 碎冰造成物理伤害
            isMagic = false;
        }
        // === 物理异常伤害倍率 ===
        // 猛击
        else if (type.includes('slam') || type === 'status_slam') {
            // 伤害倍率 = 150% + 150% * 消耗的破防层数
            multiplier = 1.50 + 1.50 * anomalyLevel;
            element = 'Physical';
            isMagic = false;
        }
        // 碎甲
        else if (type.includes('sunder') || type === 'status_sunder') {
            // 额外伤害倍率 = 50% + 50% * 破防层数
            multiplier = 0.50 + 0.50 * anomalyLevel;
            element = 'Physical';
            isMagic = false;
        }
        // 击飞/倒地
        else if (type.includes('launch') || type.includes('knockdown') || type === 'status_launch' || type === 'status_knockdown') {
            // 伤害倍率 = 120%
            multiplier = 1.20;
            element = 'Physical';
            isMagic = false;
        }
        else {
            // Default/Fallback
            multiplier = 0.1 * anomalyLevel;
        }

        // 抗性区
        const resMult = this.calculateResMult({ stats: enemyStats }, element, context);

        // 法术等级区 (仅法术伤害)
        let spellLevelMult = 1.0;
        if (isMagic) {
            const charLevel = context.charLevel || context.sourceChar?.level || 1;
            // 法术等级 = 1 + 5/980 * (角色等级 - 1)
            spellLevelMult = 1 + (5 / 980) * (charLevel - 1);
        }

        // 源石技艺强度区 (仅法术伤害)
        let artsStrengthMult = 1.0;
        if (isMagic) {
            const artsStrength = context.artsStrength || context.sourceChar?.stats?.artsStrength || 0;
            // 源石技艺强度区 = 1 + 源石技艺强度 / 100
            artsStrengthMult = 1 + artsStrength / 100;
        }

        // 最终伤害
        const finalDamage = sourceAtk * multiplier * resMult * spellLevelMult * artsStrengthMult;
        
        return Math.floor(finalDamage);
    }

    /**
     * 计算期望伤害 (用于显示)
     * 按暴击率计算期望值
     */
    static calculateExpectedDamage(attacker, target, skillNode, context) {
        const critRate = Math.min(1, (attacker.stats?.critRate || 0) + (context.critRateBonus || 0));
        
        // 计算非暴击伤害
        const noCritContext = { ...context, critMode: CRIT_MODE.NEVER };
        const noCritDmg = this.calculate(attacker, target, skillNode, noCritContext);
        
        // 计算暴击伤害
        const critContext = { ...context, critMode: CRIT_MODE.ALWAYS };
        const critDmg = this.calculate(attacker, target, skillNode, critContext);
        
        // 期望值 = 非暴击伤害 * (1 - 暴击率) + 暴击伤害 * 暴击率
        return Math.floor(noCritDmg * (1 - critRate) + critDmg * critRate);
    }
}
