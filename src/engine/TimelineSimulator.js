import { DamageCalculator } from './DamageCalculator.js';
import { BuffManager } from './BuffManager.js';
import { ComboManager } from './ComboManager.js';
import { ConditionEvaluator } from './ConditionEvaluator.js';
import { ActionExecutor } from './ActionExecutor.js';
import { SKILLS } from '../data/skills.js';
import { BUFFS, getBuffDef } from '../data/buffs.js';
import { getSkillValue } from '../data/levelMappings.js';

export class TimelineSimulator {
    constructor(characters, enemyConfig) {
        this.characters = characters; // Array of char objects
        this.enemy = { ...enemyConfig, stats: { ...enemyConfig.stats, currentHp: enemyConfig.stats.baseHp } };

        this.timelineActions = []; // Placed skills
        this.buffManager = new BuffManager();
        this.logs = [];

        // Resources
        this.atb = 200; // Shared ATB (formerly SP)
        this.usp = {}; // Per character (formerly Ult Energy)
        characters.forEach(c => this.usp[c.id] = 0);

        // 历史行为记录（用于条件判断）
        this.actionHistory = [];
        
        // 主控角色ID
        this.mainCharId = characters[0]?.id || null;
        
        // 存储每个 action 的最终解析结果（变体解析后的技能定义）
        // 结构: Map<actionId, { skillDef, comboInfo }>
        this.resolvedActionSkills = new Map();
    }

    /**
     * 设置主控角色
     */
    setMainCharacter(charId) {
        this.mainCharId = charId;
    }

    /**
     * 设置暴击模式
     * @param {string} mode - 'random'(随机)/'always'(固定暴击)/'never'(固定非暴击)
     */
    setCritMode(mode) {
        this.critMode = mode;
    }

    /**
     * 创建条件评估器
     */
    createConditionEvaluator(sourceCharId, currentTime) {
        return new ConditionEvaluator({
            buffManager: this.buffManager,
            actionHistory: this.actionHistory,
            comboManager: this.comboManager,
            characters: this.characters,
            enemy: this.enemy,
            sourceCharId,
            mainCharId: this.mainCharId,
            currentTime,
            usp: this.usp,
            atb: this.atb
        });
    }

    /**
     * 创建行为执行器
     */
    createActionExecutor() {
        return new ActionExecutor({
            buffManager: this.buffManager,
            comboManager: this.comboManager,
            characters: this.characters,
            enemy: this.enemy,
            resources: { atb: this.atb, usp: this.usp },
            actionHistory: this.actionHistory,
            mainCharId: this.mainCharId,
            onLog: (log) => this.logs.push(log)
        });
    }

    /**
     * Validates all placed actions based on resource constraints.
     * Returns a Set of invalid action IDs.
     */
    validateActions(actionsToValidate) {
        const invalidIds = new Set();
        let tempAtb = 200; // Start ATB
        let tempUsp = {};
        this.characters.forEach(c => tempUsp[c.id] = 0);
        let tempCooldowns = {};

        const sorted = [...actionsToValidate].sort((a, b) => a.startTime - b.startTime);
        let lastTime = 0;

        sorted.forEach(action => {
            // Natural Recovery
            const dt = Math.max(0, action.startTime - lastTime);
            tempAtb = Math.min(300, tempAtb + dt * 8); // Base recovery rate
            lastTime = action.startTime;

            const skill = SKILLS[action.skillId];
            if (!skill) return;

            let valid = true;

            // 1. ATB Cost
            if (skill.atbCost > 0 && tempAtb < skill.atbCost) valid = false;

            // 2. USP Cost
            if (skill.type === 'ULTIMATE') {
                const energy = tempUsp[action.charId] || 0;
                if (energy < (skill.uspCost || 100)) valid = false;
            }

            // 3. Cooldown
            const readyAt = tempCooldowns[action.skillId] || 0;
            if (readyAt > action.startTime + 0.01) valid = false; // tolerance

            if (!valid) {
                invalidIds.add(action.id);
            } else {
                // Apply Consumption
                if (skill.atbCost) tempAtb -= skill.atbCost;
                if (skill.type === 'ULTIMATE') tempUsp[action.charId] = 0;

                // Set Cooldown
                tempCooldowns[action.skillId] = action.startTime + (skill.cooldown || 0);
            }
        });

        return invalidIds;
    }

