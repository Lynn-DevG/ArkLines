/**
 * Buff Manager
 * Handles Buff Application, Stacking, Expiration, and Elemental Reactions
 */
import { BUFFS, REACTIONS, resolveBuffId, getBuffDef } from '../data/buffs.js';

export class BuffManager {
    constructor() {
        this.buffs = []; // { id, baseId, sourceId, targetId, stacks, durationRemaining, ... }
    }

    /**
     * Ticks all buffs by delta time. Returns events (expired, dots, etc).
     * 过期事件包含详细的 buff 信息用于记录 BUFF_EXPIRED 历史
     */
    tick(deltaTime) {
        const events = [];

        this.buffs.forEach(b => {
            // Infinite buffs have duration -1 or similar
            if (b.durationRemaining > 0) {
                b.durationRemaining -= deltaTime;
            }

            // Handle DoT / Periodic Effects
            // We need to track 'timeSinceLastTick' for each buff
            if (!b.timeSinceLastTick) b.timeSinceLastTick = 0;
            b.timeSinceLastTick += deltaTime;

            if (b.timeSinceLastTick >= 1.0) { // Standard 1s tick
                b.timeSinceLastTick -= 1.0;
                
                // Trigger Tick Event for DoT anomalies
                // 根据 design.md，只有燃烧(status_burn)有持续伤害效果
                // 导电(status_conduct)、冻结(status_freeze)、腐蚀(status_corrosion)没有 DoT
                if (b.baseId === 'status_burn') {
                    events.push({
                        type: 'BUFF_TICK',
                        buff: b,
                        targetId: b.targetId
                    });
                }

                // Corrosion Logic: Track time for res_shred scaling
                // Design.md: 减抗随时间增长，10秒达到上限
                if (b.baseId === 'status_corrosion') {
                    // 更新 timeActive 用于减抗计算
                    if (!b.timeActive) b.timeActive = 0;
                    b.timeActive = Math.min(10, b.timeActive + 1); // 10秒达到上限
                }
            }
        });

        // Filter expired - 为每个过期的 buff 生成独立事件
        const expired = this.buffs.filter(b => b.durationRemaining <= 0 && b.durationRemaining !== -1);
        if (expired.length > 0) {
            // 为每个过期 buff 生成 BUFF_EXPIRED 事件
            expired.forEach(b => {
                events.push({
                    type: 'BUFF_EXPIRED',
                    buffId: b.baseId,
                    targetId: b.targetId,
                    sourceId: b.sourceId,
                    stacks: b.stacks  // 过期时的层数
                });
            });
            // 保持旧格式兼容
            events.push({ type: 'EXPIRED', buffs: expired });
        }

        this.buffs = this.buffs.filter(b => b.durationRemaining > 0 || b.durationRemaining === -1);

        return events;
    }

