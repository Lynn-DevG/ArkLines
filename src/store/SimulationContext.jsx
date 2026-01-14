import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { TimelineSimulator } from '../engine/TimelineSimulator';
import { CRIT_MODE } from '../engine/DamageCalculator';
import { CHARACTERS } from '../data/characters';
import { SKILLS } from '../data/skills';
import { getSkillValue } from '../data/levelMappings';
import { getSkillSlotForCharacterSkillId, getSkillLevelBySlot, getSkillLevelForSkillId, isSkillSlot } from '../utils/skillSlots';

// 导出暴击模式枚举供外部使用
export { CRIT_MODE };

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
    const [atbTimeline, setAtbTimeline] = useState([]); // [{ time, atb, reason }]
    const [buffIntervals, setBuffIntervals] = useState({}); // { targetId: { buffId: [{start,end,stacks,...}] } }
    
    // 存储模拟器解析后的每个 action 的最终技能定义
    // 结构: Map<actionId, { skillDef, comboInfo }>
    const [resolvedActionSkills, setResolvedActionSkills] = useState(new Map());

    const [simulator, setSimulator] = useState(null);

    const [invalidActionIds, setInvalidActionIds] = useState(new Set());
    const [invalidConflictActionIds, setInvalidConflictActionIds] = useState(new Set());
    const [invalidMainCharBasicActionIds, setInvalidMainCharBasicActionIds] = useState(new Set());
    
    // 主控角色（用于普攻限制、条件判断等）
    const [mainCharId, setMainCharId] = useState(null);
    const mainCharIdRef = useRef(mainCharId);
    useEffect(() => {
        mainCharIdRef.current = mainCharId;
    }, [mainCharId]);
    
    // 暴击模式: 'random'(随机)/'always'(固定暴击)/'never'(固定非暴击)
    const [critMode, setCritMode] = useState(CRIT_MODE.RANDOM);
    
    // 调试模式: 是否在控制台打印伤害计算详情
    const [debugMode, setDebugMode] = useState(false);
    
    // 自动吸附冲突处理模式：push=推挤，gray=置灰不推挤
    const [autoResolveMode, setAutoResolveMode] = useState('push');
    
    /**
     * 解析后的技能缓存
     * 结构: { [skillId]: { [skillLevel]: resolvedSkillDef } }
     */
    const resolvedSkillsCache = useMemo(() => {
        const cache = {};
        
        // 为每个队伍成员的技能预解析动态值
        // 注意：技能等级按槽位区分（basic/tactical/chain/ultimate），并兼容旧的 char.skillLevel
        team.forEach(char => {
            if (!char) return;

            const skillSlots = char.skills
                ? [
                    { slot: 'basic', skillId: char.skills.basic },
                    { slot: 'tactical', skillId: char.skills.tactical },
                    { slot: 'chain', skillId: char.skills.chain },
                    { slot: 'ultimate', skillId: char.skills.ultimate }
                ]
                : [];

            skillSlots.forEach(({ slot, skillId }) => {
                if (!skillId || !SKILLS[skillId]) return;

                const skillLevel = getSkillLevelBySlot(char, slot, 1);

                if (!cache[skillId]) cache[skillId] = {};
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

    /**
     * 获取角色指定技能/槽位的技能等级（兼容旧接口）。
     * - getCharSkillLevel(charId): 兼容旧逻辑，返回 char.skillLevel || 1
     * - getCharSkillLevel(charId, 'basic'|'tactical'|'chain'|'ultimate'): 返回对应槽位等级
     * - getCharSkillLevel(charId, skillId): 尝试把 skillId 映射到槽位后返回等级
     */
    const getCharSkillLevelV2 = useCallback((charId, skillIdOrSlot = null) => {
        const char = team.find(c => c?.id === charId);
        if (!char) return 1;

        if (!skillIdOrSlot) return char.skillLevel || 1;
        if (isSkillSlot(skillIdOrSlot)) {
            return getSkillLevelBySlot(char, skillIdOrSlot, 1);
        }

        return getSkillLevelForSkillId(char, String(skillIdOrSlot), 1);
    }, [team]);

    /**
     * 获取一个 action 对应的技能等级（按该角色的槽位等级计算）。
     */
    const getActionSkillLevel = useCallback((action) => {
        if (!action) return 1;
        const char = team.find(c => c?.id === action.charId);
        if (!char) return 1;
        return getSkillLevelForSkillId(char, action.skillId, 1);
    }, [team]);

    /**
     * 获取一个 action 对应的槽位（basic/tactical/chain/ultimate）
     */
    const getActionSkillSlot = useCallback((action) => {
        if (!action) return null;
        const char = team.find(c => c?.id === action.charId);
        if (!char) return null;
        return getSkillSlotForCharacterSkillId(char, action.skillId);
    }, [team]);

    // Initialize Simulator when team changes
    useEffect(() => {
        const activeChars = team.filter(c => c !== null);
        
        // 维护 mainCharId：如果当前主控不在队伍里，则自动选第一个在队角色
        const prevMain = mainCharIdRef.current;
        const nextMain = (prevMain && activeChars.some(c => c.id === prevMain))
            ? prevMain
            : (activeChars[0]?.id || null);
        if (nextMain !== prevMain) {
            setMainCharId(nextMain);
        }
        
        const sim = new TimelineSimulator(activeChars, {
            name: '训练假人',
            stats: { baseDef: 100, baseHp: 10000000, maxPoise: 100, currentPoise: 100 }
        });
        
        if (nextMain) sim.setMainCharacter(nextMain);
        setSimulator(sim);
    }, [team]);
    
    // Keep simulator main character in sync
    useEffect(() => {
        if (!simulator) return;
        if (mainCharId) simulator.setMainCharacter(mainCharId);
    }, [simulator, mainCharId]);
    
    // Run Simulation when actions, critMode or debugMode change
    useEffect(() => {
        if (!simulator) return;

        // 设置暴击模式
        simulator.setCritMode(critMode);
        
        // 设置调试模式
        simulator.setDebugMode(debugMode);

        // Push actions to simulator
        simulator.timelineActions = actions.map(a => ({ ...a }));

        // 1. Validation Logic (Resource & Constraints)
        // Check strict validity for graying out on timeline
        // NOTE: 主控切换相关的“非主控普攻无效”在这里即时计算，
        // 避免 useEffect state 更新时序导致一帧内未生效。
        const invalidMainCharBasicNow = new Set();
        if (mainCharId) {
            (actions || []).forEach(a => {
                const skillType = SKILLS?.[a.skillId]?.type;
                if (skillType === 'BASIC' && a.charId !== mainCharId) {
                    invalidMainCharBasicNow.add(a.id);
                }
            });
        }
        // 同步暴露给 UI（只用于显示/调试）
        setInvalidMainCharBasicActionIds(invalidMainCharBasicNow);

        const preInvalidIds = new Set([
            ...(invalidConflictActionIds || []),
            ...invalidMainCharBasicNow
        ]);
        const invalidIds = simulator.validateActions(simulator.timelineActions, preInvalidIds);
        setInvalidActionIds(invalidIds);

        // 2. Run Simulation (Skipping invalid actions)
        const result = simulator.run(30, invalidIds); // 30s sim
        setLogs(result.logs);
        setUspTimelines(result.uspTimelines || {});
        setAtbTimeline(result.atbTimeline || []);
        setBuffIntervals(result.buffIntervals || {});
        
        // 更新解析后的技能定义（供 UI 使用）
        setResolvedActionSkills(result.resolvedActionSkills || new Map());

        // Sum logs
        const sum = result.logs.reduce((acc, log) => acc + (log.type === 'DAMAGE' || log.type === 'DOT' ? log.value : 0), 0);
        setTotalDamage(sum);

    }, [actions, simulator, critMode, debugMode, invalidConflictActionIds, invalidMainCharBasicActionIds, mainCharId]);

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
    
    const setMainCharacter = (charId) => {
        setMainCharId(charId);
        if (simulator) simulator.setMainCharacter(charId);
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
    
    const replaceActions = (nextActions) => {
        setActions(Array.isArray(nextActions) ? nextActions : []);
    };

    const getResourceStateAt = (time) => {
        // Create a temporary simulator (lightweight?)
        // Ideally we keep a 'live' simulator instance or cached state, 
        // but for now, fresh instance is safest for accuracy.
        const sim = new TimelineSimulator(team.filter(Boolean), { 
            stats: { 
                baseHp: 1000000,
                maxPoise: 100,
                currentPoise: 100
            } 
        });
        // We need to inject current actions
        actions.forEach(a => sim.addAction(a));
        return sim.simulateResourceStateAt(time);
    };

    return (
        <SimulationContext.Provider value={{
            team,
            setTeam,
            actions,
            replaceActions,
            addAction,
            removeAction,
            updateAction,
            // runSimulation, // This was in the example, but not defined in the original code. Keeping original context values.
            updateCharacter,
            getResourceStateAt,
            invalidActionIds,
            invalidConflictActionIds,
            setInvalidConflictActionIds,
            invalidMainCharBasicActionIds,
            uspTimelines, // 每个角色的终结技能量变化时间线
            atbTimeline, // 技力（ATB）变化时间线
            buffIntervals, // buff 区间（用于时间轴展示）
            logs, // Kept from original context
            totalDamage, // Kept from original context
            addCharacter, // Kept from original context
            removeCharacter, // Kept from original context
            // 新增：解析后的技能数据
            getResolvedSkill,
            // 旧接口（保留）
            getCharSkillLevel,
            // 新接口（按槽位/skillId）
            getCharSkillLevelV2,
            getActionSkillLevel,
            getActionSkillSlot,
            // 新增：模拟器解析的最终变体结果
            resolvedActionSkills,
            // 主控角色控制
            mainCharId,
            setMainCharacter,
            // 自动吸附配置
            autoResolveMode,
            setAutoResolveMode,
            // 暴击模式控制
            critMode,
            setCritMode,
            // 调试模式控制
            debugMode,
            setDebugMode
        }}>
            {children}
        </SimulationContext.Provider>
    );
};
