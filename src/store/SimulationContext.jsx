import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { TimelineSimulator } from '../engine/TimelineSimulator';
import { CHARACTERS } from '../data/characters';
import { SKILLS } from '../data/skills';
import { getSkillValue } from '../data/levelMappings';

const SimulationContext = createContext();

export const useSimulation = () => useContext(SimulationContext);

/**
 * 解析技能/action 中的动态值
 * 将包含 xxxKey 的参数解析为实际数值
 */
function resolveActionValues(action, skillId, skillLevel) {
    if (!action) return action;
    
    const resolved = { ...action };
    const keyParams = ['duration', 'stacks', 'value', 'atb', 'usp', 'poise'];
    
    keyParams.forEach(param => {
        const keyName = `${param}Key`;
        if (resolved[keyName]) {
            const value = getSkillValue(skillId, resolved[keyName], skillLevel, resolved.index || null);
            if (value !== 0) {
                resolved[`_resolved_${param}`] = value;
            }
        }
    });
    
    // 处理 scalingKey
    if (resolved.scalingKey) {
        const value = getSkillValue(skillId, resolved.scalingKey, skillLevel, resolved.index || null);
        if (value !== 0) {
            resolved._resolved_scaling = value;
        }
    }
    
    return resolved;
}

/**
 * 解析整个技能定义中的动态值
 */
function resolveSkillData(skillDef, skillLevel) {
    if (!skillDef) return skillDef;
    
    const resolved = { ...skillDef };
    const skillId = skillDef.id;
    
    // 解析 actions 数组
    if (resolved.actions && Array.isArray(resolved.actions)) {
        resolved.actions = resolved.actions.map(action => 
            resolveActionValues(action, skillId, skillLevel)
        );
    }
    
    // 解析 variants
    if (resolved.variants && Array.isArray(resolved.variants)) {
        resolved.variants = resolved.variants.map(variant => {
            const resolvedVariant = { ...variant };
            const variantId = variant.id || skillId;
            
            if (resolvedVariant.actions && Array.isArray(resolvedVariant.actions)) {
                resolvedVariant.actions = resolvedVariant.actions.map(action =>
                    resolveActionValues(action, variantId, skillLevel)
                );
            }
            
            return resolvedVariant;
        });
    }
    
    return resolved;
}

export const SimulationProvider = ({ children }) => {
    const [team, setTeam] = useState([null, null, null, null]);
    const [actions, setActions] = useState([]); // Array of { id, charId, skillId, startTime }
    const [logs, setLogs] = useState([]);
    const [totalDamage, setTotalDamage] = useState(0);
    const [uspTimelines, setUspTimelines] = useState({}); // { charId: [{ time, energy, reason }] }
    
    // 存储模拟器解析后的每个 action 的最终技能定义
    // 结构: Map<actionId, { skillDef, comboInfo }>
    const [resolvedActionSkills, setResolvedActionSkills] = useState(new Map());

    const [simulator, setSimulator] = useState(null);

    const [invalidActionIds, setInvalidActionIds] = useState(new Set());
    
    /**
     * 解析后的技能缓存
     * 结构: { [skillId]: { [skillLevel]: resolvedSkillDef } }
     */
    const resolvedSkillsCache = useMemo(() => {
        const cache = {};
        
        // 为每个队伍成员的技能预解析动态值
        team.forEach(char => {
            if (!char) return;
            
            const skillLevel = char.skillLevel || 1;
            const skillIds = char.skills ? Object.values(char.skills) : [];
            
            skillIds.forEach(skillId => {
                if (!skillId || !SKILLS[skillId]) return;
                
                if (!cache[skillId]) {
                    cache[skillId] = {};
                }
                
                if (!cache[skillId][skillLevel]) {
                    cache[skillId][skillLevel] = resolveSkillData(SKILLS[skillId], skillLevel);
                }
            });
        });
        
        return cache;
    }, [team]);
    
    /**
     * 获取解析后的技能数据
     * @param {string} skillId - 技能ID
     * @param {number} skillLevel - 技能等级，默认为1
     * @returns {Object} 解析后的技能定义
     */
    const getResolvedSkill = useCallback((skillId, skillLevel = 1) => {
        // 优先从缓存获取
        if (resolvedSkillsCache[skillId]?.[skillLevel]) {
            return resolvedSkillsCache[skillId][skillLevel];
        }
        
        // 缓存未命中，实时解析
        const skillDef = SKILLS[skillId];
        if (!skillDef) return null;
        
        return resolveSkillData(skillDef, skillLevel);
    }, [resolvedSkillsCache]);
    
    /**
     * 根据角色ID获取该角色的技能等级
     */
    const getCharSkillLevel = useCallback((charId) => {
        const char = team.find(c => c?.id === charId);
        return char?.skillLevel || 1;
    }, [team]);

    // Initialize Simulator when team changes
    useEffect(() => {
        const activeChars = team.filter(c => c !== null);
        const sim = new TimelineSimulator(activeChars, {
            name: '训练假人',
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
        setUspTimelines(result.uspTimelines || {});
        
        // 更新解析后的技能定义（供 UI 使用）
        setResolvedActionSkills(result.resolvedActionSkills || new Map());

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
            uspTimelines, // 每个角色的终结技能量变化时间线
            logs, // Kept from original context
            totalDamage, // Kept from original context
            addCharacter, // Kept from original context
            removeCharacter, // Kept from original context
            // 新增：解析后的技能数据
            getResolvedSkill,
            getCharSkillLevel,
            // 新增：模拟器解析的最终变体结果
            resolvedActionSkills
        }}>
            {children}
        </SimulationContext.Provider>
    );
};