    /**
     * Applies a buff/status to a target.
     * Handles Logic: 
     *  - Stacking (Add stack, refresh duration)
     *  - Elemental Interaction (Trigger Anomaly, Clear Attachment)
     * 
     * 返回结果包含：
     * - type: 'APPLIED' | 'REFRESH' | 'REACTION'
     * - wasNew: boolean - 是否为新添加（之前没有该buff）
     * - prevStacks: number - 施加前的层数（0表示新添加）
     * - newStacks: number - 施加后的层数
     * - consumedBuff: Object - 反应消耗的附着信息（仅反应时）
     */
    applyBuff(targetId, buffId, sourceId, initialStacks = 1, durationOverride = null) {
        // 解析别名，获取标准化的 buff ID
        const resolvedBuffId = resolveBuffId(buffId);
        const buffDef = BUFFS[resolvedBuffId];
        if (!buffDef) {
            console.warn(`未找到Buff定义: ${buffId} (解析后: ${resolvedBuffId})`);
            return;
        }
        // 使用解析后的 ID
        buffId = resolvedBuffId;

        // --- Logic: Elemental Attachments & Reactions ---
        let burstInfo = null;
        if (buffDef.type === 'ATTACHMENT') {
            const reactionResult = this.checkReaction(targetId, buffDef.element);
            if (reactionResult) {
                // 记录被消耗的附着信息
                const consumedBuff = {
                    buffId: reactionResult.consumedBuff.baseId,
                    stacks: reactionResult.consumedBuff.stacks,
                    targetId,
                    sourceId,
                    remainingStacks: 0  // 反应消耗后剩余为0
                };
                
                // 1. Consume existing attachment
                this.removeBuff(targetId, reactionResult.consumedBuff.instanceId);

                // 2. Determine Anomaly Level (Based on consumed stacks)
                // Design: "施加异常时，前置附着的层数决定了法术异常的异常等级"
                const anomalyLevel = reactionResult.consumedBuff.stacks;

                // 3. Apply Anomaly
                const anomalyResult = this.applyBuff(targetId, reactionResult.anomalyId, sourceId, anomalyLevel);
                
                // 返回结果中包含被消耗的附着信息
                return {
                    ...anomalyResult,
                    consumedBuff  // 用于记录消耗历史
                };
            }

            const sameAttachment = this.buffs.find(b => b.targetId === targetId && b.baseId === buffId);
            if (sameAttachment) {
                const max = buffDef.maxLayers || 1;
                burstInfo = {
                    element: buffDef.element,
                    level: Math.min(max, (sameAttachment.stacks || 0) + initialStacks)
                };
            }
        }

        // --- Logic: Normal Application ---
        const existing = this.buffs.find(b => b.targetId === targetId && b.baseId === buffId);

        if (existing) {
            // 记录施加前的层数
            const prevStacks = existing.stacks;
            
            // Stack logic
            const max = buffDef.maxLayers || 1;
            // For Anomalies, do we stack levels? 
            // Design: "Conduct... stacks up to..." - Actually Anomalies usually overwrite or refresh?
            // "如果腐蚀过程中施加新的腐蚀...持续时间刷新...继承减抗" -> Complicated.
            // For prototype, let's max stack for non-anomalies, and overwrite/refresh for anomalies.

            if (buffDef.type === 'ANOMALY' || buffDef.type === 'PHYSICAL_ANOMALY') {
                // Refresh duration for anomalies
                let newDur = durationOverride || buffDef.duration || -1;
                // Handle durations array
                if (buffDef.durations && Array.isArray(buffDef.durations)) {
                    const layerIndex = Math.min(Math.max(0, initialStacks - 1), buffDef.durations.length - 1);
                    newDur = buffDef.durations[layerIndex];
                }
                existing.durationRemaining = newDur;
                // Update stacks if new application is stronger?
                if (initialStacks > existing.stacks) existing.stacks = initialStacks;
            } else {
                existing.stacks = Math.min(max, existing.stacks + initialStacks);
                const dur = durationOverride || buffDef.duration || -1;
                if (dur > 0) existing.durationRemaining = dur;
            }

            const result = { 
                type: 'REFRESH', 
                buffId, 
                stacks: existing.stacks,
                wasNew: false,
                prevStacks,
                newStacks: existing.stacks
            };
            if (burstInfo) {
                result.burst = burstInfo;
            }
            return result;
        } else {
            // New Buff
            let dur = durationOverride || buffDef.duration || -1;

            // Special Duration Logic for Freeze based on Stacks/Level
            let finalDur = dur;
            if (buffId === 'status_freeze' && buffDef.durations) {
                // Design: 6/7/8/9s based on layers (index 0-3 for layers 1-4)
                const layerIndex = Math.min(Math.max(0, initialStacks - 1), buffDef.durations.length - 1);
                finalDur = buffDef.durations[layerIndex];
            } else if (buffDef.durations && Array.isArray(buffDef.durations)) {
                // Generic duration lookup by stacks for other buffs with durations array
                const layerIndex = Math.min(Math.max(0, initialStacks - 1), buffDef.durations.length - 1);
                finalDur = buffDef.durations[layerIndex];
            }

            const newBuff = {
                instanceId: Date.now() + Math.random(),
                baseId: buffId,
                element: buffDef.element,
                type: buffDef.type,
                targetId,
                sourceId,
                stacks: initialStacks,
                durationRemaining: finalDur,
                durationMax: finalDur,
                // Track time alive for scaling effects like Corrosion
                timeActive: 0
            };
            this.buffs.push(newBuff);

            // Return 'reaction' event type if this WAS an anomaly application (from recursive call)
            if (buffDef.type === 'ANOMALY') {
                return { 
                    type: 'REACTION', 
                    anomaly: buffId, 
                    level: initialStacks,
                    wasNew: true,
                    prevStacks: 0,
                    newStacks: initialStacks
                };
            }
            return { 
                type: 'APPLIED', 
                buffId,
                wasNew: true,
                prevStacks: 0,
                newStacks: initialStacks
            };
        }
    }

