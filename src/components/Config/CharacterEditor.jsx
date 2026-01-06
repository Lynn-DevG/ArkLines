import React, { useState, useEffect } from 'react';
import { useSimulation } from '../../store/SimulationContext';
import { ChevronLeft, Save } from 'lucide-react';
import { getCharacterStatsAtLevel } from '../../data/characters';

export const CharacterEditor = ({ charId, onClose }) => {
    const { team, updateCharacter } = useSimulation();
    const char = team.find(c => c?.id === charId);

    const [localState, setLocalState] = useState(null);

    useEffect(() => {
        if (char) {
            setLocalState(JSON.parse(JSON.stringify(char)));
        }
    }, [char]);

    if (!char || !localState) return null;

    const handleChange = (field, value) => {
        setLocalState(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleLevelChange = (newLevel) => {
        const stats = getCharacterStatsAtLevel(localState, newLevel);
        setLocalState(prev => ({
            ...prev,
            level: newLevel,
            stats: {
                ...prev.stats,
                ...stats,
                // Preserve base stats format expected by the UI
                baseHp: stats.hp,
                baseAtk: stats.atk,
                baseDef: stats.def,
            }
        }));
    };

    const handleSave = () => {
        updateCharacter(char.id, localState);
        onClose();
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-slate-900 absolute inset-0 z-10">
            <div className="flex items-center justify-between mb-4 border-b border-slate-700 pb-2">
                <button onClick={onClose} className="text-slate-400 hover:text-white flex items-center text-xs">
                    <ChevronLeft size={16} /> Back
                </button>
                <div className="text-sm font-bold text-white">{localState.name}</div>
                <button onClick={handleSave} className="text-indigo-400 hover:text-indigo-300 flex items-center text-xs gap-1">
                    <Save size={14} /> Save
                </button>
            </div>

            <div className="space-y-4">
                {/* Level Control */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Level</label>
                    <div className="flex items-center gap-2">
                        <input
                            type="range" min="1" max="90"
                            value={localState.level}
                            onChange={(e) => handleLevelChange(parseInt(e.target.value))}
                            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-mono w-8 text-right">{localState.level}</span>
                    </div>
                </div>

                {/* Base Stats Readout (Editable in future?) */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Stats Snapshot</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-800 p-2 rounded flex justify-between">
                            <span className="text-slate-400">HP</span>
                            <span className="text-white">{Math.round(localState.stats.baseHp)}</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded flex justify-between">
                            <span className="text-slate-400">ATK</span>
                            <span className="text-white">{Math.round(localState.stats.baseAtk)}</span>
                        </div>
                        <div className="bg-slate-800 p-2 rounded flex justify-between">
                            <span className="text-slate-400">DEF</span>
                            <span className="text-white">{Math.round(localState.stats.baseDef)}</span>
                        </div>
                    </div>
                </div>

                {/* Attributes (STR/AGI/etc) - Just display for now or simple edit */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Attributes</label>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {['strength', 'agility', 'intelligence', 'willpower'].map(attr => (
                            <div key={attr} className="bg-slate-800 p-2 rounded flex justify-between items-center">
                                <span className="text-slate-400 capitalize">{attr.slice(0, 3)}</span>
                                <input
                                    type="number"
                                    className="w-12 bg-transparent text-right text-white border-b border-slate-600 focus:border-indigo-500 outline-none"
                                    value={Math.round(localState.stats[attr])}
                                    onChange={(e) => handleChange('stats', { ...localState.stats, [attr]: parseInt(e.target.value) })}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Skills - Simple List */}
                <div>
                    <label className="text-xs text-slate-500 uppercase font-bold block mb-1">Skills</label>
                    <div className="space-y-1">
                        {localState.skills && Object.entries(localState.skills).map(([key, skillId], idx) => (
                            <div key={idx} className="text-xs text-slate-400 bg-slate-800/50 p-2 rounded flex justify-between">
                                <span className="uppercase text-slate-500 font-bold text-[10px]">{key}</span>
                                <span className="text-slate-300">{skillId}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
