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
        this.sp = 200; // Shared SP
        this.ultEnergy = {}; // Per character
        characters.forEach(c => this.ultEnergy[c.id] = 0);
    }

    /**
     * Main Simulation Loop
     * Runs from t=0 to duration, processing events tick-by-tick (e.g. 0.1s)
     */
    /**
     * Validates all placed actions based on resource constraints.
     * Returns a Set of invalid action IDs.
     */
    validateActions(actionsToValidate) {
        const invalidIds = new Set();
        let tempSp = 200; // Start SP
        let tempUlt = {};
        this.characters.forEach(c => tempUlt[c.id] = 0);
        let tempCooldowns = {};

        const sorted = [...actionsToValidate].sort((a, b) => a.startTime - b.startTime);
        let lastTime = 0;

        sorted.forEach(action => {
            // Natural Recovery
            const dt = Math.max(0, action.startTime - lastTime);
            tempSp = Math.min(300, tempSp + dt * 8);
            lastTime = action.startTime;

            const skill = SKILLS[action.skillId];
            if (!skill) return;

            let valid = true;

            // 1. Duration Overlap (Logic handled by Magnetism/UI, but if overlapped passed in?)
            // We assume non-overlapping for resources, or just process in order.

            // 2. SP
            if (skill.spCost > 0 && tempSp < skill.spCost) valid = false;

            // 3. Ult
            if (skill.type === 'ULTIMATE') {
                const energy = tempUlt[action.charId] || 0;
                if (energy < (skill.energyCost || 100)) valid = false;
            }

            // 4. Cooldown
            const readyAt = tempCooldowns[action.skillId] || 0;
            if (readyAt > action.startTime + 0.01) valid = false; // tolerance

            if (!valid) {
                invalidIds.add(action.id);
            } else {
                // Apply Consumption
                if (skill.spCost) tempSp -= skill.spCost;
                if (skill.type === 'ULTIMATE') tempUlt[action.charId] = 0;

                // Set Cooldown
                tempCooldowns[action.skillId] = action.startTime + (skill.cooldown || 0);
            }
        });

        return invalidIds;
    }

    /**
     * Main Simulation Loop
     * Runs from t=0 to duration, processing events tick-by-tick (e.g. 0.1s)
     */
    run(duration, invalidActionIds = new Set()) {
        const TICK = 0.1;
        this.logs = [];
        this.buffManager = new BuffManager(); // Reset
        this.comboManager = new ComboManager(); // Reset Combo State

        this.sp = 200;
        this.characters.forEach(c => this.ultEnergy[c.id] = 0);

        let totalDamage = 0;

        // Filter valid actions only for execution
        const validActions = this.timelineActions.filter(a => !invalidActionIds.has(a.id));
        const sortedActions = [...validActions].sort((a, b) => a.startTime - b.startTime);

        const activeSkills = {};

        for (let t = 0; t <= duration; t += TICK) {
            // 0. Resource Recovery
            this.sp = Math.min(300, this.sp + 0.8);

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

                    // Deduct (Already validated, but deduct for runtime tracking)
                    if (skillDef.spCost) this.sp -= skillDef.spCost;
                    if (skillDef.type === 'ULTIMATE') this.ultEnergy[action.charId] = 0;

                    // Predict Next Combo Step & Update Manager
                    let comboStep = 1;
                    let isHeavy = false;

                    // Clone definition to avoid mutating base data object
                    let finalSkillDef = { ...skillDef };

                    if (skillDef.type === 'BASIC') {
                        const pred = this.comboManager.predictNext(action.charId, t, true);
                        comboStep = pred.step;
                        isHeavy = pred.isHeavy;
                    }

                    // Variant Resolution (Generic)
                    if (skillDef.variants && Array.isArray(skillDef.variants)) {
                        for (const variant of skillDef.variants) {
                            if (!variant.condition) continue;

                            let match = false;
                            const cond = variant.condition;

                            // 1. Combo Condition
                            if (cond.type === 'combo') {
                                if (cond.value === 'heavy') {
                                    if (isHeavy) match = true;
                                } else {
                                    if (comboStep === cond.value && !isHeavy) match = true;
                                }
                            }

                            // 2. Buff Stack Condition
                            else if (cond.type === 'buff_stacks') {
                                // Check BuffManager for active stacks on self
                                const stackCount = this.buffManager.getBuffStackCount(action.charId, cond.buffId);
                                if (stackCount >= (cond.min || 1)) match = true;
                            }

                            if (match) {
                                // Merge variant props (excluding condition)
                                const { condition, ...overrides } = variant;
                                finalSkillDef = { ...finalSkillDef, ...overrides };
                                break; // Stop after first match
                            }
                        }
                    }

                    activeSkills[action.id] = { nextNodeIndex: 0, def: finalSkillDef, charId: action.charId, comboStep, isHeavy };
                }
            });

            // 3. Process Active Skills
            Object.keys(activeSkills).forEach(actionId => {
                const state = activeSkills[actionId];
                const skillDef = state.def;
                const actionObj = validActions.find(a => a.id == actionId);
                const relativeTime = t - actionObj.startTime;

                if (state.nextNodeIndex < skillDef.nodes.length) {
                    const node = skillDef.nodes[state.nextNodeIndex];
                    if (relativeTime >= node.time) {
                        this.executeNode(t, state.charId, node, state);
                        state.nextNodeIndex++;
                    }
                }

                if (relativeTime >= skillDef.duration && state.nextNodeIndex >= skillDef.nodes.length) {
                    delete activeSkills[actionId];
                }
            });
        }

        // Calculate Total Damage from Logs
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

        // Type: DAMAGE
        if (node.type === 'damage') {
            // 1. Handle Physical Break Logic
            // If element is Physical, we assume it contributes to Break? 
            // Design: "破防通常由物理伤害...添加"
            if (node.element === 'Physical') {
                this.buffManager.handlePhysicalHit(this.enemy.id || 'enemy_01', char.id);
            }

            // 2. Collect Context (Buffs -> Modifiers)
            const activeModifiers = [];

            // sourceChar Buffs
            const charBuffs = this.buffManager.getBuffsOnTarget(char.id);
            charBuffs.forEach(b => {
                const bDef = BUFFS[b.baseId];
                if (bDef && bDef.statMod) {
                    // e.g. atk: 0.2
                    Object.entries(bDef.statMod).forEach(([stat, val]) => {
                        // We handle stat mods in calculateAttack, but let's pass as modifier too if generic
                        // Actually DamageCalculator handles 'dmg_bonus' etc.
                    });
                }
                // Check named/generic buffs
                if (b.baseId === 'buff_atk_up') {
                    // Note: stat modifications usually done on char stats directly or via helper.
                    // For prototype, we passed 'context'.
                }
            });

            // enemy Buffs
            const enemyBuffs = this.buffManager.getBuffsOnTarget(this.enemy.id || 'enemy_01');
            enemyBuffs.forEach(b => {
                const bDef = BUFFS[b.baseId];

                // Anomaly Effects (Corrosion, Conduct, Sunder)
                if (bDef && bDef.effect) {
                    // Conduct
                    if (bDef.effect === 'vulnerability_magic') {
                        // Conduct values: [0.12, 0.16...]
                        const val = (bDef.values && bDef.values[b.stacks - 1]) || 0.12;
                        activeModifiers.push({ type: 'vulnerability', value: val, condition: { type: 'magic' } });
                    }
                    // Sunder
                    if (bDef.effect === 'vulnerability_phys') {
                        const val = (bDef.values && bDef.values[b.stacks - 1]) || 0.11;
                        activeModifiers.push({ type: 'vulnerability', value: val, condition: { type: 'physical' } });
                    }
                    // Corrosion
                    if (bDef.effect === 'res_shred') {
                        // Formula: Init + Growth * Time. 
                        // Simplification for prototype: Base + 0.5 * Time
                        // Real formula: see Design.
                        // Let's approximate: stacks * (3 + timeActive * 0.8)
                        const timeFactor = b.timeActive || 0;
                        const val = b.stacks * (3.6 + 0.84 * timeFactor); // Rough avg
                        activeModifiers.push({ type: 'res_shred', value: val });
                    }

                    // Stun
                    if (bDef.effect === 'vulnerability_stun') {
                        activeModifiers.push({ type: 'vulnerability', value: bDef.value || 0.3, condition: { type: 'stun' } });
                    }
                }
            });

            // Note: Combo scaling is now handled via Skill Variant definitions (modified nodes in activeSkills)
            // The node passed here comes from the resolved variant.

            const context = {
                activeModifiers,
                sourceChar: char
            };

            const dmg = DamageCalculator.calculate(char, this.enemy, node, context);

            let logSuffix = '';
            if (actionState.isHeavy) logSuffix = ' (Heavy)';
            else if (actionState.comboStep) logSuffix = ` (C${actionState.comboStep})`;

            this.logs.push({
                time: Number(time.toFixed(2)),
                type: 'DAMAGE',
                source: char.name,
                value: dmg,
                detail: `Dealt ${dmg} (${node.element})${logSuffix}`
            });
            // totalDamage not available in this scope. 
            // We calculate total at the end of run() from logs.
            this.enemy.stats.currentHp = Math.max(0, this.enemy.stats.currentHp - dmg);
        }

        // Type: BUFF ADD
        else if (node.type === 'buff_add') {
            // ...
        }

        // Type: STATUS APPLY (On Enemy)
        else if (node.type === 'status_apply') {
            // Combo might affect status application rate? Assuming no for now.
            const res = this.buffManager.applyBuff('enemy_01', node.status, char.id, node.layers || 1);
            if (res) {
                this.logs.push({
                    time: Number(time.toFixed(2)),
                    type: 'STATUS',
                    detail: `Applied ${node.status} to Enemy`
                });
                if (res.type === 'REACTION') {
                    // Calculate Immediate Reaction Damage (Burst/Anomaly Initial Hit)
                    // Design: "Conduct/Corrosion/Burn Base = 80% + 80% * Lv"
                    // Pass 'BURST' or the specific anomaly ID to calculator?
                    // Calculator handles 'BURST' case or defaults.

                    const burstDmg = DamageCalculator.calculateReactionDamage('BURST', {
                        sourceChar: char,
                        level: res.level || 1
                    }, this.enemy.stats);

                    if (burstDmg > 0) {
                        this.logs.push({
                            time: Number(time.toFixed(2)),
                            type: 'DAMAGE', // Cleanest to just use DAMAGE type for UI? Or REACTION_DAMAGE?
                            // If we use DAMAGE, it shows up in list automatically if formatted right.
                            // But usually we want distinct visual. Let's use 'REACTION_DAMAGE'.
                            source: char.name, // Or 'Reaction'
                            value: burstDmg,
                            detail: `Reaction Burst (${res.anomaly})`
                        });
                        // Add to total loop later
                    }

                    this.logs.push({
                        time: Number(time.toFixed(2)),
                        type: 'REACTION',
                        detail: `Triggered ${res.anomaly} (Lv${res.level || 1})`
                    });
                }
            }
        }
    }

    addAction(action) {
        // action: { id, charId, skillId, startTime }
        this.timelineActions.push(action);
    }

    /**
     * Fast-forwards simulation to 'time' to determine available resources.
     * Returns { sp, ultEnergy: { [charId]: val }, cooldowns: { [skillId]: readyTime } }
     */
    simulateResourceStateAt(time) {
        let tempSp = 200;
        let tempUlt = {};
        this.characters.forEach(c => tempUlt[c.id] = 0);
        let tempCooldowns = {};

        const sorted = [...this.timelineActions].sort((a, b) => a.startTime - b.startTime);
        let lastTime = 0;

        for (const action of sorted) {
            if (action.startTime > time) break;

            // Natural recovery up to this action
            const dt = action.startTime - lastTime;
            tempSp = Math.min(300, tempSp + dt * 8);
            lastTime = action.startTime;

            const skill = SKILLS[action.skillId];
            if (!skill) continue;

            // Apply consumption
            if (skill.spCost) tempSp -= skill.spCost;
            if (skill.type === 'ULTIMATE') tempUlt[action.charId] = 0;

            // Set Cooldown
            const readyAt = action.startTime + (skill.cooldown || 0);
            if (tempCooldowns[action.skillId] === undefined || readyAt > tempCooldowns[action.skillId]) {
                tempCooldowns[action.skillId] = readyAt;
            }
        }

        // Final natural recovery from last action to 'time'
        const finalDt = Math.max(0, time - lastTime);
        tempSp = Math.min(300, tempSp + finalDt * 8);

        return { sp: tempSp, ultEnergy: tempUlt, cooldowns: tempCooldowns };
    }
}
