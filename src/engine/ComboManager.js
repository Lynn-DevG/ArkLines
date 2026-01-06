/**
 * Manages Basic Attack Combos
 * Basic -> Basic -> Basic -> Heavy -> Reset
 */
export class ComboManager {
    constructor() {
        // Map charId -> { count: 0, lastTime: 0 }
        this.states = {};
        this.COMBO_WINDOW = 2.0; // Seconds allowed between attacks to keep combo
    }

    reset() {
        this.states = {};
    }

    /**
     * Determines which combo step constitutes the "Next" attack
     */
    predictNext(charId, time, isExec = false) {
        let state = this.states[charId] || { count: 0, lastTime: -999 };

        // Check window
        if (time - state.lastTime > this.COMBO_WINDOW) {
            // Reset if too long
            state.count = 0;
        }

        // Next count (1-based for visual/logic)
        // If current is 0, next is 1. 
        // Logic: Return the step number 1..N
        const nextStep = state.count + 1;

        // Mock Max (e.g. 5 steps -> 5th is Heavy)
        const MAX_STEPS = 5;

        if (isExec) {
            // Update state
            this.states[charId] = {
                count: nextStep >= MAX_STEPS ? 0 : nextStep, // Reset after max
                lastTime: time
            };
        }

        return {
            step: nextStep,
            isHeavy: nextStep === MAX_STEPS
        };
    }
}