    /**
     * Main Simulation Loop
     */
    run(duration, invalidActionIds = new Set()) {
        const TICK = 0.1;
        this.logs = [];
        this.buffManager = new BuffManager(); // Reset
        this.comboManager = new ComboManager(); // Reset Combo State
        this.actionHistory = []; // Reset Action History

        this.atb = 200;
        this.characters.forEach(c => this.usp[c.id] = 0);

        let totalDamage = 0;

        // 清空之前的解析结果
        this.resolvedActionSkills.clear();
        
        // 记录每个角色的终结技能量变化历史
        // 结构: { charId: [{ time, energy, reason }] }
        const uspTimelines = {};
        this.characters.forEach(c => {
            uspTimelines[c.id] = [{ time: 0, energy: 0, reason: 'initial' }];
        });

        // 辅助函数：记录能量变化
        const recordUspChange = (charId, time, reason) => {
            const energy = this.usp[charId] || 0;
            const timeline = uspTimelines[charId];
            // 避免在同一时间点重复记录相同能量值
            const lastEntry = timeline[timeline.length - 1];
            if (lastEntry && Math.abs(lastEntry.time - time) < 0.01 && lastEntry.energy === energy) {
                return;
            }
            timeline.push({ time: Number(time.toFixed(2)), energy, reason });
        };

        // Filter valid actions only for execution
        const validActions = this.timelineActions.filter(a => !invalidActionIds.has(a.id));
        const sortedActions = [...validActions].sort((a, b) => a.startTime - b.startTime);

        const activeSkills = {};

        for (let t = 0; t <= duration; t += TICK) {
            // 0. Resource Recovery
            this.atb = Math.min(300, this.atb + 0.8); // 8 units per second

            // 1. Buffs
            const events = this.buffManager.tick(TICK);
            events.forEach(ev => {
                if (ev.type === 'BUFF_TICK') {
                    const sourceChar = this.characters.find(c => c.id === ev.buff.sourceId);
                    if (sourceChar) {
                        const dmg = DamageCalculator.calculateReactionDamage(ev.buff.baseId, { sourceChar }, this.enemy.stats);
                        if (dmg > 0) {
                            const buffName = getBuffDef(ev.buff.baseId)?.name || ev.buff.baseId;
                            this.logs.push({ time: Number(t.toFixed(2)), type: 'DOT', source: ev.buff.baseId, value: dmg, detail: `${buffName} 持续伤害 ${dmg}` });
                            totalDamage += dmg;
                            this.enemy.stats.currentHp = Math.max(0, this.enemy.stats.currentHp - dmg);
                        }
                    }
                }
            });

            // 2. Start New Actions
            sortedActions.forEach(action => {
                if (Math.abs(action.startTime - t) < TICK / 2) {
                    const skillDef = SKILLS[action.skillId];
                    if (!skillDef) return;

                    // Deduct Costs
                    if (skillDef.atbCost) {
                        this.atb -= skillDef.atbCost;
                        // 战技消耗技力时，全队获得终结技能量 (6.5点/100技力)
                        const uspFromAtb = (skillDef.atbCost / 100) * 6.5;
                        this.characters.forEach(c => {
                            const ultSkill = SKILLS[c.skills?.ultimate];
                            const maxUsp = ultSkill?.uspCost || 100;
                            this.usp[c.id] = Math.min(maxUsp, (this.usp[c.id] || 0) + uspFromAtb);
                            recordUspChange(c.id, t, `atb_cost_${action.skillId}`);
                        });
                    }
                    
                    if (skillDef.type === 'ULTIMATE') {
                        this.usp[action.charId] = 0;
                        recordUspChange(action.charId, t, 'ultimate_cost');
                    }

                    // Prediction
                    let comboStep = 1;
                    let isHeavy = false;
                    let finalSkillDef = { ...skillDef };

                    if (skillDef.type === 'BASIC') {
                        const pred = this.comboManager.predictNext(action.charId, t, true);
                        comboStep = pred.step;
                        isHeavy = pred.isHeavy;
                    }

                    // Variant Resolution - 使用新的条件评估系统
                    if (skillDef.variants && Array.isArray(skillDef.variants)) {
                        const condEvaluator = this.createConditionEvaluator(action.charId, t);
                        // 注入连击状态以便条件评估
                        condEvaluator.context.comboState = { step: comboStep, isHeavy };
                        
                        for (const variant of skillDef.variants) {
                            if (!variant.condition) continue;
                            let match = false;
                            
                            // 统一条件格式：支持数组和单对象
                            const conditions = Array.isArray(variant.condition) ? variant.condition : [variant.condition];
                            
                            for (const cond of conditions) {
                                // 兼容旧的 combo 条件格式
                                if (cond.type === 'combo') {
                                    if (cond.value === 'heavy' && isHeavy) {
                                        match = true;
                                        break;
                                    } else if (comboStep === cond.value && !isHeavy) {
                                        match = true;
                                        break;
                                    }
                                } 
                                // 使用新条件系统评估其他条件
                                else if (condEvaluator.evaluateSingle(cond)) {
                                    match = true;
                                    break;
                                }
                            }
                            
                            if (match) {
                                const { condition, ...overrides } = variant;
                                finalSkillDef = { ...finalSkillDef, ...overrides };
                                break;
                            }
                        }
                    }

                    // 存储解析后的技能定义供 UI 使用
                    this.resolvedActionSkills.set(action.id, {
                        skillDef: finalSkillDef,
                        comboInfo: { step: comboStep, isHeavy }
                    });

                    // Prepare Events (新格式 actions 或旧格式 damage_ticks + anomalies)
                    const skillEvents = [];
                    
                    // 优先使用新格式的 actions 数组
                    if (finalSkillDef.actions && Array.isArray(finalSkillDef.actions)) {
                        finalSkillDef.actions.forEach((action, idx) => {
                            skillEvents.push({ 
                                ...action, 
                                offset: action.offset || 0,
                                index: action.index || idx + 1 
                            });
                        });
                    } 
                    // 兼容旧格式
                    else {
                        if (finalSkillDef.damage_ticks) {
                            finalSkillDef.damage_ticks.forEach((tick, idx) => {
                                skillEvents.push({ ...tick, type: 'damage', index: idx + 1 });
                            });
                        }
                        if (finalSkillDef.anomalies) {
                            finalSkillDef.anomalies.forEach(list => {
                                list.forEach(ano => {
                                    // 确保 anomaly 事件有 offset，默认为 0
                                    skillEvents.push({ offset: 0, ...ano }); // already has type
                                });
                            });
                        }
                    }
                    skillEvents.sort((a, b) => a.offset - b.offset);

                    activeSkills[action.id] = {
                        nextEventIndex: 0,
                        events: skillEvents,
                        def: finalSkillDef,
                        charId: action.charId,
                        comboStep,
                        isHeavy
                    };
                }
            });

            // 3. Process Active Skills
            Object.keys(activeSkills).forEach(actionId => {
                const state = activeSkills[actionId];
                const skillDef = state.def;
                const actionObj = validActions.find(a => a.id == actionId);
                const relativeTime = t - actionObj.startTime;

                while (state.nextEventIndex < state.events.length) {
                    const event = state.events[state.nextEventIndex];
                    if (relativeTime >= event.offset) {
                        this.executeNode(t, state.charId, event, state);
                        state.nextEventIndex++;
                    } else {
                        break;
                    }
                }

                if (relativeTime >= skillDef.duration && state.nextEventIndex >= state.events.length) {
                    // Skill finished, apply USP gain
                    // 注意：战技(TACTICAL)的能量获取已经在 atbCost 消耗时处理了，不需要再通过 uspGain 添加
                    // 这里只处理非战技的 uspGain（主要是连携技 CHAIN）
                    if (skillDef.uspGain && skillDef.type !== 'TACTICAL') {
                        const ultSkill = SKILLS[this.characters.find(c => c.id === state.charId)?.skills?.ultimate];
                        const maxUsp = ultSkill?.uspCost || 100;
                        this.usp[state.charId] = Math.min(maxUsp, (this.usp[state.charId] || 0) + skillDef.uspGain);
                        recordUspChange(state.charId, t, `skill_gain_${skillDef.id}`);
                    }
                    delete activeSkills[actionId];
                }
            });
        }

        // 添加时间轴结束点
        this.characters.forEach(c => {
            const timeline = uspTimelines[c.id];
            const lastEnergy = this.usp[c.id] || 0;
            timeline.push({ time: duration, energy: lastEnergy, reason: 'end' });
        });

        // Calculate Total Damage
        totalDamage = this.logs.reduce((acc, log) => {
            if (['DAMAGE', 'DOT', 'REACTION_DAMAGE'].includes(log.type)) {
                return acc + (log.value || 0);
            }
            return acc;
        }, 0);

        return { 
            logs: this.logs, 
            totalDamage, 
            uspTimelines,
            // 返回每个 action 的最终解析结果供 UI 使用
            resolvedActionSkills: this.resolvedActionSkills
        };
    }

