import React from 'react';
import { SKILLS, SKILL_TYPES } from '../../data/skills';
import { X, Zap, Clock, Info } from 'lucide-react';
import { ComboManager } from '../../engine/ComboManager';
import { useSimulation } from '../../store/SimulationContext';

export const ActionInspector = ({ action, onClose }) => {
    const { actions } = useSimulation(); // Need all actions for combo prediction context

    if (!action) return null;
    let skill = SKILLS[action.skillId];
    if (!skill) return null;

    // Resolve Variants
    // We need to know previous actions to predict combo
    // Optimization: We could move this to a shared helper "resolveSkillDef(action, allActions)"
    if (skill.type === 'BASIC') {
        // Find all BASIC actions for this char, sorted
        const charActions = actions
            .filter(a => a.charId === action.charId && SKILLS[a.skillId]?.type === 'BASIC')
            .sort((a, b) => a.startTime - b.startTime);

        // We need to run the predictor from start to this action
        const cm = new ComboManager();
        let comboInfo = { step: 1, isHeavy: false };

        for (const act of charActions) {
            const pred = cm.predictNext(act.charId, act.startTime, true);
            if (act.id === action.id) {
                comboInfo = pred;
                break;
            }
        }

        // Apply Variants
        if (skill.variants && Array.isArray(skill.variants)) {
            let finalDef = { ...skill };
            for (const variant of skill.variants) {
                if (!variant.condition) continue;
                let match = false;
                const cond = variant.condition;

                if (cond.type === 'combo') {
                    if (cond.value === 'heavy') {
                        if (comboInfo.isHeavy) match = true;
                    } else {
                        if (comboInfo.step === cond.value && !comboInfo.isHeavy) match = true;
                    }
                }
                // Note: Buff condition relies on Sim State which is expensive to get here.
                // For now, we ignore Buff conditions in Inspector unless we pass full Sim State.

                if (match) {
                    const { condition, ...overrides } = variant;
                    finalDef = { ...finalDef, ...overrides };
                    break;
                }
            }
            skill = finalDef;
        }
    }

    const typeConfig = SKILL_TYPES[skill.type];

    return (
        <div className="flex flex-col h-full bg-slate-900 border-l border-slate-700">
            <div className="p-4 border-b border-slate-700 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                    <Info size={20} /> Inspector
                </h2>
                <button onClick={onClose} className="text-slate-400 hover:text-white">
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* Header */}
                <div className={`p-3 rounded-lg border border-white/10 ${typeConfig.color}`}>
                    <div className="font-bold text-white text-lg">{skill.name}</div>
                    <div className="text-white/60 text-xs font-mono uppercase mt-1">{skill.type}</div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-slate-800 p-2 rounded">
                        <div className="text-slate-400 mb-1 flex items-center gap-1"><Clock size={10} /> Start Time</div>
                        <div className="text-white font-mono">{action.startTime.toFixed(2)}s</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                        <div className="text-slate-400 mb-1 flex items-center gap-1"><Clock size={10} /> Duration</div>
                        <div className="text-white font-mono">{skill.duration}s</div>
                    </div>
                    <div className="bg-slate-800 p-2 rounded">
                        <div className="text-slate-400 mb-1 flex items-center gap-1"><Zap size={10} /> SP Cost</div>
                        <div className="text-white font-mono">{skill.spCost || 0}</div>
                    </div>
                </div>

                {/* Nodes Timeline */}
                <div>
                    <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">Action Nodes</h3>
                    <div className="space-y-2">
                        {skill.nodes.map((node, i) => (
                            <div key={i} className="bg-slate-800/50 p-2 rounded border border-slate-700 text-xs relatives">
                                <div className="flex justify-between mb-1">
                                    <span className="text-indigo-400 font-bold uppercase">{node.type}</span>
                                    <span className="text-slate-500 font-mono">{(action.startTime + node.time).toFixed(2)}s</span>
                                </div>
                                <div className="text-slate-300">
                                    {node.type === 'damage' && `Multiplier: ${node.multiplier}x (${node.element})`}
                                    {node.type === 'status_apply' && `Apply: ${node.status} (${node.layers} stacks)`}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
