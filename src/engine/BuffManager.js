/**
 * Buff Manager
 * Handles Buff Application, Stacking, Expiration, and Elemental Reactions
 */
import { BUFFS, REACTIONS } from '../data/buffs.js';

export class BuffManager {
    constructor() {
        this.buffs = []; // { id, baseId, sourceId, targetId, stacks, durationRemaining, ... }
    }

    /**
     * Ticks all buffs by delta time. Returns events (expired, dots, etc).
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
                // Trigger Tick Event
                if (['BURN', 'CORROSION'].includes(b.baseId) || b.type === 'ANOMALY') {
                    events.push({
                        type: 'BUFF_TICK',
                        buff: b,
                        targetId: b.targetId
                    });
                }

                // Corrosion Logic: Stacks increase over time? 
                // Design.md: "Corrosion: -10% Res per sec, stacks up to..." - actually "Each second adds 1 layer"
                if (b.baseId === 'CORROSION') {
                    const max = BUFFS['CORROSION']?.maxLayers || 5;
                    if (b.stacks < max) {
                        b.stacks++;
                        events.push({ type: 'BUFF_STACK_INC', buff: b });
                    }
                }
            }
        });

        // Filter expired
        const expired = this.buffs.filter(b => b.durationRemaining <= 0 && b.durationRemaining !== -1);
        if (expired.length > 0) {
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
     */
    applyBuff(targetId, buffId, sourceId, initialStacks = 1, durationOverride = null) {
        const buffDef = BUFFS[buffId];
        if (!buffDef) {
            console.error(`Buff definition not found: ${buffId}`);
            return;
        }

        // --- Logic: Elemental Attachments & Reactions ---
        if (buffDef.type === 'ATTACHMENT') {
            const reactionResult = this.checkReaction(targetId, buffDef.element);
            if (reactionResult) {
                // 1. Consume existing attachment
                this.removeBuff(targetId, reactionResult.consumedBuff.instanceId);

                // 2. Determine Anomaly Level (Based on consumed stacks)
                // Design: "施加异常时，前置附着的层数决定了法术异常的异常等级"
                const anomalyLevel = reactionResult.consumedBuff.stacks;

                // 3. Apply Anomaly
                // Note: We deliberately pass 'anomalyLevel' as 'stacks' or a separate property?
                // Buff structure uses 'stacks'. For Anomalies, 'stacks' = Level.
                return this.applyBuff(targetId, reactionResult.anomalyId, sourceId, anomalyLevel);
            }
        }

        // --- Logic: Normal Application ---
        const existing = this.buffs.find(b => b.targetId === targetId && b.baseId === buffId);

        if (existing) {
            // Stack logic
            const max = buffDef.maxLayers || 1;
            // For Anomalies, do we stack levels? 
            // Design: "Conduct... stacks up to..." - Actually Anomalies usually overwrite or refresh?
            // "如果腐蚀过程中施加新的腐蚀...持续时间刷新...继承减抗" -> Complicated.
            // For prototype, let's max stack for non-anomalies, and overwrite/refresh for anomalies.

            if (buffDef.type === 'ANOMALY') {
                // Refresh duration
                existing.durationRemaining = durationOverride || buffDef.duration || -1;
                // Update stacks if new application is stronger?
                if (initialStacks > existing.stacks) existing.stacks = initialStacks;
            } else {
                existing.stacks = Math.min(max, existing.stacks + initialStacks);
                const dur = durationOverride || buffDef.duration || -1;
                if (dur > 0) existing.durationRemaining = dur;
            }

            return { type: 'REFRESH', buffId, stacks: existing.stacks };
        } else {
            // New Buff
            const dur = durationOverride || buffDef.duration || -1;

            // Special Duration Logic for Freeze based on Stacks/Level
            let finalDur = dur;
            if (buffId === 'status_freeze') {
                // Design: 6/7/8/9s based on layers
                finalDur = 5 + initialStacks;
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
                return { type: 'REACTION', anomaly: buffId, level: initialStacks };
            }
            return { type: 'APPLIED', buffId };
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
     */
    triggerPhysicalAnomaly(targetId, anomalyType, sourceId) {
        const breakBuff = this.buffs.find(b => b.targetId === targetId && b.baseId === 'status_break');
        if (!breakBuff) {
            // Apply Break 1 layer
            this.applyBuff(targetId, 'status_break', sourceId, 1);
            return { type: 'APPLIED_BREAK' };
        }

        const layers = breakBuff.stacks;
        let result = null;

        // 1. Slam (猛击)
        if (anomalyType === 'SLAM') {
            // Consume all
            this.removeBuff(targetId, breakBuff.instanceId);
            result = { type: 'SLAM', consumedLayers: layers };
        }
        // 2. Sunder (碎甲)
        else if (anomalyType === 'SUNDER') {
            // Consume all -> Apply Status Sunder
            this.removeBuff(targetId, breakBuff.instanceId);
            this.applyBuff(targetId, 'status_sunder', sourceId, layers); // Pass layers to determine effect value
            result = { type: 'SUNDER', consumedLayers: layers };
        }
        // 3. Launch (击飞/倒地)
        else if (anomalyType === 'LAUNCH') {
            // Stack +1 Break
            this.applyBuff(targetId, 'status_break', sourceId, 1);
            // Return event for extra damage calc
            result = { type: 'LAUNCH' };
        }

        return result;
    }

    removeBuff(targetId, instanceId) {
        this.buffs = this.buffs.filter(b => !(b.targetId === targetId && b.instanceId === instanceId));
    }

    /**
     * Checks if applying 'newElement' causes a reaction on 'targetId'
     */
    checkReaction(targetId, newElement) {
        // Find existing attachment on target
        const attachment = this.buffs.find(b => b.targetId === targetId && b.type === 'ATTACHMENT');

        if (!attachment) return null;

        // If same element -> No reaction (just stacking, handled by applyBuff)
        if (attachment.element === newElement) return null;

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
