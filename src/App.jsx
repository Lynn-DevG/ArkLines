import React, { useState, useRef, useEffect } from 'react';
import { SimulationProvider, useSimulation } from './store/SimulationContext';
import { MainLayout } from './components/Layout/MainLayout';
import { CharacterSelector } from './components/Config/CharacterSelector';
import { SkillMatrix } from './components/Timeline/SkillMatrix';
import TimelineTrackResolved from './components/Timeline/TimelineTrack';
import { AtbTrack } from './components/Timeline/AtbTrack';
import { StatsDashboard } from './components/Stats/StatsDashboard';
import { ActionInspector } from './components/Stats/ActionInspector';
import { SkillEditorPage } from './pages/SkillEditor';
import { User, Clock, Wand2 } from 'lucide-react';
import { SKILLS } from './data/skills';
import { Magnetism } from './engine/Magnetism';
import { formatTimeWithFrames } from './config/simulation';

const AppContent = ({ onOpenEditor }) => {
    const { team, actions, addAction, removeAction, updateAction, invalidActionIds, uspTimelines, atbTimeline } = useSimulation();
    const [selectedTool, setSelectedTool] = useState(null); // { charId, skillId }
    const [dragState, setDragState] = useState(null); // { actionId, startX, initialStartTime }
    const [selectedActionId, setSelectedActionId] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [conflictingActionIds, setConflictingActionIds] = useState(new Set());
    const timelineRef = useRef(null);

    const PX_PER_SEC = 120 * zoom;
    const TRACK_HEADER_WIDTH = 100;

    const handleActionDragStart = (e, action) => {
        setDragState({
            actionId: action.id,
            startX: e.clientX,
            initialStartTime: action.startTime,
            charId: action.charId,
            skillId: action.skillId
        });
    };

    const handleTimelineMouseMove = (e) => {
        if (!dragState || !timelineRef.current) return;

        const deltaX = e.clientX - dragState.startX;
        const deltaTime = deltaX / PX_PER_SEC;
        let newTime = Math.max(0, dragState.initialStartTime + deltaTime);

        updateAction(dragState.actionId, newTime);

        // Check for conflicts
        const action = actions.find(a => a.id === dragState.actionId);
        if (action) {
            // Only check conflicts against VALID actions
            const solidActions = actions.filter(a => !invalidActionIds.has(a.id));
            const result = Magnetism.resolveConflicts(action, solidActions);

            if (result.hasConflict) {
                setConflictingActionIds(prev => new Set(prev).add(dragState.actionId));
            } else {
                setConflictingActionIds(prev => {
                    const next = new Set(prev);
                    next.delete(dragState.actionId);
                    return next;
                });
            }
        }
    };

    const handleTimelineMouseUp = (e) => {
        if (dragState) {
            const action = actions.find(a => a.id === dragState.actionId);
            if (action) {
                // Snap against SOLID actions only
                const solidActions = actions.filter(a => !invalidActionIds.has(a.id));
                let finalTime = Magnetism.findSmartSnap(action, solidActions);

                if (finalTime === action.startTime) {
                    finalTime = Magnetism.getSnapTime(action, solidActions, PX_PER_SEC);
                }

                // Final conflict check vs Solid actions
                const conflicts = Magnetism.resolveConflicts({ ...action, startTime: finalTime }, solidActions);

                if (conflicts.hasConflict) {
                    // Revert if still invalid
                    updateAction(dragState.actionId, dragState.initialStartTime);
                } else {
                    updateAction(dragState.actionId, finalTime);
                }
            }
            setDragState(null);
            setConflictingActionIds(new Set());
        }
    };

    const handleTimelineClick = (e) => {
        if (dragState) return;
        if (!selectedTool || !timelineRef.current) return;

        const rect = timelineRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left + timelineRef.current.scrollLeft - TRACK_HEADER_WIDTH;
        let time = Math.max(0, clickX / PX_PER_SEC);

        // 1. Magnetism Snap
        const solidActions = actions.filter(a => !invalidActionIds.has(a.id));
        time = Magnetism.getSnapTime({ startTime: time, charId: selectedTool.charId, id: -1 }, solidActions, PX_PER_SEC);

        // 2. Conflict Check
        const conflicts = Magnetism.resolveConflicts({
            startTime: time,
            skillId: selectedTool.skillId,
            charId: selectedTool.charId,
            id: -1
        }, solidActions);

        if (conflicts.hasConflict) {
            return;
        }

        // Add Action
        addAction({
            id: Date.now(),
            charId: selectedTool.charId,
            skillId: selectedTool.skillId,
            startTime: time
        });
    };

    const handleRemoveAction = (id) => {
        removeAction(id);
        if (selectedActionId === id) setSelectedActionId(null);
    };

    const handleActionClick = (e, action) => {
        setSelectedActionId(action.id);
    };

    // Calculate Cursor Time for Validation
    // This needs to be efficient. On Hover of timeline? Or just last clicked time?
    // Let's use 'mouseTime' from handleTimelineMouseMove if we tracked it, but that's drag-only.
    // For now, let's use a new state 'cursorTime' updated on mouse move over timeline (standard).
    const [cursorTime, setCursorTime] = useState(0);

    const handleTimelineHover = (e) => {
        if (!timelineRef.current) return;
        const rect = timelineRef.current.getBoundingClientRect();
        const mouseX = e.clientX - rect.left + timelineRef.current.scrollLeft - TRACK_HEADER_WIDTH;
        const time = Math.max(0, mouseX / PX_PER_SEC);
        setCursorTime(time);

        handleTimelineMouseMove(e); // Propagate drag logic
    };

    // Calculate Sim State at Cursor (Memoized or Just-in-time)
    // We can use the simulator instance from context?
    // useSimulation provides 'simulator' ? No, it provides actions/team.
    // We might need to expose the helper in context or create a throwaway instance here.
    // Ideally the Context should expose `getSimulationStateAt(time)`.
    // Let's update useSimulation context to expose the helper? 
    // Or just import TimelineSimulator and use it statically? No, it needs state.

    // Quick fix: Instantiate a momentary simulator.
    // Optimization: This might be heavy per frame.
    // Ideally validation happens less often or is optimized.
    // Let's do it in the render or proper effect.

    const { getResourceStateAt } = useSimulation(); // Assuming we add this.
    const currentSimState = getResourceStateAt ? { ...getResourceStateAt(cursorTime), cursorTime } : null;

    return (
        <MainLayout
            left={
                <div className="h-full flex flex-col">
                    <div className="p-4 border-b border-neutral-700">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300">
                            <User size={20} /> 队伍配置
                        </h2>
                    </div>
                    <CharacterSelector />
                    {/* 技能编辑器入口 */}
                    {onOpenEditor && (
                        <div className="mt-auto p-4 border-t border-neutral-700">
                            <button
                                onClick={onOpenEditor}
                                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 rounded text-sm text-neutral-300 transition-colors"
                            >
                                <Wand2 size={16} />
                                技能数据编辑器
                            </button>
                        </div>
                    )}
                </div>
            }
            center={
                <>
                    <SkillMatrix
                        team={team}
                        selectedTool={selectedTool}
                        onSelectTool={(charId, skillId) => {
                            if (selectedTool?.skillId === skillId) setSelectedTool(null);
                            else setSelectedTool({ charId, skillId });
                        }}
                        currentSimState={currentSimState}
                    />

                    {/* Timeline Area */}
                    <div className="flex-1 relative overflow-hidden flex flex-col bg-neutral-950">
                        {/* Toolbar */}
                        <div className="h-8 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 text-xs shrink-0">
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-neutral-400"><Clock size={12} /> 时间轴</span>
                                <div className="flex items-center gap-1">
                                    <button className="w-6 h-6 bg-neutral-800 rounded hover:bg-neutral-700 flex items-center justify-center" onClick={() => setZoom(Math.max(0.5, zoom - 0.1))}>-</button>
                                    <span className="w-10 text-center text-neutral-300">{Math.round(zoom * 100)}%</span>
                                    <button className="w-6 h-6 bg-neutral-800 rounded hover:bg-neutral-700 flex items-center justify-center" onClick={() => setZoom(Math.min(2.0, zoom + 0.1))}>+</button>
                                </div>
                            </div>
<div className="text-neutral-500 font-mono">
                                                光标: {formatTimeWithFrames(cursorTime)}
                                            </div>
                        </div>

                        <div
                            ref={timelineRef}
                            className="flex-1 overflow-x-auto overflow-y-auto relative select-none custom-scrollbar"
                            style={{ cursor: selectedTool ? 'crosshair' : 'default' }}
                            onClick={handleTimelineClick}
                            onMouseMove={handleTimelineHover}
                            onMouseUp={handleTimelineMouseUp}
                            onMouseLeave={handleTimelineMouseUp}
                        >
                            <div style={{ width: `${30 * PX_PER_SEC + TRACK_HEADER_WIDTH}px`, minHeight: '100%' }} className="relative flex flex-col">
                                {/* Time Grid */}
                                <div className="absolute inset-0 pointer-events-none z-0">
                                    {Array.from({ length: 31 }).map((_, i) => (
                                        <div key={i} className="absolute top-0 bottom-0 border-l border-neutral-800/50 text-[10px] text-neutral-600 pl-1 pt-1"
                                            style={{ left: `${TRACK_HEADER_WIDTH + i * PX_PER_SEC}px` }}>
                                            {i}秒
                                        </div>
                                    ))}
                                </div>

                                {/* Tracks */}
                                <div className="flex flex-col pt-8 pb-4 relative z-10">
                                    {/* 技力轴（ATB） */}
                                    <AtbTrack atbTimeline={atbTimeline} pxPerSec={PX_PER_SEC} />
                                    
                                    {team.map((char, idx) => char ? (
                                        <TimelineTrackResolved
                                            key={char.id}
                                            char={char}
                                            actions={actions.filter(a => a.charId === char.id)}
                                            uspTimeline={uspTimelines[char.id] || []}
                                            pxPerSec={PX_PER_SEC}
                                            onRemoveAction={handleRemoveAction}
                                            onActionDragStart={handleActionDragStart}
                                            onActionClick={handleActionClick}
                                            conflictingActionIds={conflictingActionIds}
                                            invalidResourceActionIds={invalidActionIds}
                                        />
                                    ) : (
                                        <div key={idx} className="min-h-[112px] border-b border-neutral-800/30 bg-neutral-900/20 flex items-center justify-start" style={{ paddingLeft: `${TRACK_HEADER_WIDTH}px` }}>
                                            <span className="text-neutral-700 text-xs">空位</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
            right={
                selectedActionId ? (
                    <ActionInspector
                        action={actions.find(a => a.id === selectedActionId)}
                        onClose={() => setSelectedActionId(null)}
                    />
                ) : (
                    <StatsDashboard />
                )
            }
        />
    );
};

export default function App() {
    const [mode, setMode] = useState('simulator');

    // 检查 URL 参数决定模式
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const modeParam = params.get('mode');
        if (modeParam === 'editor') {
            setMode('editor');
        }
    }, []);

    // 切换模式时更新 URL
    const switchMode = (newMode) => {
        setMode(newMode);
        const url = new URL(window.location);
        if (newMode === 'editor') {
            url.searchParams.set('mode', 'editor');
        } else {
            url.searchParams.delete('mode');
        }
        window.history.pushState({}, '', url);
    };

    // 技能编辑器模式
    if (mode === 'editor') {
        return <SkillEditorPage onBack={() => switchMode('simulator')} />;
    }

    // 模拟器模式
    return (
        <SimulationProvider>
            <AppContent onOpenEditor={() => switchMode('editor')} />
        </SimulationProvider>
    );
}
