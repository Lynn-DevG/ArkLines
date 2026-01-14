/**
 * ActionExecutor - 行为执行器
 * 
 * 负责执行技能中定义的各种行为类型
 * 
 * 行为类型：
 * - damage: 造成伤害
 * - add_stagger: 增加失衡值
 * - recover_usp_self: 回复自身终结技能量
 * - recover_usp_team: 回复全队终结技能量
 * - recover_atb: 回复技力
 * - add_buff: 添加buff
 * - consume_buff: 消耗buff
 */

import { DamageCalculator } from './DamageCalculator.js';
import { ConditionEvaluator } from './ConditionEvaluator.js';
import { getBuffDef, resolveBuffId } from '../data/buffs.js';
import { resolveTargets, getTargetObject } from './utils/targetResolver.js';
import { resolveValue, getMaxUsp } from './utils/paramResolver.js';

export class ActionExecutor {
    /**
     * @param {Object} context - 执行上下文
     * @param {Object} context.buffManager - Buff管理器实例
     * @param {Object} context.comboManager - 连击管理器
     * @param {Array} context.characters - 所有角色
     * @param {Object} context.enemy - 敌人数据
     * @param {Object} context.resources - 资源状态 { atb, usp: { charId: value } }
     * @param {Array} context.actionHistory - 历史行为记录（可写入）
     * @param {Function} context.onLog - 日志回调
     * @param {Function} [context.onBuffEvent] - buff 事件回调（用于生成 buff 区间）
     * @param {Object} context.skillLevelMappings - 技能等级映射数据
     */
    constructor(context) {
        this.context = context;
        this.conditionEvaluator = null;
    }

    /**
     * 创建条件评估器（延迟初始化）
     */
    getConditionEvaluator(sourceCharId, currentTime) {
        return new ConditionEvaluator({
            buffManager: this.context.buffManager,
            actionHistory: this.context.actionHistory,
            comboManager: this.context.comboManager,
            characters: this.context.characters,
            enemy: this.context.enemy,
            sourceCharId,
            mainCharId: this.context.mainCharId,
            currentTime,
            usp: this.context.resources?.usp,
            atb: this.context.resources?.atb
        });
    }

    /**
     * 执行单个行为
     * @param {Object} action - 行为定义
     * @param {Object} actionContext - 行为上下文
     * @param {string} actionContext.sourceCharId - 来源角色ID
     * @param {number} actionContext.currentTime - 当前时间
     * @param {Object} actionContext.skillDef - 技能定义
     * @param {number} actionContext.skillLevel - 技能等级
     * @returns {Object} 执行结果
     */
    execute(action, actionContext) {
        const { sourceCharId, currentTime, skillDef, skillLevel = 1 } = actionContext;
        
        // 检查行为变体
        let finalAction = this.resolveActionVariant(action, sourceCharId, currentTime);
        
        // 检查行为生效条件
        if (finalAction.condition) {
            const evaluator = this.getConditionEvaluator(sourceCharId, currentTime);
            if (!evaluator.evaluate(finalAction.condition)) {
                return { executed: false, reason: 'condition_not_met' };
            }
        }
        
        // 解析参数值（支持从技能等级映射获取）
        finalAction = this.resolveActionParams(finalAction, skillDef, skillLevel);
        
        // 执行主行为
        const result = this.executeAction(finalAction, actionContext);
        
        // 如果主行为成功，执行衍生行为
        if (result.executed && finalAction.derivedActions?.length > 0) {
            result.derivedResults = [];
            for (const derived of finalAction.derivedActions) {
                const derivedResult = this.execute(derived, actionContext);
                result.derivedResults.push(derivedResult);
            }
        }
        
        return result;
    }

    /**
     * 解析行为变体
     */
    resolveActionVariant(action, sourceCharId, currentTime) {
        if (!action.variants || action.variants.length === 0) {
            return action;
        }
        
        const evaluator = this.getConditionEvaluator(sourceCharId, currentTime);
        
        for (const variant of action.variants) {
            // 变体必须有条件
            if (!variant.condition) continue;
            
            if (evaluator.evaluate(variant.condition)) {
                // 合并变体参数到行为
                const { condition, ...overrides } = variant;
                return { ...action, ...overrides, _variantApplied: true };
            }
        }
        
        return action;
    }

