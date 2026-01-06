import React from 'react';
import { TimelineBlock } from './TimelineBlock';


// Re-write to include logic properly
import { SKILLS } from '../../data/skills';
import { ComboManager } from '../../engine/ComboManager';

export const TimelineTrackResolved = ({ char, actions, pxPerSec, onRemoveAction, onActionDragStart, onActionClick, conflictingActionIds, invalidResourceActionIds }) => {
    const LAYERS = { 'ULTIMATE': 0, 'CHAIN': 1, 'TACTICAL': 2, 'BASIC': 3 };
    const ROW_HEIGHT = 24;
    const ROW_GAP = 6;
    const TOP_PADDING = 16;
    const HEADER_WIDTH = 100;

    return (
        <div className="flex-1 min-h-[140px] border-b border-slate-800/50 relative group">
            <div className={`absolute left-0 top-0 bottom-0 bg-slate-900/80 z-20 flex items-center px-2 border-r border-slate-700 overflow-hidden text-ellipsis whitespace-nowrap`} style={{ width: `${HEADER_WIDTH}px` }}>
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">
                    {char.name}
                </span>
            </div>

            <div className={`absolute right-0 top-0 bottom-0 pointer-events-none opacity-10`} style={{ left: `${HEADER_WIDTH}px` }}>
                {[0, 1, 2, 3].map(i => (
                    <div key={i} className="absolute w-full border-t border-slate-500" style={{ top: TOP_PADDING + i * (ROW_HEIGHT + ROW_GAP) }}></div>
                ))}
            </div>

            <div className={`absolute right-0 top-0 bottom-0`} style={{ left: `${HEADER_WIDTH}px` }}>
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