    executeNode(time, charId, node, actionState = {}) {
        const char = this.characters.find(c => c.id === charId);
        if (!char) return;

        // 检查行为生效条件
        if (node.condition) {
            const condEvaluator = this.createConditionEvaluator(charId, time);
            if (!condEvaluator.evaluate(node.condition)) {
                return; // 条件不满足，跳过该行为
            }
        }

        // 处理新的行为类型
        switch (node.type) {
            case 'damage':
                this.executeDamageNode(time, char, node, actionState);
                break;
                
            case 'add_stagger':
                this.executeAddStaggerNode(time, char, node, actionState);
                break;
                
            case 'recover_usp_self':
                this.executeRecoverUspSelfNode(time, char, node, actionState);
                break;
                
            case 'recover_usp_team':
                this.executeRecoverUspTeamNode(time, char, node, actionState);
                break;
                
            case 'recover_atb':
                this.executeRecoverAtbNode(time, char, node, actionState);
                break;
                
            case 'add_buff':
                this.executeAddBuffNode(time, char, node, actionState);
                break;
                
            case 'consume_buff':
                this.executeConsumeBuffNode(time, char, node, actionState);
                break;
                
            // 兼容旧格式
            case 'status_apply':
            case 'poise':
                this.executeLegacyStatusNode(time, char, node, actionState);
                break;
                
            default:
                // 未知类型，尝试作为 buff 施加处理（兼容 anomalies 中的 type）
                if (node.type && node.stacks !== undefined) {
                    this.executeLegacyAnomalyNode(time, char, node, actionState);
                }
                break;
        }

        // 执行衍生行为
        if (node.derivedActions && Array.isArray(node.derivedActions)) {
            for (const derived of node.derivedActions) {
                this.executeNode(time, charId, derived, actionState);
            }
        }
    }