    /**
     * 解析行为参数（支持从技能等级映射获取动态值）
     */
    resolveActionParams(action, skillDef, skillLevel) {
        const mappings = this.context.skillLevelMappings;
        if (!mappings || !skillDef?.id) return action;
        
        const skillMappings = mappings[skillDef.id];
        if (!skillMappings) return action;
        
        const resolved = { ...action };
        
        // 检查需要从映射获取的参数
        const paramKeys = ['damageRatio', 'value', 'stacks', 'duration'];
        
        for (const key of paramKeys) {
            const paramValue = action[key];
            if (typeof paramValue === 'string' && paramValue.startsWith('$')) {
                // 格式: $key_name -> 从映射中获取
                const mappingKey = paramValue.slice(1);
                const levelData = skillMappings[skillLevel] || skillMappings[1];
                if (levelData && levelData[mappingKey] !== undefined) {
                    resolved[key] = levelData[mappingKey];
                }
            }
        }
        
        return resolved;
    }

    /**
     * 执行具体行为
     */
    executeAction(action, actionContext) {
        const { sourceCharId, currentTime, skillDef, skillLevel } = actionContext;
        const sourceChar = this.context.characters?.find(c => c.id === sourceCharId);
        
        if (!sourceChar) {
            return { executed: false, reason: 'source_not_found' };
        }
        
        // 解析目标
        const targetContext = {
            characters: this.context.characters,
            enemy: this.context.enemy,
            sourceCharId,
            mainCharId: this.context.mainCharId
        };
        const targets = resolveTargets(action.target || 'enemy', targetContext, action.targetCount || 1);
        
        switch (action.type) {
            case 'damage':
                return this.executeDamage(action, sourceChar, targets, actionContext);
                
            case 'add_stagger':
                return this.executeAddStagger(action, sourceChar, targets, actionContext);
                
            case 'recover_usp_self':
                return this.executeRecoverUspSelf(action, sourceChar, actionContext);
                
            case 'recover_usp_team':
                return this.executeRecoverUspTeam(action, sourceChar, actionContext);
                
            case 'recover_atb':
                return this.executeRecoverAtb(action, sourceChar, actionContext);
                
            case 'add_buff':
                return this.executeAddBuff(action, sourceChar, targets, actionContext);
                
            case 'consume_buff':
                return this.executeConsumeBuff(action, sourceChar, targets, actionContext);
                
            // 兼容旧格式
            case 'status_apply':
            case 'poise':
                return this.executeLegacyStatus(action, sourceChar, targets, actionContext);
                
            default:
                console.warn(`未知的行为类型: ${action.type}`);
                return { executed: false, reason: 'unknown_action_type' };
        }
    }

