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
}
