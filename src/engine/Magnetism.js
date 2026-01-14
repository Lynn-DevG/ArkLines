/**
 * Magnetism Engine
 * Handles snapping skills to valid lots and resolving overlaps.
 */
import { getResolvedDuration } from './VariantResolver.js';

export class Magnetism {

    static getSnapTime(newAction, existingActions, pxPerSec = 60, thresholdPx = 20) {
        // newAction: { startTime, duration, charId, ... }
        // Snap to: 
        // 1. End of other skills on same track (Char)
        // 2. Head of other skills (Shift logic? no, just simple snap for now)
        // 3. Grid (0.1s?)

        const thresholdSec = thresholdPx / pxPerSec;
        const proposedStart = newAction.startTime;

        let bestSnap = proposedStart;
        let minDiff = Infinity;

        // 1. Grid Snap (0.1s)
        const gridSnap = Math.round(proposedStart * 10) / 10;
        if (Math.abs(gridSnap - proposedStart) < thresholdSec) {
            bestSnap = gridSnap;
            minDiff = Math.abs(gridSnap - proposedStart);
        }

        // 2. Action Snap (End of others)
        const trackActions = existingActions.filter(a => a.charId === newAction.charId && a.id !== newAction.id);

        trackActions.forEach(a => {
            // 使用解析后的 duration（考虑变体）
            const duration = getResolvedDuration(a, existingActions);
            const endTime = a.startTime + duration;
            const diff = Math.abs(endTime - proposedStart);

            if (diff < thresholdSec && diff < minDiff) {
                bestSnap = endTime;
                minDiff = diff;
            }
        });

        // 3. Prevent Overlaps (Simple Push)
        // If bestSnap results in overlap, push it forward?
        // Or just return bestSnap and let Validator mark it invalid?
        // Design says: "Auto adsorb/offset".
        // Let's implement "Smart Push" in a separate method if needed.

        return bestSnap;
    }

    static resolveConflicts(newAction, existingActions) {
        // If newAction overlaps with existing on same track:
        // Option A: Reject
        // Option B: Shift existing
        // Option C: Shift newAction to end of existing

        // We assume we already snapped to Start. Now check if Duration overlaps subsequent.
        // 使用解析后的 duration（考虑变体）
        const newDuration = getResolvedDuration(newAction, existingActions);
        const end = newAction.startTime + newDuration;

        const trackActions = existingActions.filter(a => a.charId === newAction.charId && a.id !== newAction.id);

        const overlaps = trackActions.filter(a => {
            const aDuration = getResolvedDuration(a, existingActions);
            const aEnd = a.startTime + aDuration;

            // Check intersection
            return (newAction.startTime < aEnd && end > a.startTime);
        });

        return {
            hasConflict: overlaps.length > 0,
            conflicts: overlaps
        };
    }

    static findSmartSnap(action, existingActions) {
        // If overlapping, find the end of the overlapping skill
        const conflicts = this.resolveConflicts(action, existingActions);
        if (!conflicts.hasConflict) return action.startTime;

        // Find the latest end time among conflicts
        let maxEnd = action.startTime;
        conflicts.conflicts.forEach(c => {
            const cDuration = getResolvedDuration(c, existingActions);
            const cEnd = c.startTime + cDuration;
            if (cEnd > maxEnd) maxEnd = cEnd;
        });

        return maxEnd;
    }
    
    /**
     * 自动解决同角色轨道上的重叠冲突
     * - mode='push'：推挤后续技能，直到无重叠（连锁推挤）
     * - mode='gray'：不推挤，只返回冲突的 actionId（用于置灰）
     *
     * @param {Object} movingAction - 需要放置/拖动的 action（已包含 startTime）
     * @param {Array} allActions - 当前全部 actions（包含 movingAction 时也可）
     * @param {'push'|'gray'} mode
     * @returns {{ actions: Array, conflictInvalidIds: Set<number|string> }}
     */
    static autoResolvePlacement(movingAction, allActions, mode = 'push') {
        const actions = Array.isArray(allActions) ? allActions.map(a => ({ ...a })) : [];
        const conflictInvalidIds = new Set();
        
        // Upsert movingAction
        const idx = actions.findIndex(a => a.id === movingAction.id);
        if (idx >= 0) actions[idx] = { ...actions[idx], ...movingAction };
        else actions.push({ ...movingAction });
        
        // Only resolve per-character mutual exclusion
        const charId = movingAction.charId;
        const track = actions.filter(a => a.charId === charId);
        
        // quick conflict detection helper
        const hasConflict = () => {
            const probe = actions.find(a => a.id === movingAction.id) || movingAction;
            const conflicts = this.resolveConflicts(probe, actions);
            return conflicts.hasConflict;
        };
        
        if (mode === 'gray') {
            if (hasConflict()) conflictInvalidIds.add(movingAction.id);
            return { actions, conflictInvalidIds };
        }
        
        // mode === 'push'
        // Sort by start time, but keep stable ordering by id for equal time
        track.sort((a, b) => (a.startTime - b.startTime) || String(a.id).localeCompare(String(b.id)));
        
        // Push forward to remove overlaps (single pass handles chain because we update startTime)
        let prev = null;
        for (const a of track) {
            if (!prev) {
                prev = a;
                continue;
            }
            const prevEnd = prev.startTime + getResolvedDuration(prev, track);
            const curDur = getResolvedDuration(a, track);
            if (a.startTime < prevEnd - 1e-6) {
                a.startTime = prevEnd;
            }
            prev = a;
        }
        
        // Write back modified track actions into actions list
        const byId = new Map(track.map(a => [a.id, a]));
        const nextActions = actions.map(a => byId.get(a.id) || a);
        
        // If still conflict (due to duration depending on order/variants), mark as invalid instead of looping forever
        const finalProbe = nextActions.find(a => a.id === movingAction.id) || movingAction;
        const finalConflicts = this.resolveConflicts(finalProbe, nextActions);
        if (finalConflicts.hasConflict) {
            conflictInvalidIds.add(movingAction.id);
        }
        
        return { actions: nextActions, conflictInvalidIds };
    }
}
