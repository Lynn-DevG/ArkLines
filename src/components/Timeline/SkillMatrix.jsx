import React from 'react';
import { CHARACTERS } from '../../data/characters';
import { SKILLS, SKILL_TYPES } from '../../data/skills';
import { Zap, Hexagon, Swords, Sparkles } from 'lucide-react';
import { ConstraintValidator } from '../../engine/ConstraintValidator';

export const SkillMatrix = ({ team, selectedTool, onSelectTool }) => {
    return (
        <div className="h-80 border-b border-slate-700 bg-slate-900 p-4 flex flex-col shadow-md z-10 shrink-0">
            <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400 mb-2">
                <Zap size={20} /> 技能面板
            </h2>

            <div className="flex-1 flex gap-4 overflow-x-auto custom-scrollbar">
                {/* Headers */}
                <div className="flex flex-col justify-start w-16 text-right text-xs font-mono text-slate-400 shrink-0 pt-3">
                    <div className="h-6 mb-2"></div> {/* Spacer for Name */}
                    <div className="h-10 mb-2 flex items-center justify-end">终结技</div>
                    <div className="h-10 mb-2 flex items-center justify-end">连携技</div>
                    <div className="h-10 mb-2 flex items-center justify-end">战技</div>
                    <div className="h-10 mb-2 flex items-center justify-end">普攻</div>
                </div>

                <div className="flex-1 grid grid-cols-4 gap-4 min-w-[600px]">
                    {team.map((char, idx) => (
                        <div key={idx} className={`flex flex-col justify-start relative rounded-lg p-2 transition-colors ${char ? 'bg-slate-800/30' : 'bg-slate-800/20 border border-slate-800 border-dashed'}`}>
                            {char ? (
                                <>
                                    <div className="text-center text-xs font-bold text-slate-300 h-6 mb-2 flex items-center justify-center">{char.name}</div>
                                    <div className="mb-2"><SkillButton
                                        charId={char.id}
                                        skillId={char.skills.ultimate}
                                        isActive={selectedTool?.skillId === char.skills.ultimate}
                                        onClick={() => onSelectTool(char.id, char.skills.ultimate)}
                                        icon={<Sparkles size={14} />}
                                    /></div>
                                    <div className="mb-2"><SkillButton
                                        charId={char.id}
                                        skillId={char.skills.chain}
                                        isActive={selectedTool?.skillId === char.skills.chain}
                                        onClick={() => onSelectTool(char.id, char.skills.chain)}
                                        icon={<Hexagon size={14} />}
                                    /></div>
                                    <div className="mb-2"><SkillButton
                                        charId={char.id}
                                        skillId={char.skills.tactical}
                                        isActive={selectedTool?.skillId === char.skills.tactical}
                                        onClick={() => onSelectTool(char.id, char.skills.tactical)}
                                        icon={<Zap size={14} />}
                                    /></div>
                                    <div className="mb-2"><SkillButton
                                        charId={char.id}
                                        skillId={char.skills.basic}
                                        isActive={selectedTool?.skillId === char.skills.basic}
                                        onClick={() => onSelectTool(char.id, char.skills.basic)}
                                        icon={<Swords size={14} />}
                                    /></div>
                                </>
                            ) : (
                                <div className="text-slate-600 text-xs text-center mt-10">空位</div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const SkillButton = ({ charId, skillId, isActive, onClick, icon }) => {
    const skill = SKILLS[skillId];
    if (!skill) return <div className="h-10 bg-transparent"></div>;

    const typeConfig = SKILL_TYPES[skill.type];

    return (
        <button
            onClick={onClick}
            className={`
                h-10 w-full rounded flex items-center justify-center gap-2 text-xs font-bold transition-all border-l-4
                ${isActive ? 'ring-2 ring-white scale-105 shadow-lg' : 'opacity-80 hover:opacity-100'}
                ${typeConfig?.color || 'bg-slate-500'}
                border-white/20 relative group
            `}
            title={skill.name}
        >
            {icon}
            <span className="hidden xl:inline truncate">{skill.name}</span>
        </button>
    );
}