    /**
     * Handles a Physical Hit on a target.
     * Logic: Triggers Break stacking or Physical Anomalies correctly.
     */
    handlePhysicalHit(targetId, sourceId, isPhysicalAnomalyTrigger = false) {
        // Find Break Status
        const breakBuff = this.buffs.find(b => b.targetId === targetId && b.baseId === 'status_break');

        if (!breakBuff) {
            // No Break? Apply Break Layer 1
            this.applyBuff(targetId, 'status_break', sourceId, 1);
            return { type: 'BREAK_APPLY', layers: 1 };
        }

        // Has Break (Any layers)
        // Design: "每种物理异常...如果已有破防，则会先造成一次额外伤害...再产生效果"
        // Wait, Physical Hit applies Break. Physical Anomaly consumes/interacts with it.
        // If this is just a normal Physical Hit (e.g. Basic Attack Physical):
        // Does it interact? "破防通常由物理伤害...添加"

        // Let's assume Normal Physical Damage -> Adds Break Stack?
        // Design: "物理异常有四种...在目标没有破防时都会施加一层破防"
        // Implicitly: Normal phys damage might NOT add break unless specified?
        // Or "物理伤害...添加". Let's assume all Physical Damage adds 1 Break layer?
        // If so, it stacks up to 4.

        // But Physical ANOMALIES (Slam/Sunder) are specific TRIGGER types.
        // We need to know if the incoming hit IS a trigger (Slam/Sunder/Launch).
        // If it's just normal damage, it effectively just stacks Break.

        if (!isPhysicalAnomalyTrigger) {
            this.applyBuff(targetId, 'status_break', sourceId, 1);
            return { type: 'BREAK_STACK' };
        }

        // If it IS a Physical Anomaly Trigger (e.g. Skill is type 'Slam')
        // We handle that in Simulator logic? Or here?
        // Better to expose a method 'triggerPhysicalAnomaly(type)'
        return null;
    }

    /**
     * Triggers a specific Physical Anomaly effect using existing Break stacks.
     * 返回结果包含 consumedBreak 信息用于记录消耗历史
     */
    triggerPhysicalAnomaly(targetId, anomalyType, sourceId) {
        const breakBuff = this.buffs.find(b => b.targetId === targetId && b.baseId === 'status_break');
        if (!breakBuff) {
            // Apply Break 1 layer
            const applyResult = this.applyBuff(targetId, 'status_break', sourceId, 1);
            return { type: 'APPLIED_BREAK', applyResult };
        }

        const layers = breakBuff.stacks;
        let result = null;

        // 1. Slam (猛击)
        if (anomalyType === 'SLAM') {
            // Consume all
            this.removeBuff(targetId, breakBuff.instanceId);
            result = { 
                type: 'SLAM', 
                consumedLayers: layers,
                // 消耗破防的信息，用于记录历史
                consumedBreak: {
                    buffId: 'status_break',
                    targetId,
                    sourceId,
                    prevStacks: layers,
                    consumedStacks: layers,
                    remainingStacks: 0
                }
            };
        }
        // 2. Sunder (碎甲)
        else if (anomalyType === 'SUNDER') {
            // Consume all -> Apply Status Sunder
            this.removeBuff(targetId, breakBuff.instanceId);
            this.applyBuff(targetId, 'status_sunder', sourceId, layers); // Pass layers to determine effect value
            result = { 
                type: 'SUNDER', 
                consumedLayers: layers,
                // 消耗破防的信息，用于记录历史
                consumedBreak: {
                    buffId: 'status_break',
                    targetId,
                    sourceId,
                    prevStacks: layers,
                    consumedStacks: layers,
                    remainingStacks: 0
                }
            };
        }
        // 3. Launch (击飞/倒地)
        else if (anomalyType === 'LAUNCH') {
            // Stack +1 Break
            const applyResult = this.applyBuff(targetId, 'status_break', sourceId, 1);
            // Return event for extra damage calc
            result = { type: 'LAUNCH', applyResult };
        }

        return result;
    }

