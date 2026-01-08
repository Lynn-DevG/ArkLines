import React, { useState } from 'react';
import { CHARACTERS, getCharacterStatsWithWeapon } from '../../data/characters';
import { useSimulation } from '../../store/SimulationContext';
import { Plus, User, Edit2 } from 'lucide-react';
import { CharacterEditor } from './CharacterEditor';
import { getWeaponAtk, WEAPONS } from '../../data/weapons';

export const CharacterSelector = () => {
    const { team, addCharacter, removeCharacter } = useSimulation();
    const [editingCharId, setEditingCharId] = useState(null);

    const handleToggle = (char) => {
        const inTeam = team.some(c => c?.id === char.id);
        if (inTeam) {
            removeCharacter(char.id);
        } else {
            addCharacter(char);
        }
    };

    return (
        <div className="flex-1 relative w-full h-full min-h-0">
            {editingCharId ? (
                <CharacterEditor charId={editingCharId} onClose={() => setEditingCharId(null)} />
            ) : (
                <div className="absolute inset-0 overflow-y-auto p-4 flex flex-col custom-scrollbar">
                    <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">可用角色</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {CHARACTERS.map(char => {
                            const isInTeam = team.some(c => c?.id === char.id);
                            return (
                                <button
                                    key={char.id}
                                    onClick={() => handleToggle(char)}
                                    className={`relative flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${isInTeam
                                        ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500'
                                        : 'bg-slate-700 border-slate-600 hover:border-slate-400 hover:bg-slate-700/80'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-slate-800 border border-slate-600 font-bold text-lg mb-1`}>
                                        {char.name[0]}
                                    </div>
                                    <span className="text-[10px] text-center truncate w-full text-slate-200">{char.name}</span>
                                    {isInTeam && (
                                        <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-400"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">当前队伍</h3>
                        <div className="space-y-4">
                            {team.map((char, idx) => {
                                if (!char) {
                                    return (
                                        <div key={idx} className="h-16 border border-dashed border-slate-800 rounded bg-slate-900/30 flex items-center justify-center text-slate-600">
                                            <Plus size={16} />
                                        </div>
                                    );
                                }
                                
                                // 计算武器加成后的攻击力
                                let totalAtk = char.stats?.baseAtk || 0;
                                let weaponAtk = 0;
                                if (char.weapon?.id && WEAPONS[char.weapon.id]) {
                                    weaponAtk = getWeaponAtk(char.weapon.id, char.weapon.level || 1);
                                    totalAtk += weaponAtk;
                                }
                                
                                return (
                                <div key={char.id} className="bg-slate-800/50 p-3 rounded border border-slate-700 relative group">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-xs font-bold text-white">{char.name}</span>
                                        <span className="text-[10px] text-slate-400">等级 {char.level}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-300">
                                        <div className="bg-slate-900 px-2 py-1 rounded">
                                            攻击: {Math.round(totalAtk)}
                                            {weaponAtk > 0 && <span className="text-green-400 ml-1">(+{Math.round(weaponAtk)})</span>}
                                        </div>
                                        <div className="bg-slate-900 px-2 py-1 rounded">防御: {Math.round(char.stats?.baseDef || 0)}</div>
                                    </div>

                                    {/* Edit Button */}
                                    <button
                                        onClick={() => setEditingCharId(char.id)}
                                        className="absolute top-2 right-2 p-1 text-slate-500 hover:text-white bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Edit2 size={12} />
                                    </button>
                                </div>
                            );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
