import { DamageCalculator } from './DamageCalculator.js';
import { BuffManager } from './BuffManager.js';
import { ComboManager } from './ComboManager.js';
import { ConditionEvaluator } from './ConditionEvaluator.js';
import { ActionExecutor } from './ActionExecutor.js';
import { ConstraintValidator } from './ConstraintValidator.js';
import { SKILLS } from '../data/skills.js';
import { getBuffDef } from '../data/buffs.js';

export class TimelineSimulator {
    constructor(characters, enemyConfig) {
        this.characters = characters; // Array of char objects
        // 初始化敌人配置，确保关键属性有默认值
        const defaultMaxPoise = enemyConfig.stats?.maxPoise || 100;
        this.enemy = { 
            ...enemyConfig, 
            stats: { 
                ...enemyConfig.stats, 
                currentHp: enemyConfig.stats?.baseHp || 10000000,
                maxPoise: defaultMaxPoise,
                // currentPoise 表示累积的失衡值，初始为 0 表示尚未累积
                // 当 currentPoise >= maxPoise 时触发失衡，然后重置为 0
                // 注意：初始时不应判定为失衡，所以需要特殊处理
                currentPoise: enemyConfig.stats?.currentPoise ?? 0
            } 
        };

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
     * 设置调试模式
     * @param {boolean} enabled - 是否启用调试模式
     */
    setDebugMode(enabled) {
        this.debugMode = enabled;
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
     * 使用 getter/setter 让 ActionExecutor 能够直接修改 TimelineSimulator 的状态
     */
    createActionExecutor() {
        const self = this;
        return new ActionExecutor({
            buffManager: this.buffManager,
            comboManager: this.comboManager,
            characters: this.characters,
            enemy: this.enemy,
            // 使用 getter/setter 代理资源状态
            resources: {
                get atb() { return self.atb; },
                set atb(v) { self.atb = v; },
                get usp() { return self.usp; },
                set usp(v) { self.usp = v; }
            },
            actionHistory: this.actionHistory,
            mainCharId: this.mainCharId,
            critMode: this.critMode,
            debugMode: this.debugMode,
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

            // 4. 检查技能释放条件 (如连携技的触发条件)
            if (valid && skill.condition) {
                const conditionResult = ConstraintValidator.checkSkillCondition(skill, action, sorted);
                if (!conditionResult.valid) {
                    valid = false;
                }
            }

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

        // 记录技力（ATB）变化历史
        // 结构: [{ time, atb, reason }]
        const atbTimeline = [{ time: 0, atb: 200, reason: 'initial' }];
        
        // 辅助函数：记录技力变化
        const recordAtbChange = (time, reason) => {
            const lastEntry = atbTimeline[atbTimeline.length - 1];
            // 避免在同一时间点重复记录相同值
            if (lastEntry && Math.abs(lastEntry.time - time) < 0.01 && lastEntry.atb === this.atb) {
                return;
            }
            atbTimeline.push({ time: Number(time.toFixed(2)), atb: this.atb, reason });
        };

        // Filter valid actions only for execution
        const validActions = this.timelineActions.filter(a => !invalidActionIds.has(a.id));
        const sortedActions = [...validActions].sort((a, b) => a.startTime - b.startTime);

        const activeSkills = {};

        for (let t = 0; t <= duration; t += TICK) {
            // 0. Resource Recovery
            const oldAtb = this.atb;
            this.atb = Math.min(300, this.atb + 0.8); // 8 units per second
            // 记录 ATB 变化：每秒记录一次，或者当 ATB 达到/离开阈值（100, 200, 300）时记录
            const roundedTime = Math.round(t * 10) / 10; // 避免浮点精度问题
            const isWholeSecond = Math.abs(roundedTime % 1) < 0.01;
            const crossedThreshold = 
                Math.floor(oldAtb / 100) !== Math.floor(this.atb / 100) || // 跨越了 100 的整数倍
                (oldAtb < 300 && this.atb >= 300); // 刚达到满值
            
            if ((isWholeSecond || crossedThreshold) && this.atb !== oldAtb) {
                recordAtbChange(t, 'recovery');
            }

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
                        recordAtbChange(t, `skill_cost_${action.skillId}`);
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

                    // Variant Resolution - 统一使用 ConditionEvaluator
                    if (skillDef.variants && Array.isArray(skillDef.variants)) {
                        const condEvaluator = this.createConditionEvaluator(action.charId, t);
                        // 注入连击状态以便条件评估
                        condEvaluator.context.comboState = { step: comboStep, isHeavy };
                        
                        for (const variant of skillDef.variants) {
                            if (!variant.condition) continue;
                            
                            // 使用 ConditionEvaluator 统一评估所有条件类型（包括 combo）
                            if (condEvaluator.evaluate(variant.condition)) {
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
        
        // 添加技力时间轴结束点
        atbTimeline.push({ time: duration, atb: this.atb, reason: 'end' });

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
            atbTimeline,
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

        // 委托给 ActionExecutor 执行
        const executor = this.createActionExecutor();
        const actionContext = {
            sourceCharId: charId,
            currentTime: time,
            skillDef: actionState.def,
            skillLevel: char.skillLevel || 1,
            comboStep: actionState.comboStep,
            isHeavy: actionState.isHeavy
        };

        // 处理新的行为类型
        switch (node.type) {
            case 'damage':
            case 'add_stagger':
            case 'recover_usp_self':
            case 'recover_usp_team':
            case 'recover_atb':
            case 'add_buff':
            case 'consume_buff':
            case 'status_apply':
            case 'poise':
                executor.execute(node, actionContext);
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
     * 执行旧格式异常节点（兼容 anomalies 数组中的类型）
     * 注：此方法保留是因为 ActionExecutor 没有对应实现
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