    removeBuff(targetId, instanceId) {
        this.buffs = this.buffs.filter(b => !(b.targetId === targetId && b.instanceId === instanceId));
    }

    /**
     * 消耗指定数量的buff层数
     * @param {string} targetId - 目标ID
     * @param {string} buffId - buff ID
     * @param {number} stacks - 消耗层数
     * @param {string} consumerId - 消耗者ID（用于记录）
     * @returns {Object|null} 消耗结果，包含 prevStacks/remainingStacks 用于判定"消耗完"
     */
    consumeBuff(targetId, buffId, stacks = 1, consumerId = null) {
        const resolvedBuffId = resolveBuffId(buffId);
        const buff = this.buffs.find(b => b.targetId === targetId && b.baseId === resolvedBuffId);
        
        if (!buff) {
            return null;
        }
        
        const prevStacks = buff.stacks;  // 消耗前的层数
        const consumedStacks = Math.min(stacks, buff.stacks);
        const remainingStacks = buff.stacks - consumedStacks;
        
        if (remainingStacks <= 0) {
            // 完全移除
            this.removeBuff(targetId, buff.instanceId);
        } else {
            // 减少层数
            buff.stacks = remainingStacks;
        }
        
        return {
            type: 'BUFF_CONSUMED',
            buffId: resolvedBuffId,
            prevStacks,        // 消耗前层数
            consumedStacks,    // 本次消耗的层数
            remainingStacks,   // 消耗后剩余层数（0表示消耗完）
            consumerId
        };
    }

    /**
     * 检查目标是否拥有指定buff
     * @param {string} targetId - 目标ID
     * @param {string} buffId - buff ID
     * @returns {boolean}
     */
    hasBuff(targetId, buffId) {
        const resolvedBuffId = resolveBuffId(buffId);
        return this.buffs.some(b => b.targetId === targetId && b.baseId === resolvedBuffId);
    }

    /**
     * 获取指定buff的完整信息
     * @param {string} targetId - 目标ID
     * @param {string} buffId - buff ID
     * @returns {Object|null}
     */
    getBuff(targetId, buffId) {
        const resolvedBuffId = resolveBuffId(buffId);
        return this.buffs.find(b => b.targetId === targetId && b.baseId === resolvedBuffId) || null;
    }

    /**
     * 清除目标上的所有buff
     * @param {string} targetId - 目标ID
     */
    clearAllBuffs(targetId) {
        this.buffs = this.buffs.filter(b => b.targetId !== targetId);
    }

    /**
     * 刷新buff持续时间
     * @param {string} targetId - 目标ID
     * @param {string} buffId - buff ID
     * @param {number} newDuration - 新持续时间
     */
    refreshBuffDuration(targetId, buffId, newDuration) {
        const resolvedBuffId = resolveBuffId(buffId);
        const buff = this.buffs.find(b => b.targetId === targetId && b.baseId === resolvedBuffId);
        
        if (buff && newDuration > 0) {
            buff.durationRemaining = newDuration;
            buff.durationMax = Math.max(buff.durationMax || newDuration, newDuration);
        }
    }

    /**
     * Checks if applying 'newElement' causes a reaction on 'targetId'
     */
    checkReaction(targetId, newElement) {
        // Find existing attachment on target with different element
        const attachment = this.buffs.find(b =>
            b.targetId === targetId &&
            b.type === 'ATTACHMENT' &&
            b.element !== newElement
        );

        if (!attachment) return null;

        // Different element -> Trigger Anomaly of the NEW element type
        // (As per design: Non-Fire + Fire = Burn. The NEW element dictates the anomaly)
        // Actually Design says: "Arbitrary existing + Triggering -> Triggering's Anomaly"
        // e.g. Ice (Existing) + Fire (Trigger) -> Burn

        const anomalyId = REACTIONS[newElement];
        if (anomalyId) {
            return {
                consumedBuff: attachment,
                anomalyId: anomalyId
            };
        }
        return null;
    }

    getBuffsOnTarget(targetId) {
        return this.buffs.filter(b => b.targetId === targetId);
    }

    getBuffStackCount(targetId, buffId) {
        const buff = this.buffs.find(b => b.targetId === targetId && b.baseId === buffId);
        return buff ? buff.stacks : 0;
    }
}
