import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
    Swords,
    Zap,
    RefreshCw,
    Sparkles,
    Clock,
    Trash2,
    Play,
    Pause,
    Settings,
    Plus,
    X,
    User,
    Activity,
    BarChart3
} from 'lucide-react';

// --- 模拟数据与常量 ---

const SKILL_TYPES = {
    BASIC: { id: 'basic', name: '普通攻击', color: 'bg-slate-500', height: 40, damageMult: 100, duration: 1.5 },
    SKILL: { id: 'skill', name: '战技', color: 'bg-blue-500', height: 40, damageMult: 250, duration: 2.0 },
    CHAIN: { id: 'chain', name: '连协技', color: 'bg-purple-500', height: 40, damageMult: 180, duration: 1.0 },
    ULT: { id: 'ult', name: '终结技', color: 'bg-amber-500', height: 50, damageMult: 600, duration: 3.5 },
};

// 模拟角色数据库
const CHAR_DB = [
    { id: 'c1', name: '烈焰剑士', element: 'fire', baseAtk: 1200, color: 'text-red-400', border: 'border-red-400' },
    { id: 'c2', name: '寒冰射手', element: 'ice', baseAtk: 1100, color: 'text-blue-400', border: 'border-blue-400' },
    { id: 'c3', name: '虚空法师', element: 'void', baseAtk: 1350, color: 'text-purple-400', border: 'border-purple-400' },
    { id: 'c4', name: '神圣牧师', element: 'light', baseAtk: 900, color: 'text-yellow-400', border: 'border-yellow-400' },
    { id: 'c5', name: '暗影刺客', element: 'dark', baseAtk: 1250, color: 'text-gray-400', border: 'border-gray-400' },
    { id: 'c6', name: '风暴骑士', element: 'wind', baseAtk: 1150, color: 'text-green-400', border: 'border-green-400' },
];

const PX_PER_SEC = 60; // 时间轴比例：60px = 1秒

// --- 辅助组件 ---

const Tooltip = ({ text, children }) => (
    <div className="group relative flex">
        {children}
        <span className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-xs text-white opacity-0 transition before:absolute before:left-1/2 before:top-full before:-translate-x-1/2 before:border-4 before:border-transparent before:border-t-black group-hover:opacity-100 z-50">
            {text}
        </span>
    </div>
);

