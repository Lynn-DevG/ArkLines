import { DamageCalculator } from './DamageCalculator.js';
import { BuffManager } from './BuffManager.js';
import { ComboManager } from './ComboManager.js';
import { SKILLS } from '../data/skills.js';
import { BUFFS } from '../data/buffs.js';

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

        this.atb = 200;
        this.characters.forEach(c => this.usp[c.id] = 0);

        let totalDamage = 0;

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
                            this.logs.push({ time: Number(t.toFixed(2)), type: 'DOT', source: ev.buff.baseId, value: dmg, detail: `${ev.buff.baseId} tick dealt ${dmg}` });
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
                    if (skillDef.atbCost) this.atb -= skillDef.atbCost;
                    if (skillDef.type === 'ULTIMATE') this.usp[action.charId] = 0;

                    // Prediction
                    let comboStep = 1;
                    let isHeavy = false;
                    let finalSkillDef = { ...skillDef };

                    if (skillDef.type === 'BASIC') {
                        const pred = this.comboManager.predictNext(action.charId, t, true);
                        comboStep = pred.step;
                        isHeavy = pred.isHeavy;
                    }

                    // Variant Resolution
                    if (skillDef.variants && Array.isArray(skillDef.variants)) {
                        for (const variant of skillDef.variants) {
                            if (!variant.condition) continue;
                            let match = false;
                            const cond = variant.condition;
                            if (cond.type === 'combo') {
                                if (cond.value === 'heavy' && isHeavy) match = true;
                                else if (comboStep === cond.value && !isHeavy) match = true;
                            } else if (cond.type === 'buff_stacks') {
                                const stackCount = this.buffManager.getBuffStackCount(action.charId, cond.buffId);
                                if (stackCount >= (cond.min || 1)) match = true;
                            }
                            if (match) {
                                const { condition, ...overrides } = variant;
                                finalSkillDef = { ...finalSkillDef, ...overrides };
                                break;
                            }
                        }
                    }

                    // Prepare Events (Damage Ticks + Anomalies)
                    const skillEvents = [];
                    if (finalSkillDef.damage_ticks) {
                        finalSkillDef.damage_ticks.forEach((tick, idx) => {
                            skillEvents.push({ ...tick, type: 'damage', index: idx + 1 });
                        });
                    }
                    if (finalSkillDef.anomalies) {
                        finalSkillDef.anomalies.forEach(list => {
                            list.forEach(ano => {
                                skillEvents.push({ ...ano }); // already has type
                            });
                        });
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
                    if (skillDef.uspGain) {
                        this.usp[state.charId] = Math.min(skillDef.uspCost || 240, (this.usp[state.charId] || 0) + skillDef.uspGain);
                    }
                    delete activeSkills[actionId];
                }
            });
        }

        // Calculate Total Damage
        totalDamage = this.logs.reduce((acc, log) => {
            if (['DAMAGE', 'DOT', 'REACTION_DAMAGE'].includes(log.type)) {
                return acc + (log.value || 0);
            }
            return acc;
        }, 0);

        return { logs: this.logs, totalDamage };
    }

    executeNode(time, charId, node, actionState = {}) {
        const char = this.characters.find(c => c.id === charId);
        if (!char) return;

        if (node.type === 'damage') {
            if (node.element === 'Physical' || (node.element && node.element.toLowerCase() === 'physical')) {
                this.buffManager.handlePhysicalHit(this.enemy.id || 'enemy_01', char.id);
            }

            const activeModifiers = [];
            const charBuffs = this.buffManager.getBuffsOnTarget(char.id);
            const enemyBuffs = this.buffManager.getBuffsOnTarget(this.enemy.id || 'enemy_01');

            enemyBuffs.forEach(b => {
                const bDef = BUFFS[b.baseId];
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
                        const timeFactor = b.timeActive || 0;
                        const val = b.stacks * (3.6 + 0.84 * timeFactor);
                        activeModifiers.push({ type: 'res_shred', value: val });
                    }
                    if (bDef.effect === 'vulnerability_stun') {
                        activeModifiers.push({ type: 'vulnerability', value: bDef.value || 0.3, condition: { type: 'stun' } });
                    }
                }
            });

            const context = {
                activeModifiers,
                sourceChar: char,
                skillId: actionState.def.id,
                skillLevel: char.skillLevel || 1,
                isPoiseBroken: (this.enemy.stats.currentPoise || 0) <= 0
            };

            // For BASIC skills, use the combo step as the primary index for scaling
            const lookupNode = { ...node };
            if (actionState.def.type === 'BASIC' && actionState.comboStep) {
                lookupNode.index = actionState.comboStep;
            }

            const dmg = DamageCalculator.calculate(char, this.enemy, lookupNode, context);

            let logSuffix = '';
            if (actionState.isHeavy) logSuffix = ' (Heavy)';
            else if (actionState.comboStep) logSuffix = ` (C${actionState.comboStep})`;

            this.logs.push({
                time: Number(time.toFixed(2)),
                type: 'DAMAGE',
                source: char.name,
                value: dmg,
                detail: `Dealt ${dmg} (${node.element || 'None'})${logSuffix}`
            });

            this.enemy.stats.currentHp = Math.max(0, this.enemy.stats.currentHp - dmg);

            // Resource recovery from hit (ATB/USP)
            if (node.atb) this.atb = Math.min(300, this.atb + node.atb);
            if (node.usp) this.usp[char.id] = Math.min(actionState.def.uspCost || 240, (this.usp[char.id] || 0) + node.usp);
        } else if (node.type === 'status_apply' || node.type === 'poise') {
            // Treat 'poise' as a status_apply of type 'poise'
            const statusType = node.type === 'poise' ? 'poise' : node.status;
            const res = this.buffManager.applyBuff(this.enemy.id || 'enemy_01', statusType, char.id, node.stacks || 1);
            if (res) {
                this.logs.push({
                    time: Number(time.toFixed(2)),
                    type: 'STATUS',
                    detail: `Applied ${statusType} to Enemy`
                });
                if (res.type === 'REACTION') {
                    const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                        sourceChar: char,
                        level: res.level || 1
                    }, this.enemy.stats);

                    if (burstDmg > 0) {
                        this.logs.push({
                            time: Number(time.toFixed(2)),
                            type: 'DAMAGE',
                            source: char.name,
                            value: burstDmg,
                            detail: `Reaction Burst (${res.anomaly})`
                        });
                    }
                }
            }
        }
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