    /**
     * 执行伤害节点
     */
    executeDamageNode(time, char, node, actionState) {
        const element = node.element || actionState.def?.element || 'physical';
        
        if (element.toLowerCase() === 'physical') {
            this.buffManager.handlePhysicalHit(this.enemy.id || 'enemy_01', char.id);
        }

        const activeModifiers = this.collectActiveModifiers(char.id, this.enemy.id || 'enemy_01');
        
        // 获取技能类型
        const skillType = actionState.def?.type;
        
        // 获取连击层数（仅对战技和终结技生效）
        let comboStacks = 0;
        if (skillType === 'SKILL' || skillType === 'ULTIMATE') {
            comboStacks = this.buffManager.getBuffStackCount('team', 'buff_combo') || 0;
            // 战技/终结技释放时消耗连击
            if (comboStacks > 0) {
                this.buffManager.consumeBuff('team', 'buff_combo', comboStacks);
                this.logs.push({
                    time: Number(time.toFixed(2)),
                    type: 'COMBO_CONSUME',
                    detail: `消耗 ${comboStacks} 层连击加成`
                });
            }
        }

        const context = {
            activeModifiers,
            sourceChar: char,
            skillId: actionState.def?.id,  // 变体匹配后，这里会是变体的 id
            skillLevel: char.skillLevel || 1,
            isPoiseBroken: (this.enemy.stats.currentPoise || 0) <= 0,
            skillType,          // 技能类型
            comboStacks,        // 连击层数
            critMode: this.critMode || 'random'  // 暴击模式
        };

        // 直接使用 action 中的配置（包括 scalingKey、index 等）
        const lookupNode = { ...node, element };

        const dmg = DamageCalculator.calculate(char, this.enemy, lookupNode, context);

        let logSuffix = '';
        if (actionState.isHeavy) logSuffix = ' (重击)';
        else if (actionState.comboStep) logSuffix = ` (连击${actionState.comboStep})`;

        this.logs.push({
            time: Number(time.toFixed(2)),
            type: 'DAMAGE',
            source: char.name,
            value: dmg,
            detail: `造成 ${dmg} 伤害 (${element})${logSuffix}`
        });

        this.enemy.stats.currentHp = Math.max(0, this.enemy.stats.currentHp - dmg);

        // Resource recovery from hit (ATB/USP) - 支持 xxxKey 查找
        const atbGain = this.resolveValue(node, 'atb', 0, context);
        const uspGain = this.resolveValue(node, 'usp', 0, context);
        const poiseGain = this.resolveValue(node, 'poise', 0, context);
        
        if (atbGain) this.atb = Math.min(300, this.atb + atbGain);
        if (uspGain) {
            const maxUsp = this.getMaxUsp(char.id);
            this.usp[char.id] = Math.min(maxUsp, (this.usp[char.id] || 0) + uspGain);
        }
        
        // 处理失衡值（poise）
        if (poiseGain) {
            this.enemy.stats.currentPoise = (this.enemy.stats.currentPoise || 0) + poiseGain;
        }

        // 记录历史
        this.recordActionHistory({
            type: 'DAMAGE_DEALT',
            time,
            sourceId: char.id,
            targetId: this.enemy.id || 'enemy_01',
            damage: dmg,
            damageType: element,
            skillType: actionState.def?.type,
            skillId: actionState.def?.id
        });
    }

