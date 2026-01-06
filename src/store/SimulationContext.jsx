import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { TimelineSimulator } from '../engine/TimelineSimulator';
import { CHARACTERS } from '../data/characters';

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

export const SimulationProvider = ({ children }) => {
    const [team, setTeam] = useState([null, null, null, null]);
    const [actions, setActions] = useState([]); // Array of { id, charId, skillId, startTime }
    const [logs, setLogs] = useState([]);
    const [totalDamage, setTotalDamage] = useState(0);

    const [simulator, setSimulator] = useState(null);

    const [invalidActionIds, setInvalidActionIds] = useState(new Set());

    // Initialize Simulator when team changes
    useEffect(() => {
        const activeChars = team.filter(c => c !== null);
        const sim = new TimelineSimulator(activeChars, {
            name: 'Training Dummy',
            stats: { baseDef: 100, baseHp: 10000000 }
        });
        setSimulator(sim);
    }, [team]);

    // Run Simulation when actions change
    useEffect(() => {
        if (!simulator) return;

        // Push actions to simulator
        simulator.timelineActions = actions.map(a => ({ ...a }));

        // 1. Validation Logic (Resource & Constraints)
        // Check strict validity for graying out on timeline
        const invalidIds = simulator.validateActions(simulator.timelineActions);
        setInvalidActionIds(invalidIds);

        // 2. Run Simulation (Skipping invalid actions)
        const result = simulator.run(30, invalidIds); // 30s sim
        setLogs(result.logs);

        // Sum logs
        const sum = result.logs.reduce((acc, log) => acc + (log.type === 'DAMAGE' || log.type === 'DOT' ? log.value : 0), 0);
        setTotalDamage(sum);

    }, [actions, simulator]);

    const addCharacter = (char) => {
        const idx = team.findIndex(c => c === null);
        if (idx === -1) return;
        const newTeam = [...team];
        newTeam[idx] = char;
        setTeam(newTeam);
    };

    const removeCharacter = (charId) => {
        setTeam(team.map(c => c?.id === charId ? null : c));
        setActions(actions.filter(a => a.charId !== charId));
    };

    const updateCharacter = (charId, updates) => {
        setTeam(team.map(c => c?.id === charId ? { ...c, ...updates } : c));
    };

    const addAction = (action) => {
        setActions([...actions, action]);
    };

    const removeAction = (actionId) => {
        setActions(actions.filter(a => a.id !== actionId));
    };

    const updateAction = (actionId, newTime) => {
        setActions(actions.map(a => a.id === actionId ? { ...a, startTime: newTime } : a));
    };

    const getResourceStateAt = (time) => {
        // Create a temporary simulator (lightweight?)
        // Ideally we keep a 'live' simulator instance or cached state, 
        // but for now, fresh instance is safest for accuracy.
        const sim = new TimelineSimulator(team.filter(Boolean), { stats: { baseHp: 1000000 } });
        // We need to inject current actions
        actions.forEach(a => sim.addAction(a));
        return sim.simulateResourceStateAt(time);
    };

    return (
        <SimulationContext.Provider value={{
            team,
            setTeam,
            actions,
            addAction,
            removeAction,
            updateAction,
            // runSimulation, // This was in the example, but not defined in the original code. Keeping original context values.
            updateCharacter,
            getResourceStateAt,
            invalidActionIds,
            logs, // Kept from original context
            totalDamage, // Kept from original context
            addCharacter, // Kept from original context
            removeCharacter // Kept from original context
        }}>
            {children}
        </SimulationContext.Provider>
    );
};