    /**
     * 执行伤害行为
     */
    executeDamage(action, sourceChar, targets, actionContext) {
        const { currentTime, skillDef, skillLevel, comboStep, isHeavy, actionId, skillId } = actionContext;
        const { buffManager, enemy, onLog } = this.context;
        
        // 目标解析上下文
        const targetContext = {
            characters: this.context.characters,
            enemy: this.context.enemy,
            sourceCharId: sourceChar.id,
            mainCharId: this.context.mainCharId
        };
        
        let totalDamage = 0;
        const damageResults = [];
        
        // 获取技能类型
        const skillType = skillDef?.type;
        
        // 获取连击层数（仅对战技和终结技生效）
        let comboStacks = 0;
        if (skillType === 'SKILL' || skillType === 'ULTIMATE') {
            comboStacks = buffManager?.getBuffStackCount('team', 'buff_combo') || 0;
            // 战技/终结技释放时消耗连击
            if (comboStacks > 0) {
                buffManager?.consumeBuff('team', 'buff_combo', comboStacks);
                onLog?.({
                    time: Number(currentTime.toFixed(2)),
                    type: 'COMBO_CONSUME',
                    detail: `消耗 ${comboStacks} 层连击加成`
                });
            }
        }
        
        for (const targetId of targets) {
            const target = getTargetObject(targetId, targetContext);
            if (!target) continue;
            
            // 处理物理伤害的破防逻辑
            const element = action.element || skillDef?.element || 'physical';
            if (element.toLowerCase() === 'physical') {
                buffManager?.handlePhysicalHit(targetId, sourceChar.id);
            }
            
            // 收集增益减益修正
            const activeModifiers = this.collectActiveModifiers(sourceChar.id, targetId);
            
            // 判断目标是否处于失衡状态（通过检查 status_stun buff）
            const isPoiseBroken = this.context.buffManager?.getBuffStackCount(targetId, 'status_stun') > 0;
            
            const damageContext = {
                activeModifiers,
                sourceChar,
                skillId: skillDef?.id,
                skillLevel,
                skillType,          // 技能类型
                comboStacks,        // 连击层数
                critMode: this.context.critMode || 'random',  // 暴击模式
                isPoiseBroken       // 通过 buff 判断失衡状态
            };
            
            // 构建伤害节点
            const damageNode = {
                ...action,
                element,
                index: comboStep || action.index || 1
            };
            
            const damage = DamageCalculator.calculate(sourceChar, target, damageNode, damageContext);
            totalDamage += damage;
            
            // 更新目标血量
            if (target.stats) {
                target.stats.currentHp = Math.max(0, target.stats.currentHp - damage);
            }
            
            // 资源恢复（技力/终结技能量）- 支持 xxxKey 查找
            const resolveContext = { skillId: skillDef?.id, skillLevel };
            const atbGain = resolveValue(action, 'atb', 0, resolveContext);
            const uspGain = resolveValue(action, 'usp', 0, resolveContext);
            const poiseGain = resolveValue(action, 'poise', 0, resolveContext);
            
            if (atbGain) {
                let newAtb = this.context.resources.atb + atbGain;
                // 修复浮点精度问题：如果非常接近 300，直接设为 300
                if (newAtb >= 299.99 && newAtb < 300) {
                    newAtb = 300;
                }
                this.context.resources.atb = Math.min(300, newAtb);
            }
            if (uspGain) {
                const maxUsp = getMaxUsp(sourceChar.id, this.context.characters);
                this.context.resources.usp[sourceChar.id] = Math.min(maxUsp, 
                    (this.context.resources.usp[sourceChar.id] || 0) + uspGain);
            }
            
            // 处理失衡值（poise）
            if (poiseGain && target.stats) {
                target.stats.currentPoise = (target.stats.currentPoise || 0) + poiseGain;
                
                // 检查是否达到失衡阈值
                const maxPoise = target.stats.maxPoise || 100;
                if (target.stats.currentPoise >= maxPoise) {
                    // 触发失衡状态
                    this.context.buffManager?.applyBuff(targetId, 'status_stun', sourceChar.id, 1);
                    target.stats.currentPoise = 0;
                    
                    onLog?.({
                        time: Number(currentTime.toFixed(2)),
                        type: 'STAGGER',
                        detail: `敌人进入失衡状态`
                    });
                }
            }
            
            damageResults.push({ targetId, damage });
            
            // 记录日志
            let logSuffix = '';
            if (isHeavy) logSuffix = ' (重击)';
            else if (comboStep) logSuffix = ` (连击${comboStep})`;
            
            onLog?.({
                time: Number(currentTime.toFixed(2)),
                type: 'DAMAGE',
                source: sourceChar.name,
                actionId,
                skillId: skillId || skillDef?.id,
                skillType: skillDef?.type,
                value: damage,
                detail: `造成 ${damage} 伤害 (${element})${logSuffix}`
            });
            
            // 记录历史
            this.recordHistory({
                type: 'DAMAGE_DEALT',
                time: currentTime,
                sourceId: sourceChar.id,
                targetId,
                damage,
                damageType: element,
                skillType: skillDef?.type,
                skillId: skillDef?.id
            });
        }
        
        return { executed: true, totalDamage, results: damageResults };
    }

