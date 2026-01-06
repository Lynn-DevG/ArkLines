import React from 'react';
import { SKILLS, SKILL_TYPES } from '../../data/skills';
import { BUFFS } from '../../data/buffs';
import { X } from 'lucide-react';

export const TimelineBlock = ({ action, pxPerSec, onRemove, onDragStart, comboInfo, onActionClick, isInvalid }) => {
    const skillDef = SKILLS[action.skillId];
    if (!skillDef) return null;

    const typeConfig = SKILL_TYPES[skillDef.type];
    const width = skillDef.duration * pxPerSec;
    const left = action.startTime * pxPerSec;

    // Visual override for Heavy
    let displayName = skillDef.name;
    let styleClass = typeConfig.color;

    if (comboInfo) {
        if (comboInfo.isHeavy) {
            displayName = 'Heavy';
            styleClass = 'bg-orange-600'; // Override color
        } else {
            displayName = `A${comboInfo.step}`;
        }
    }

    return (
        <div
            className={`absolute rounded shadow-md border border-white/10 flex items-center px-2 hover:brightness-110 cursor-pointer transition-transform hover:scale-[1.02] z-10 ${styleClass} select-none ${isInvalid ? 'grayscale opacity-50 border-red-500' : ''}`}
            style={{
                left: `${left}px`,
                width: `${width}px`,
                height: '24px',
                top: '0px' // Positioning handled by parent track usually, or we pass top prop
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                onDragStart(e, action);
            }}
            onClick={(e) => {
                if (onActionClick) onActionClick(e, action);
            }}
            title={`${skillDef.name} ${comboInfo ? '(Combo ' + comboInfo.step + ')' : ''}`}
        >
            <span className="text-[10px] font-bold text-white whitespace-nowrap drop-shadow-md truncate">
                {displayName}
            </span>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(action.id); }}
                className="absolute top-0 right-0 bottom-0 bg-black/20 hover:bg-red-500/80 w-5 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
            >
                <X size={10} />
            </button>

            {/* Node Indicators */}
            {skillDef.nodes.map((node, idx) => (
                <div
                    key={idx}
                    className="absolute top-0 bottom-0 w-px bg-white/50"
                    style={{ left: `${(node.time / skillDef.duration) * 100}%` }}
                />
            ))}

            {/* Buff Duration Bars (Extending beyond block) */}
            {skillDef.nodes.map((node, idx) => {
                if (node.type !== 'buff_add' && node.type !== 'status_apply') return null;

                let duration = node.duration;
                let color = 'bg-green-400/30';
                let borderColor = 'border-green-400';

                // Lookup duration
                if (!duration && node.status) {
                    const buffDef = BUFFS[node.status];
                    if (buffDef?.duration) duration = buffDef.duration;
                    color = 'bg-red-500/30';
                    borderColor = 'border-red-500';
                } else if (!duration && node.buffId) {
                    const buffDef = BUFFS[node.buffId];
                    if (buffDef?.duration) duration = buffDef.duration;
                    color = 'bg-blue-400/30';
                    borderColor = 'border-blue-400';
                }

                if (duration) {
                    const barLeft = node.time * pxPerSec;
                    const barWidth = duration * pxPerSec;

                    return (
                        <div
                            key={`buff-${idx}`}
                            className={`absolute h-1.5 bottom-0 z-0 pointer-events-none border-l border-t rounded-br ${color} ${borderColor}`}
                            style={{
                                left: `${barLeft}px`,
                                width: `${barWidth}px`,
                                transform: 'translateY(100%)', // Below the block
                                opacity: 0.8
                            }}
                            title={`Duration: ${duration}s`}
                        />
                    );
                }
                return null;
            })}
        </div>
    );
};