export default function App() {
    // --- State ---
    const [team, setTeam] = useState([null, null, null, null]); // 4个位置
    const [timelineActions, setTimelineActions] = useState([]); // 时间轴上的所有动作
    const [selectedTool, setSelectedTool] = useState(null); // 当前选中的待放置技能 { charId, skillType }
    const [hoverTime, setHoverTime] = useState(0); // 鼠标在时间轴上的对应时间
    const [zoom, setZoom] = useState(1); // 缩放比例
    const [simDuration, setSimDuration] = useState(20); // 模拟总时长(秒)

    const timelineRef = useRef(null);

    // --- Actions ---

    // 添加角色到队伍
    const toggleCharInTeam = (char) => {
        // 如果已经在队里，移除
        if (team.some(c => c?.id === char.id)) {
            setTeam(team.map(c => c?.id === char.id ? null : c));
            // 同时移除该角色的时间轴动作
            setTimelineActions(prev => prev.filter(a => a.charId !== char.id));
            return;
        }
        // 否则找空位加入
        const emptyIndex = team.findIndex(c => c === null);
        if (emptyIndex !== -1) {
            const newTeam = [...team];
            newTeam[emptyIndex] = char;
            setTeam(newTeam);
        } else {
            alert("队伍已满，请先移除一个角色");
        }
    };

    // 选择技能工具
    const handleSelectTool = (charIndex, skillTypeKey) => {
        const char = team[charIndex];
        if (!char) return;

        // 如果点击已选中的，则取消选择
        if (selectedTool?.charId === char.id && selectedTool?.skillType === skillTypeKey) {
            setSelectedTool(null);
        } else {
            setSelectedTool({ charId: char.id, charIndex, skillType: skillTypeKey });
        }
    };

    // 在时间轴上放置技能
    const handleTimelineClick = (e) => {
        if (!selectedTool || !timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft;

        // 计算时间 (秒)
        const time = Math.max(0, clickX / (PX_PER_SEC * zoom));

        const skillConfig = SKILL_TYPES[selectedTool.skillType];
        const char = team[selectedTool.charIndex];

        // 简单的伤害计算逻辑 (占位)
        const damage = Math.floor(char.baseAtk * (skillConfig.damageMult / 100));

        const newAction = {
            id: Date.now(), // 简单ID
            charId: selectedTool.charId,
            skillType: selectedTool.skillType,
            startTime: time,
            duration: skillConfig.duration,
            damage: damage,
            row: selectedTool.charIndex, // 决定渲染在哪一行
        };

        setTimelineActions([...timelineActions, newAction]);
    };

    // 移除时间轴上的动作
    const removeAction = (e, actionId) => {
        e.stopPropagation(); // 防止触发时间轴点击
        setTimelineActions(prev => prev.filter(a => a.id !== actionId));
    };

    // 监听鼠标移动更新Hover时间
    const handleMouseMove = (e) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left + timelineRef.current.scrollLeft;
        setHoverTime(Math.max(0, x / (PX_PER_SEC * zoom)));
    };

    // --- Calculations (Right Sidebar) ---

    const stats = useMemo(() => {
        let totalDamage = 0;
        const damageByChar = {};
        const damageBySkillType = {};

        timelineActions.forEach(action => {
            totalDamage += action.damage;

            // 按角色统计
            damageByChar[action.charId] = (damageByChar[action.charId] || 0) + action.damage;

            // 按技能类型统计
            damageBySkillType[action.skillType] = (damageBySkillType[action.skillType] || 0) + action.damage;
        });

        // 计算DPS (假设战斗时间取 最后一个技能结束时间 或 当前放置的最晚时间)
        const lastActionTime = timelineActions.reduce((max, a) => Math.max(max, a.startTime + a.duration), 0);
        const effectiveTime = Math.max(1, lastActionTime); // 避免除以0
        const dps = totalDamage / effectiveTime;

        return { totalDamage, dps, damageByChar, damageBySkillType, effectiveTime };
    }, [timelineActions]);


    // --- Render Helpers ---

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        const ms = Math.floor((seconds % 1) * 10);
        return `${m}:${s.toString().padStart(2, '0')}.${ms}`;
    };

    return (
        <div className="flex h-screen w-full bg-slate-900 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">

            {/* 1. 左侧边栏：角色配置 */}
            <div className="w-80 flex-shrink-0 border-r border-slate-700 bg-slate-800/50 flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                        <User size={20} />
                        队伍配置
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">选择最多4名角色加入队伍</p>
                </div>

                {/* 角色池 */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-3 gap-2">
                        {CHAR_DB.map(char => {
                            const isInTeam = team.some(c => c?.id === char.id);
                            return (
                                <button
                                    key={char.id}
                                    onClick={() => toggleCharInTeam(char)}
                                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${isInTeam
                                        ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                                        : 'bg-slate-700 border-slate-600 hover:border-slate-400'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 ${char.color} font-bold text-lg mb-1`}>
                                        {char.name[0]}
                                    </div>
                                    <span className="text-[10px] text-center truncate w-full">{char.name}</span>
                                    {isInTeam && (
                                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* 选中角色详情配置 (Mock) */}
                <div className="p-4 bg-slate-800 border-t border-slate-700 h-1/3 overflow-y-auto">
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                        <Settings size={14} /> 角色属性微调
                    </h3>
                    {team.filter(Boolean).length === 0 ? (
                        <div className="text-xs text-slate-500 text-center py-4">请先选择角色</div>
                    ) : (
                        <div className="space-y-4">
                            {team.map((char, idx) => char && (
                                <div key={idx} className="bg-slate-700/50 p-2 rounded border border-slate-600">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${char.color}`}>{char.name}</span>
                                        <span className="text-[10px] text-slate-400">LV.80</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[10px]">
                                        <div className="flex justify-between bg-slate-800 px-1 py-0.5 rounded">
                                            <span>攻击</span>
                                            <span className="text-white">{char.baseAtk}</span>
                                        </div>
                                        <div className="flex justify-between bg-slate-800 px-1 py-0.5 rounded">
                                            <span>暴击</span>
                                            <span className="text-white">60%</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 2. 中间区域：排轴操作 */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-900">

                {/* 顶部：技能矩阵 (Skill Matrix) */}
                <div className="h-64 border-b border-slate-700 bg-slate-800 p-4 flex flex-col shadow-md z-10">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                            <Zap size={20} />
                            技能排轴区
                        </h2>
                        <div className="text-xs text-slate-400">
                            {selectedTool
                                ? <span className="text-indigo-400 font-bold animate-pulse">当前选中: {team.find(c => c.id === selectedTool.charId)?.name} - {SKILL_TYPES[selectedTool.skillType].name} (点击时间轴放置)</span>
                                : "请点击下方技能，然后在时间轴上放置"}
                        </div>
                    </div>

                    <div className="flex-1 flex gap-4">
                        {/* 矩阵表头 */}
                        <div className="flex flex-col justify-end gap-2 pb-2 w-16 text-right text-xs font-mono text-slate-400">
                            <div className="h-10 flex items-center justify-end">终结技</div>
                            <div className="h-10 flex items-center justify-end">连协技</div>
                            <div className="h-10 flex items-center justify-end">战技</div>
                            <div className="h-10 flex items-center justify-end">普攻</div>
                        </div>

                        {/* 矩阵内容 */}
                        <div className="flex-1 grid grid-cols-4 gap-4">
                            {team.map((char, idx) => (
                                <div key={idx} className={`flex flex-col justify-end gap-2 relative rounded-lg p-2 transition-colors ${char ? 'bg-slate-700/30' : 'bg-slate-800/50 dashed-border'}`}>
                                    {char ? (
                                        <>
                                            <div className="absolute top-2 left-0 right-0 text-center">
                                                <span className={`text-xs font-bold ${char.color}`}>{char.name}</span>
                                            </div>

                                            {['ULT', 'CHAIN', 'SKILL', 'BASIC'].map((typeKey) => {
                                                const skill = SKILL_TYPES[typeKey];
                                                const isSelected = selectedTool?.charId === char.id && selectedTool?.skillType === typeKey;
                                                return (
                                                    <button
                                                        key={typeKey}
                                                        onClick={() => handleSelectTool(idx, typeKey)}
                                                        className={`
                                h-10 w-full rounded flex items-center justify-center gap-2 text-xs font-bold transition-all
                                border-l-4
                                ${isSelected ? 'ring-2 ring-white scale-105 shadow-lg' : 'opacity-80 hover:opacity-100'}
                                ${typeKey === 'BASIC' ? 'bg-slate-600 border-slate-400' : ''}
                                ${typeKey === 'SKILL' ? 'bg-blue-600 border-blue-300' : ''}
                                ${typeKey === 'CHAIN' ? 'bg-purple-600 border-purple-300' : ''}
                                ${typeKey === 'ULT' ? 'bg-amber-600 border-amber-300' : ''}
                              `}
                                                    >
                                                        {typeKey === 'BASIC' && <Swords size={14} />}
                                                        {typeKey === 'SKILL' && <Zap size={14} />}
                                                        {typeKey === 'CHAIN' && <RefreshCw size={14} />}
                                                        {typeKey === 'ULT' && <Sparkles size={14} />}
                                                        <span className="hidden xl:inline">{skill.name}</span>
                                                    </button>
                                                );
                                            })}
                                        </>
                                    ) : (
                                        <div className="flex h-full items-center justify-center text-slate-600">
                                            <Plus size={24} />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* 底部：时间轴 (Timeline) */}
                <div className="flex-1 relative overflow-hidden flex flex-col">
                    {/* 工具栏 */}
                    <div className="h-8 bg-slate-950 border-b border-slate-800 flex items-center justify-between px-4 text-xs">
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 text-slate-400"><Clock size={12} /> 时间轴</span>
                            <div className="flex items-center gap-1">
                                <button className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>-</button>
                                <span className="w-8 text-center">{Math.round(zoom * 100)}%</span>
                                <button className="px-2 py-0.5 bg-slate-800 rounded hover:bg-slate-700" onClick={() => setZoom(Math.min(2, zoom + 0.1))}>+</button>
                            </div>
                        </div>
                        <div className="text-slate-500">
                            鼠标悬停: {formatTime(hoverTime)}
                        </div>
                    </div>

                    {/* 滚动区域 */}
                    <div
                        ref={timelineRef}
                        className="flex-1 overflow-x-auto overflow-y-auto relative select-none custom-scrollbar"
                        style={{ cursor: selectedTool ? 'crosshair' : 'default' }}
                        onClick={handleTimelineClick}
                        onMouseMove={handleMouseMove}
                    >
                        {/* 容器宽度动态计算 */}
                        <div style={{ width: `${Math.max(100, simDuration) * PX_PER_SEC * zoom + 100}px`, minHeight: '100%' }} className="relative flex flex-col">

                            {/* 背景刻度网格 */}
                            <div className="absolute inset-0 pointer-events-none z-0">
                                {Array.from({ length: Math.ceil(simDuration) + 1 }).map((_, i) => (
                                    <div key={i} className="absolute top-0 bottom-0 border-l border-slate-800 text-[10px] text-slate-600 pl-1 pt-1"
                                        style={{ left: i * PX_PER_SEC * zoom }}>
                                        {i}s
                                    </div>
                                ))}
                                {Array.from({ length: Math.ceil(simDuration) * 2 }).map((_, i) => (
                                    <div key={`sub-${i}`} className="absolute top-8 bottom-0 border-l border-slate-800/30"
                                        style={{ left: i * (PX_PER_SEC * zoom / 2) }} />
                                ))}
                            </div>

                            {/* 轨道层 (包含所有角色轨道) */}
                            <div className="flex flex-col pt-8 pb-4 relative z-10">
                                {team.map((char, idx) => char ? (
                                    <div key={idx} className="flex-1 min-h-[140px] border-b border-slate-800/50 relative group">
                                        {/* 轨道背景标识 */}
                                        <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900/80 z-20 flex items-center justify-center border-r border-slate-700">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${char.color} bg-slate-800`}>
                                                {char.name[0]}
                                            </div>
                                        </div>

                                        {/* 辅助行线 (Sub-tracks) */}
                                        <div className="absolute left-8 right-0 top-0 bottom-0 pointer-events-none opacity-10">
                                            {[0, 1, 2, 3].map(i => (
                                                <div key={i} className="absolute w-full border-t border-slate-500" style={{ top: 16 + i * 30 }}></div>
                                            ))}
                                        </div>

                                        {/* 该角色的动作块 */}
                                        {timelineActions
                                            .filter(action => action.charId === char.id)
                                            .map(action => {
                                                const config = SKILL_TYPES[action.skillType];

                                                // --- 自动分轨逻辑 ---
                                                const layerMap = { 'ULT': 0, 'CHAIN': 1, 'SKILL': 2, 'BASIC': 3 };
                                                const layerIndex = layerMap[action.skillType] ?? 3;

                                                // 固定高度与动态位置计算
                                                const ROW_HEIGHT = 24;
                                                const ROW_GAP = 6;
                                                const TOP_PADDING = 16;
                                                const topOffset = TOP_PADDING + (layerIndex * (ROW_HEIGHT + ROW_GAP));

                                                return (
                                                    <div
                                                        key={action.id}
                                                        className={`absolute rounded shadow-md border border-white/10 flex items-center px-2 overflow-hidden hover:brightness-110 cursor-pointer transition-transform hover:scale-[1.02] z-10 ${config.color}`}
                                                        style={{
                                                            left: action.startTime * PX_PER_SEC * zoom,
                                                            width: action.duration * PX_PER_SEC * zoom,
                                                            height: `${ROW_HEIGHT}px`,
                                                            top: `${topOffset}px`
                                                        }}
                                                        title={`${config.name}: ${action.damage} 伤害`}
                                                    >
                                                        <span className="text-[10px] font-bold text-white whitespace-nowrap drop-shadow-md">
                                                            {config.name}
                                                        </span>
                                                        <button
                                                            onClick={(e) => removeAction(e, action.id)}
                                                            className="absolute top-0 right-0 bottom-0 bg-black/20 hover:bg-red-500/80 w-5 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
                                                        >
                                                            <X size={10} />
                                                        </button>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                ) : (
                                    <div key={idx} className="min-h-[140px] border-b border-slate-800/20 bg-slate-900/50 flex items-center justify-center">
                                        <span className="text-slate-700 text-xs">空轨道</span>
                                    </div>
                                ))}
                            </div>

                            {/* Playhead (指示线) */}
                            <div
                                className="absolute top-0 bottom-0 border-l-2 border-yellow-500 z-30 pointer-events-none"
                                style={{ left: hoverTime * PX_PER_SEC * zoom }}
                            >
                                <div className="absolute -top-3 -translate-x-1/2 bg-yellow-500 text-black text-[9px] px-1 rounded font-bold">
                                    {formatTime(hoverTime)}
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>

            {/* 3. 右侧边栏：数据统计 */}
            <div className="w-72 flex-shrink-0 border-l border-slate-700 bg-slate-800/90 flex flex-col">
                <div className="p-4 border-b border-slate-700">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                        <Activity size={20} />
                        实时分析
                    </h2>
                </div>

                <div className="flex-1 p-4 space-y-6 overflow-y-auto">
                    {/* 总览数据 */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                            <div className="text-xs text-slate-400 mb-1">总伤害</div>
                            <div className="text-xl font-bold text-white">{stats.totalDamage.toLocaleString()}</div>
                        </div>
                        <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
                            <div className="text-xs text-slate-400 mb-1">DPS (每秒伤害)</div>
                            <div className="text-xl font-bold text-green-400">{Math.round(stats.dps).toLocaleString()}</div>
                        </div>
                        <div className="col-span-2 bg-slate-700/50 p-3 rounded-lg border border-slate-600 flex justify-between">
                            <div>
                                <div className="text-xs text-slate-400 mb-1">战斗时长</div>
                                <div className="text-sm font-mono text-white">{formatTime(stats.effectiveTime)}</div>
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 mb-1">技能数</div>
                                <div className="text-sm font-mono text-white text-right">{timelineActions.length}</div>
                            </div>
                        </div>
                    </div>

                    {/* 角色伤害占比 */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-300">
                            <BarChart3 size={14} /> 角色贡献
                        </h3>
                        <div className="space-y-3">
                            {team.filter(Boolean).map(char => {
                                const dmg = stats.damageByChar[char.id] || 0;
                                const percent = stats.totalDamage > 0 ? (dmg / stats.totalDamage) * 100 : 0;
                                return (
                                    <div key={char.id}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className={char.color}>{char.name}</span>
                                            <span>{dmg.toLocaleString()} ({Math.round(percent)}%)</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden">
                                            <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {team.filter(Boolean).length === 0 && <div className="text-xs text-slate-500 italic">暂无数据</div>}
                        </div>
                    </div>

                    {/* 技能类型占比 */}
                    <div>
                        <h3 className="text-sm font-semibold mb-3 flex items-center gap-2 text-slate-300">
                            <BarChart3 size={14} /> 技能类型占比
                        </h3>
                        <div className="space-y-2">
                            {Object.values(SKILL_TYPES).map(type => {
                                const dmg = stats.damageBySkillType[type.id] || 0;
                                const percent = stats.totalDamage > 0 ? (dmg / stats.totalDamage) * 100 : 0;
                                return (
                                    <div key={type.id} className="flex items-center gap-2 text-xs">
                                        <div className={`w-2 h-2 rounded-full ${type.color.replace('bg-', 'bg-')}`}></div>
                                        <div className="w-16 text-slate-400">{type.name}</div>
                                        <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                            <div className={`h-full ${type.color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                                        </div>
                                        <div className="w-12 text-right">{Math.round(percent)}%</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* 底部按钮 */}
                <div className="p-4 border-t border-slate-700">
                    <button
                        onClick={() => setTimelineActions([])}
                        className="w-full py-2 bg-slate-700 hover:bg-red-900/50 text-slate-300 hover:text-red-200 rounded flex items-center justify-center gap-2 text-sm transition-colors"
                    >
                        <Trash2 size={16} /> 清空轴
                    </button>
                </div>
            </div>
        </div>
    );
}