    /**
     * 执行增加失衡值节点
     */
    executeAddStaggerNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        // 支持 xxxKey 查找
        const value = this.resolveValue(node, 'value', 0, context) || 
                      this.resolveValue(node, 'poise', 0, context);
        
        this.enemy.stats.currentPoise = (this.enemy.stats.currentPoise || 0) + value;
        
        const maxPoise = this.enemy.stats.maxPoise || 100;
        if (this.enemy.stats.currentPoise >= maxPoise) {
            this.buffManager.applyBuff(this.enemy.id || 'enemy_01', 'status_stun', char.id, 1);
            this.enemy.stats.currentPoise = 0;
            
            this.logs.push({
                time: Number(time.toFixed(2)),
                type: 'STAGGER',
                detail: `敌人进入失衡状态`
            });
        }
        
        this.logs.push({
            time: Number(time.toFixed(2)),
            type: 'STAGGER_ADD',
            value,
            detail: `增加 ${value} 失衡值`
        });
    }

    /**
     * 执行回复自身终结技能量节点
     */
    executeRecoverUspSelfNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        const value = this.resolveValue(node, 'value', 0, context);
        const maxUsp = this.getMaxUsp(char.id);
        this.usp[char.id] = Math.min(maxUsp, (this.usp[char.id] || 0) + value);
        
        this.logs.push({
            time: Number(time.toFixed(2)),
            type: 'USP_GAIN',
            source: char.name,
            value,
            detail: `${char.name} 回复 ${value} 终结技能量`
        });
    }

    /**
     * 执行回复全队终结技能量节点
     */
    executeRecoverUspTeamNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        const value = this.resolveValue(node, 'value', 0, context);
        
        this.characters.forEach(c => {
            const maxUsp = this.getMaxUsp(c.id);
            this.usp[c.id] = Math.min(maxUsp, (this.usp[c.id] || 0) + value);
        });
        
        this.logs.push({
            time: Number(time.toFixed(2)),
            type: 'USP_GAIN_TEAM',
            source: char.name,
            value,
            detail: `全队回复 ${value} 终结技能量`
        });
    }

    /**
     * 执行回复技力节点
     */
    executeRecoverAtbNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        const value = this.resolveValue(node, 'value', 0, context);
        this.atb = Math.min(300, this.atb + value);
        
        this.logs.push({
            time: Number(time.toFixed(2)),
            type: 'ATB_GAIN',
            source: char.name,
            value,
            detail: `回复 ${value} 技力`
        });
    }

    /**
     * 执行添加Buff节点
     */
    executeAddBuffNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        const buffId = node.buffId || node.status;
        const stacks = this.resolveValue(node, 'stacks', 1, context);
        const duration = this.resolveValue(node, 'duration', undefined, context);
        const targetId = this.resolveTargetId(node.target, char.id);
        
        const res = this.buffManager.applyBuff(targetId, buffId, char.id, stacks, duration);
        
        if (res) {
            const buffDef = getBuffDef(buffId);
            const buffName = buffDef?.name || buffId;
            
            if (!node.hideDuration) {
                this.logs.push({
                    time: Number(time.toFixed(2)),
                    type: 'BUFF_APPLIED',
                    detail: `对 ${targetId === char.id ? '自身' : '敌人'} 施加了 ${buffName}${stacks > 1 ? ` x${stacks}` : ''}`
                });
            }
            
            // 记录历史
            this.recordActionHistory({
                type: 'BUFF_APPLIED',
                time,
                sourceId: char.id,
                targetId,
                buffId
            });
            
            // 处理反应
            if (res.type === 'REACTION') {
                const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                    sourceChar: char,
                    level: res.level || 1
                }, this.enemy.stats);

                if (burstDmg > 0) {
                    const anomalyName = getBuffDef(res.anomaly)?.name || res.anomaly;
                    this.logs.push({
                        time: Number(time.toFixed(2)),
                        type: 'REACTION_DAMAGE',
                        source: char.name,
                        value: burstDmg,
                        detail: `反应爆发 (${anomalyName})`
                    });
                }
            }
        }
    }

    /**
     * 执行消耗Buff节点
     */
    executeConsumeBuffNode(time, char, node, actionState) {
        const context = {
            skillId: actionState.def?.id,
            skillLevel: char.skillLevel || 1
        };
        
        const buffId = node.buffId;
        const stacks = this.resolveValue(node, 'stacks', 1, context);
        const targetId = this.resolveTargetId(node.target, char.id);
        
        const result = this.buffManager.consumeBuff(targetId, buffId, stacks, char.id);
        
        if (result) {
            const buffDef = getBuffDef(buffId);
            const buffName = buffDef?.name || buffId;
            
            this.logs.push({
                time: Number(time.toFixed(2)),
                type: 'BUFF_CONSUMED',
                detail: `消耗了 ${buffName}${result.consumedStacks > 1 ? ` x${result.consumedStacks}` : ''}`
            });
            
            // 记录历史
            this.recordActionHistory({
                type: 'BUFF_CONSUMED',
                time,
                sourceId: char.id,
                targetId,
                buffId,
                stacks: result.consumedStacks
            });
        }
    }

    /**
     * 执行旧格式状态节点（兼容）
     */
    executeLegacyStatusNode(time, char, node, actionState) {
        const statusType = node.type === 'poise' ? 'poise' : node.status;
        const res = this.buffManager.applyBuff(this.enemy.id || 'enemy_01', statusType, char.id, node.stacks || 1);
        
        if (res) {
            const statusName = statusType === 'poise' ? '失衡值' : (getBuffDef(statusType)?.name || statusType);
            this.logs.push({
                time: Number(time.toFixed(2)),
                type: 'STATUS',
                detail: `对敌人施加了 ${statusName}`
            });
            
            if (res.type === 'REACTION') {
                const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                    sourceChar: char,
                    level: res.level || 1
                }, this.enemy.stats);

                if (burstDmg > 0) {
                    const anomalyName = getBuffDef(res.anomaly)?.name || res.anomaly;
                    this.logs.push({
                        time: Number(time.toFixed(2)),
                        type: 'DAMAGE',
                        source: char.name,
                        value: burstDmg,
                        detail: `反应爆发 (${anomalyName})`
                    });
                }
            }
        }
    }

    /**
     * 执行旧格式异常节点（兼容 anomalies 数组中的类型）
     */
    executeLegacyAnomalyNode(time, char, node, actionState) {
        const targetId = this.enemy.id || 'enemy_01';
        const duration = node.duration || undefined;
        
        const res = this.buffManager.applyBuff(targetId, node.type, char.id, node.stacks || 1, duration);
        
        if (res) {
            const buffDef = getBuffDef(node.type);
            const statusName = buffDef?.name || node.type;
            
            if (!node.hideDuration) {
                this.logs.push({
                    time: Number(time.toFixed(2)),
                    type: 'STATUS',
                    detail: `对敌人施加了 ${statusName}${node.stacks > 1 ? ` x${node.stacks}` : ''}`
                });
            }
            
            if (res.type === 'REACTION') {
                const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                    sourceChar: char,
                    level: res.level || 1
                }, this.enemy.stats);

                if (burstDmg > 0) {
                    const anomalyName = getBuffDef(res.anomaly)?.name || res.anomaly;
                    this.logs.push({
                        time: Number(time.toFixed(2)),
                        type: 'REACTION_DAMAGE',
                        source: char.name,
                        value: burstDmg,
                        detail: `反应爆发 (${anomalyName})`
                    });
                }
            }
        }
    }

    /**
     * 收集当前激活的增益减益修正
     */
    collectActiveModifiers(sourceCharId, targetId) {
        const activeModifiers = [];
        const enemyBuffs = this.buffManager.getBuffsOnTarget(targetId);

        enemyBuffs.forEach(b => {
            const bDef = getBuffDef(b.baseId);
            if (bDef && bDef.effect) {
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
        });

        return activeModifiers;
    }

    /**
     * 解析目标ID
     */
    resolveTargetId(targetType, sourceCharId) {
        switch (targetType) {
            case 'self':
                return sourceCharId;
            case 'enemy':
            case 'target_enemy':
            default:
                return this.enemy.id || 'enemy_01';
        }
    }

    /**
     * 通用参数值解析函数
     * 
     * 如果参数配置了对应的 xxxKey，则从 JSON 中查找；否则使用配置的固定值
     * 
     * @param {Object} node - action 配置对象
     * @param {string} paramName - 参数名（如 'value', 'stacks', 'duration'）
     * @param {*} defaultValue - 默认值
     * @param {Object} context - 上下文，包含 skillId 和 skillLevel
     * @returns {*} 解析后的参数值
     * 
     * @example
     * // 配置示例：
     * // { "stacks": 2 }                    → 返回固定值 2
     * // { "stacksKey": "buff_stacks" }     → 从 JSON 查找 buff_stacks
     * // { "stacks": 2, "stacksKey": "x" }  → 优先使用 xxxKey 查找
     */
    resolveValue(node, paramName, defaultValue, context) {
        const keyName = `${paramName}Key`;
        
        // 如果配置了 xxxKey，则从 JSON 中查找
        if (node[keyName] && context.skillId) {
            const value = getSkillValue(
                context.skillId, 
                node[keyName], 
                context.skillLevel || 1,
                node.index || null
            );
            // 如果查找到有效值，返回它；否则回退到固定值或默认值
            if (value !== 0 || node[paramName] === undefined) {
                return value;
            }
        }
        
        // 使用配置的固定值或默认值
        return node[paramName] !== undefined ? node[paramName] : defaultValue;
    }

    /**
     * 获取角色终结技能量上限
     */
    getMaxUsp(charId) {
        const char = this.characters.find(c => c.id === charId);
        if (!char?.skills?.ultimate) return 100;
        const ultSkill = SKILLS[char.skills.ultimate];
        return ultSkill?.uspCost || 100;
    }

    /**
     * 记录历史行为
     */
    recordActionHistory(record) {
        this.actionHistory.push(record);
    }

    addAction(action) {
        this.timelineActions.push(action);
    }

    simulateResourceStateAt(time) {
        let tempAtb = 200;
        let tempUsp = {};
        this.characters.forEach(c => tempUsp[c.id] = 0);
        let tempCooldowns = {};

        const sorted = [...this.timelineActions].sort((a, b) => a.startTime - b.startTime);
        let lastTime = 0;

        for (const action of sorted) {
            if (action.startTime > time) break;
            const dt = action.startTime - lastTime;
            tempAtb = Math.min(300, tempAtb + dt * 8);
            lastTime = action.startTime;

            const skill = SKILLS[action.skillId];
            if (!skill) continue;

            if (skill.atbCost) tempAtb -= skill.atbCost;
            if (skill.type === 'ULTIMATE') tempUsp[action.charId] = 0;

            const readyAt = action.startTime + (skill.cooldown || 0);
            if (tempCooldowns[action.skillId] === undefined || readyAt > tempCooldowns[action.skillId]) {
                tempCooldowns[action.skillId] = readyAt;
            }
        }

        const finalDt = Math.max(0, time - lastTime);
        tempAtb = Math.min(300, tempAtb + finalDt * 8);

        return { atb: tempAtb, usp: tempUsp, cooldowns: tempCooldowns };
    }
}
