import React from 'react';
import { SKILLS } from '../../data/skills';
import { Zap } from 'lucide-react';
import { CharacterSkillIcons } from './SkillIcon';

/**
 * 技能面板组件
 * 显示队伍中每个角色的技能图标
 * 
 * 布局：
 * - 每个角色一行，显示角色名 + 4个技能图标（横向排列）
 * - 技能顺序：普攻、战技、连携技、终结技
 */
export const SkillMatrix = ({ team, selectedTool, onSelectTool, mainCharId }) => {
    // 获取当前选中的技能ID
    const selectedSkillId = selectedTool?.skillId;

    // 处理技能选择
    const handleSelectSkill = (charId, skillId) => {
        onSelectTool(charId, skillId);
    };

    // 获取技能名称用于显示
    const getSkillName = (skillId) => {
        const skill = SKILLS[skillId];
        return skill?.name || '';
    };

    return (
        <div className="border-b border-neutral-700 bg-neutral-900 p-4 flex flex-col shadow-md z-10 shrink-0">
            <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300 mb-4">
                <Zap size={20} /> 技能面板
            </h2>

            <div className="flex flex-col gap-4">
                {/* 技能类型标签行 - 宽度需要与图标尺寸(size)+间距(gap)匹配 */}
                <div className="flex items-center gap-2 ml-24">
                    <div className="w-[64px] text-center text-xs text-neutral-500">普攻</div>
                    <div className="w-[64px] text-center text-xs text-neutral-500">战技</div>
                    <div className="w-[64px] text-center text-xs text-neutral-500">连携技</div>
                    <div className="w-[64px] text-center text-xs text-neutral-500">终结技</div>
                </div>

                {/* 角色技能行 */}
                {team.map((char, idx) => (
                    <div 
                        key={idx} 
                        className={`
                            flex items-center gap-4 rounded-lg p-2 transition-colors
                            ${char ? 'bg-neutral-800/30' : 'bg-neutral-800/20 border border-neutral-800 border-dashed'}
                        `}
                    >
                        {char ? (
                            <>
                                {/* 角色名称 */}
                                <div className="w-20 text-sm font-bold text-neutral-300 text-center shrink-0">
                                    {char.name}
                                </div>
                                
                                {/* 技能图标组 
                                    - size: 图标整体尺寸
                                    - iconScale: 内部图标缩放比例 (0.65 = 65%填充, 1 = 100%填充)
                                    - gap: 图标间距
                                */}
                                <CharacterSkillIcons
                                    character={char}
                                    selectedSkillId={selectedSkillId}
                                    onSelectSkill={handleSelectSkill}
                                    mainCharId={mainCharId}
                                    size={64}
                                    iconScale={0.8}
                                    gap={8}
                                />

                                {/* 选中技能名称显示 */}
                                {selectedTool?.charId === char.id && selectedSkillId && (
                                    <div className="ml-4 text-sm text-neutral-400 truncate">
                                        {getSkillName(selectedSkillId)}
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-neutral-600 text-xs text-center flex-1 py-6">
                                空位 {idx + 1}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
