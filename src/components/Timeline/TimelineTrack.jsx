import React from 'react';
import { TimelineBlock } from './TimelineBlock';

export const TimelineTrack = ({ char, actions, pxPerSec, onRemoveAction, onActionDragStart }) => {
    // We need to split actions into layers to avoid overlap visual
    // Simple 4-layer approach: Ult, Chain, Tactical, Basic
    const LAYERS = { 'ULTIMATE': 0, 'CHAIN': 1, 'TACTICAL': 2, 'BASIC': 3 };

    return (
        <div className="flex-1 min-h-[140px] border-b border-slate-800/50 relative group">
            {/* Character Icon */}
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900/80 z-20 flex items-center justify-center border-r border-slate-700">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-700">
                    {char.name[0]}
                </div>
            </div>

            {/* Grid Lines for layers */}
            <div className="absolute left-8 right-0 top-0 bottom-0 pointer-events-none opacity-10">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="absolute w-full border-t border-slate-500" style={{ top: 16 + i * 30 }}></div>
                ))}
            </div>

            {/* Actions */}
            <div className="absolute left-8 right-0 top-0 bottom-0">
                {actions.map(action => {
                    // Need to look up skill type
                    // We need to pass skillDef or look it up.
                    // IMPORTANT: In a real app we'd pass the full enriched object. 
                    // For now, TimelineBlock does lookup. 
                    // But we need to calculate 'Top' here.
                    // Let's modify TimelineBlock to accept style overrides or handle layers internally?
                    // Actually, let's just do inline style for top here.

                    // We need the Skill Def to know the type for layering
                    // This is a bit leaky abstraction but fine for prototype
                    const { SKILLS } = require('../../data/skills'); // Dynamic import issue in pure ES modules?
                    // Better to Import at top.
                    // (See imports in file)

                    // Re-importing inside map is bad. Assuming imported SKILLS.
                    // We need to map action.skillId -> Type
                })}
            </div>
        </div>
    );
};

// Re-write to include logic properly
import { SKILLS } from '../../data/skills';
import { ComboManager } from '../../engine/ComboManager';

export const TimelineTrackResolved = ({ char, actions, pxPerSec, onRemoveAction, onActionDragStart, onActionClick, conflictingActionIds, invalidResourceActionIds }) => {
    const LAYERS = { 'ULTIMATE': 0, 'CHAIN': 1, 'TACTICAL': 2, 'BASIC': 3 };
    const ROW_HEIGHT = 24;
    const ROW_GAP = 6;
    const TOP_PADDING = 16;

    return (
        <div className="flex-1 min-h-[140px] border-b border-slate-800/50 relative group">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-slate-900/80 z-20 flex items-center justify-center border-r border-slate-700">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white bg-slate-700">
                    {char.name[0]}
                </div>
            </div>

            <div className="absolute left-8 right-0 top-0 bottom-0 pointer-events-none opacity-10">
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="absolute w-full border-t border-slate-500" style={{ top: 16 + i * 30 }}></div>
                ))}
            </div>

            <div className="absolute left-8 right-0 top-0 bottom-0">
                {(() => {
                    // Pre-process for Combo Logic
                    const sortedActions = [...actions].sort((a, b) => a.startTime - b.startTime);
                    const comboManager = new ComboManager(); // Local instance for visual calculation

                    return sortedActions.map(action => {
                        const skill = SKILLS[action.skillId];
                        if (!skill) return null;

                        let comboInfo = null;
                        if (skill.type === 'BASIC') {
                            comboInfo = comboManager.predictNext(action.charId, action.startTime, true);
                        }

                        const layer = LAYERS[skill.type] || 3;
                        const top = TOP_PADDING + (layer * (ROW_HEIGHT + ROW_GAP));

                        return (
                            <div key={action.id} style={{ position: 'absolute', top: top }}>
                                <TimelineBlock
                                    action={action}
                                    pxPerSec={pxPerSec}
                                    onRemove={onRemoveAction}
                                    onDragStart={onActionDragStart}
                                    onActionClick={onActionClick}
                                    comboInfo={comboInfo}
                                    isInvalid={conflictingActionIds?.has(action.id) || invalidResourceActionIds?.has(action.id)}
                                />
                            </div>
                        );
                    });
                })()}
            </div>
        </div>
    );
};

export default TimelineTrackResolved;