    /**
     * 执行增加失衡值
     */
    executeAddStagger(action, sourceChar, targets, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { enemy, onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const value = resolveValue(action, 'value', 0, resolveContext) || 
                      resolveValue(action, 'poise', 0, resolveContext);
        
        // 目标解析上下文
        const targetContext = {
            characters: this.context.characters,
            enemy: this.context.enemy,
            sourceCharId: sourceChar.id,
            mainCharId: this.context.mainCharId
        };
        
        for (const targetId of targets) {
            const target = getTargetObject(targetId, targetContext);
            if (!target || !target.stats) continue;
            
            // 增加失衡值
            target.stats.currentPoise = (target.stats.currentPoise || 0) + value;
            
            // 检查是否达到失衡
            const maxPoise = target.stats.maxPoise || 100;
            if (target.stats.currentPoise >= maxPoise) {
                // 触发失衡状态
                this.context.buffManager?.applyBuff(targetId, 'status_stun', sourceChar.id, 1);
                target.stats.currentPoise = 0;
                
                onLog?.({
                    time: Number(currentTime.toFixed(2)),
                    type: 'STAGGER',
                    detail: `敌人进入失衡状态`
                });
            }
            
            onLog?.({
                time: Number(currentTime.toFixed(2)),
                type: 'STAGGER_ADD',
                value,
                detail: `增加 ${value} 失衡值`
            });
        }
        
        return { executed: true, value };
    }

    /**
     * 执行回复自身终结技能量
     */
    executeRecoverUspSelf(action, sourceChar, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const value = resolveValue(action, 'value', 0, resolveContext);
        
        const maxUsp = getMaxUsp(sourceChar.id, this.context.characters);
        const currentUsp = this.context.resources.usp[sourceChar.id] || 0;
        const newUsp = Math.min(maxUsp, currentUsp + value);
        this.context.resources.usp[sourceChar.id] = newUsp;
        
        onLog?.({
            time: Number(currentTime.toFixed(2)),
            type: 'USP_GAIN',
            source: sourceChar.name,
            value,
            detail: `${sourceChar.name} 回复 ${value} 终结技能量`
        });
        
        return { executed: true, value, newUsp };
    }

    /**
     * 执行回复全队终结技能量
     */
    executeRecoverUspTeam(action, sourceChar, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { characters, onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const value = resolveValue(action, 'value', 0, resolveContext);
        
        const results = [];
        for (const char of (characters || [])) {
            const maxUsp = getMaxUsp(char.id, this.context.characters);
            const currentUsp = this.context.resources.usp[char.id] || 0;
            const newUsp = Math.min(maxUsp, currentUsp + value);
            this.context.resources.usp[char.id] = newUsp;
            results.push({ charId: char.id, newUsp });
        }
        
        onLog?.({
            time: Number(currentTime.toFixed(2)),
            type: 'USP_GAIN_TEAM',
            source: sourceChar.name,
            value,
            detail: `全队回复 ${value} 终结技能量`
        });
        
        return { executed: true, value, results };
    }

    /**
     * 执行回复技力
     */
    executeRecoverAtb(action, sourceChar, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const value = resolveValue(action, 'value', 0, resolveContext);
        
        const currentAtb = this.context.resources.atb || 0;
        let newAtb = currentAtb + value;
        // 修复浮点精度问题：如果非常接近 300，直接设为 300
        if (newAtb >= 299.99 && newAtb < 300) {
            newAtb = 300;
        }
        this.context.resources.atb = Math.min(300, newAtb);
        
        onLog?.({
            time: Number(currentTime.toFixed(2)),
            type: 'ATB_GAIN',
            source: sourceChar.name,
            value,
            detail: `回复 ${value} 技力`
        });
        
        return { executed: true, value, newAtb };
    }

    /**
     * 执行添加Buff
     */
    executeAddBuff(action, sourceChar, targets, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { buffManager, onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const buffId = action.buffId || action.status;
        const stacks = resolveValue(action, 'stacks', 1, resolveContext);
        const duration = resolveValue(action, 'duration', undefined, resolveContext);
        
        const results = [];
        for (const targetId of targets) {
            const result = buffManager?.applyBuff(targetId, buffId, sourceChar.id, stacks, duration);
            results.push({ targetId, result });
            
            const buffDef = getBuffDef(buffId);
            const buffName = buffDef?.name || buffId;
            
            // buff事件（用于生成 buff 区间）
            const resolvedId = resolveBuffId(buffId);
            const resolvedDef = getBuffDef(resolvedId);
            let finalDuration = duration;
            if (finalDuration === undefined || finalDuration === null) {
                if (resolvedDef?.duration !== undefined) {
                    finalDuration = resolvedDef.duration;
                } else if (resolvedDef?.durations && Array.isArray(resolvedDef.durations) && resolvedDef.durations.length > 0) {
                    const idx = Math.min(Math.max(0, (stacks || 1) - 1), resolvedDef.durations.length - 1);
                    finalDuration = resolvedDef.durations[idx];
                } else {
                    // 默认无限持续
                    finalDuration = -1;
                }
            }
            const evType = result?.type === 'REFRESH' ? 'REFRESH' : 'APPLY';
            this.context.onBuffEvent?.({
                type: evType,
                time: currentTime,
                targetId,
                sourceId: sourceChar.id,
                buffId: resolvedId,
                stacks,
                duration: finalDuration
            });
            
            onLog?.({
                time: Number(currentTime.toFixed(2)),
                type: 'BUFF_APPLIED',
                detail: `对 ${targetId} 施加了 ${buffName}${stacks > 1 ? ` x${stacks}` : ''}`
            });
            
            // 记录历史
            this.recordHistory({
                type: 'BUFF_APPLIED',
                time: currentTime,
                sourceId: sourceChar.id,
                targetId,
                buffId: resolveBuffId(buffId)
            });
            
            // 如果目标是角色，也记录接收事件
            if (this.context.characters?.find(c => c.id === targetId)) {
                this.recordHistory({
                    type: 'BUFF_RECEIVED',
                    time: currentTime,
                    sourceId: sourceChar.id,
                    targetId,
                    buffId: resolveBuffId(buffId)
                });
            }
            
            // 处理反应结果
            if (result?.type === 'REACTION') {
                const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                    sourceChar,
                    level: result.level || 1
                }, this.context.enemy?.stats);
                
                if (burstDmg > 0) {
                    onLog?.({
                        time: Number(currentTime.toFixed(2)),
                        type: 'REACTION_DAMAGE',
                        source: sourceChar.name,
                        value: burstDmg,
                        detail: `反应爆发伤害 ${burstDmg}`
                    });
                }
            }
        }
        
        return { executed: true, buffId, stacks, results };
    }

    /**
     * 执行消耗Buff
     */
    executeConsumeBuff(action, sourceChar, targets, actionContext) {
        const { currentTime, skillDef, skillLevel } = actionContext;
        const { buffManager, onLog } = this.context;
        
        // 支持 xxxKey 查找
        const resolveContext = { skillId: skillDef?.id, skillLevel: skillLevel || 1 };
        const buffId = action.buffId;
        const stacks = resolveValue(action, 'stacks', 1, resolveContext);
        
        const results = [];
        for (const targetId of targets) {
            const consumeResult = buffManager?.consumeBuff(targetId, buffId, stacks, sourceChar.id);
            if (!consumeResult) continue;
            
            results.push({ targetId, consumed: consumeResult.consumedStacks, remaining: consumeResult.remainingStacks });
                
                const buffDef = getBuffDef(buffId);
                const buffName = buffDef?.name || buffId;
                
                // buff事件（用于生成 buff 区间）
                this.context.onBuffEvent?.({
                    type: 'CONSUME',
                    time: currentTime,
                    targetId,
                    sourceId: sourceChar.id,
                    buffId: consumeResult.buffId,
                    consumedStacks: consumeResult.consumedStacks,
                    remainingStacks: consumeResult.remainingStacks
                });
                
                onLog?.({
                    time: Number(currentTime.toFixed(2)),
                    type: 'BUFF_CONSUMED',
                    detail: `消耗了 ${targetId} 的 ${buffName}${consumeResult.consumedStacks > 1 ? ` x${consumeResult.consumedStacks}` : ''}`
                });
                
                // 记录历史
                this.recordHistory({
                    type: 'BUFF_CONSUMED',
                    time: currentTime,
                    sourceId: sourceChar.id,
                    targetId,
                    buffId: consumeResult.buffId,
                    stacks: consumeResult.consumedStacks
                });
                
                // 如果目标是角色，也记录被消耗事件
                if (this.context.characters?.find(c => c.id === targetId)) {
                    this.recordHistory({
                        type: 'BUFF_WAS_CONSUMED',
                        time: currentTime,
                        consumerId: sourceChar.id,
                        targetId,
                        buffId: consumeResult.buffId,
                        stacks: consumeResult.consumedStacks
                    });
                }
        }
        
        return { executed: true, buffId, results };
    }

    /**
     * 执行旧格式的状态施加（兼容）
     */
    executeLegacyStatus(action, sourceChar, targets, actionContext) {
        const { currentTime } = actionContext;
        const { buffManager, onLog } = this.context;
        
        // 将旧格式转换为 add_buff
        const buffId = action.type === 'poise' ? 'status_break' : action.status;
        const stacks = action.stacks || 1;
        const duration = action.duration;
        
        return this.executeAddBuff({
            ...action,
            type: 'add_buff',
            buffId,
            stacks,
            duration
        }, sourceChar, targets, actionContext);
    }

    /**
     * 收集当前激活的增益减益修正
     */
    collectActiveModifiers(sourceCharId, targetId) {
        const { buffManager, enemy } = this.context;
        const activeModifiers = [];
        
        const enemyBuffs = buffManager?.getBuffsOnTarget(targetId) || [];
        
        for (const b of enemyBuffs) {
            const bDef = getBuffDef(b.baseId);
            if (!bDef || !bDef.effect) continue;
            
            if (bDef.effect === 'vulnerability_magic') {
                const val = (bDef.values && bDef.values[b.stacks - 1]) || 0.12;
                activeModifiers.push({ type: 'vulnerability', value: val, condition: { type: 'magic' } });
            }
            if (bDef.effect === 'vulnerability_phys') {
                const val = (bDef.values && bDef.values[b.stacks - 1]) || 0.11;
                activeModifiers.push({ type: 'vulnerability', value: val, condition: { type: 'physical' } });
            }
            if (bDef.effect === 'res_shred') {
                const levelIndex = Math.min(Math.max(0, (b.stacks || 1) - 1), 3);
                const timeFactor = Math.min(10, b.timeActive || 0);
                const initialShred = bDef.initialResShred?.[levelIndex] ?? (3.6 + 1.2 * levelIndex);
                const shredPerSec = bDef.resShredPerSec?.[levelIndex] ?? (0.84 + 0.28 * levelIndex);
                const maxShred = bDef.maxResShred?.[levelIndex] ?? (12 + 4 * levelIndex);
                const val = Math.min(maxShred, initialShred + shredPerSec * timeFactor);
                activeModifiers.push({ type: 'res_shred', value: val });
            }
            if (bDef.effect === 'vulnerability_stun') {
                activeModifiers.push({ type: 'vulnerability', value: bDef.value || 0.3, condition: { type: 'stun' } });
            }
        }
        
        return activeModifiers;
    }

    /**
     * 记录历史行为
     */
    recordHistory(record) {
        if (this.context.actionHistory && Array.isArray(this.context.actionHistory)) {
            this.context.actionHistory.push(record);
        }
    }
}

/**
 * 创建行为执行器
 */
export function createActionExecutor(context) {
    return new ActionExecutor(context);
}

