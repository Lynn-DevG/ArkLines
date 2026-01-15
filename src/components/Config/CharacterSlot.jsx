import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Plus, Edit2, RefreshCw, Crown } from 'lucide-react';
// 使用 Portal 将弹出窗口渲染到 body 层级，避免被父容器遮挡
import { SkillIcon } from '../Timeline/SkillIcon';
import { SKILLS } from '../../data/skills';
import { getCharacterAvatar, SKILL_TYPE_CONFIG } from '../../utils/skillIconUtils';
import { getWeaponAtk, WEAPONS } from '../../data/weapons';
import { CharacterEditor } from './CharacterEditor';
import { CharacterPicker } from './CharacterPicker';

/**
 * 星级显示组件
 */
const RarityStars = ({ rarity }) => {
    const starCount = rarity || 5;
    const starColor = {
        4: 'text-purple-400',
        5: 'text-yellow-400',
        6: 'text-orange-400',
    }[starCount] || 'text-yellow-400';

    return (
        <span className={`text-[10px] ${starColor}`}>
            {'★'.repeat(starCount)}
        </span>
    );
};

/**
 * 角色技能图标组（带标签和名称）
 */
const CharacterSkillIconsWithLabels = ({
    character,
    selectedSkillId,
    onSelectSkill,
    mainCharId,
}) => {
    if (!character) return null;

    const { id: charId, skills, weaponType, nameEn, element: charElement } = character;
    const skillOrder = ['basic', 'tactical', 'chain', 'ultimate'];

    const getSkillElement = (skillId) => {
        const skill = SKILLS[skillId];
        return skill?.element || charElement;
    };

    const getSkillName = (skillId) => {
        const skill = SKILLS[skillId];
        return skill?.name || '';
    };

    return (
        <div className="flex items-start justify-between gap-1 mt-2">
            {skillOrder.map((skillType) => {
                const skillId = skills?.[skillType];
                if (!skillId) return null;

                const isActive = selectedSkillId === skillId;
                const disabled = skillType === 'basic' && mainCharId && charId !== mainCharId;
                const skillName = getSkillName(skillId);
                const typeName = SKILL_TYPE_CONFIG[skillType]?.name || skillType;

                return (
                    <div key={skillType} className="flex flex-col items-center flex-1 min-w-0">
                        {/* 技能类型名称 */}
                        <span className="text-[9px] text-neutral-500 mb-1 truncate w-full text-center">
                            {typeName}
                        </span>
                        {/* 技能图标 */}
                        <SkillIcon
                            charId={charId}
                            skillType={skillType}
                            element={getSkillElement(skillId)}
                            weaponType={weaponType}
                            nameEn={nameEn}
                            size={44}
                            iconScale={0.8}
                            isActive={isActive}
                            disabled={disabled}
                            onClick={() => onSelectSkill(charId, skillId)}
                            title={disabled ? '仅主控角色可放置普攻' : skillName}
                        />
                        {/* 技能名称 */}
                        <span className="text-[9px] text-neutral-400 mt-1 truncate w-full text-center" title={skillName}>
                            {skillName}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};

/**
 * 角色编辑器弹出框包装组件
 */
const CharacterEditorPopup = ({ charId, onClose, position = { top: 100, left: 320 } }) => {
    const popupRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // 计算并调整位置的函数
    const adjustPosition = useCallback(() => {
        if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            let newTop = position.top;
            let newLeft = position.left;
            
            // 如果右侧超出屏幕，则在左侧显示
            if (newLeft + rect.width > windowWidth - 16) {
                newLeft = position.left - rect.width - 16 - 288;
            }
            
            // 如果底部超出屏幕，向上调整
            if (newTop + rect.height > windowHeight - 16) {
                newTop = windowHeight - rect.height - 16;
            }
            
            // 确保不超出顶部
            if (newTop < 16) {
                newTop = 16;
            }
            
            setAdjustedPosition(prev => {
                if (prev.top !== newTop || prev.left !== newLeft) {
                    return { top: newTop, left: newLeft };
                }
                return prev;
            });
        }
    }, [position]);

    // 初始位置调整
    useEffect(() => {
        adjustPosition();
    }, [adjustPosition]);

    // 监听弹出框尺寸变化，动态调整位置
    useEffect(() => {
        if (!popupRef.current) return;
        
        const resizeObserver = new ResizeObserver(() => {
            adjustPosition();
        });
        
        resizeObserver.observe(popupRef.current);
        
        return () => {
            resizeObserver.disconnect();
        };
    }, [adjustPosition]);

    return (
        <>
            {/* 半透明遮罩层 */}
            <div 
                className="fixed inset-0 z-[9997] bg-black/20"
                onClick={onClose}
            />
            {/* 弹出框 - 高度自适应内容，最大不超过屏幕高度 */}
            <div 
                ref={popupRef}
                className="fixed w-80 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-[9998] overflow-hidden flex flex-col"
                style={{ 
                    top: `${adjustedPosition.top}px`, 
                    left: `${adjustedPosition.left}px`,
                    maxHeight: 'calc(100vh - 32px)'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <CharacterEditor 
                    charId={charId} 
                    onClose={onClose} 
                />
            </div>
        </>
    );
};

/**
 * 角色配置槽位组件
 */
export const CharacterSlot = ({
    slotIndex,
    character,
    team,
    actions,
    setTeam,
    replaceActions,
    selectedTool,
    onSelectTool,
    mainCharId,
    setMainCharacter,
}) => {
    const [showPicker, setShowPicker] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ top: 0, left: 0 });
    const slotRef = useRef(null);

    // 计算弹出位置（Picker 和 Editor 共用）
    useEffect(() => {
        if ((showPicker || showEditor) && slotRef.current) {
            const rect = slotRef.current.getBoundingClientRect();
            setPopupPosition({
                top: rect.top,
                left: rect.right + 8, // 在右侧弹出，间距 8px
            });
        }
    }, [showPicker, showEditor]);

    // 处理选择角色
    const handleSelectCharacter = (char) => {
        const oldChar = character;
        // 清理原角色的 actions
        if (oldChar && oldChar.id !== char?.id) {
            replaceActions(actions.filter(a => a.charId !== oldChar.id));
        }
        // 设置新角色到指定位置
        const newTeam = [...team];
        newTeam[slotIndex] = char;
        setTeam(newTeam);
        setShowPicker(false);
    };

    // 处理技能选择
    const handleSelectSkill = (charId, skillId) => {
        if (selectedTool?.skillId === skillId) {
            onSelectTool(null);
        } else {
            onSelectTool({ charId, skillId });
        }
    };

    // 空位状态
    if (!character) {
        return (
            <div className="relative" ref={slotRef}>
                <button
                    onClick={() => setShowPicker(true)}
                    className="w-full h-24 border-2 border-dashed border-neutral-700 rounded-lg bg-neutral-900/30 
                               flex flex-col items-center justify-center text-neutral-500 
                               hover:border-neutral-500 hover:text-neutral-400 hover:bg-neutral-800/30 transition-all"
                >
                    <Plus size={24} className="mb-1" />
                    <span className="text-xs">点击添加角色</span>
                </button>
                
                {/* 角色选择弹出框 - 使用 Portal 渲染到 body */}
                {showPicker && createPortal(
                    <CharacterPicker
                        team={team}
                        onSelect={handleSelectCharacter}
                        onClose={() => setShowPicker(false)}
                        position={popupPosition}
                    />,
                    document.body
                )}
            </div>
        );
    }

    // 计算武器加成后的攻击力
    let totalAtk = character.stats?.baseAtk || 0;
    let weaponAtk = 0;
    if (character.weapon?.id && WEAPONS[character.weapon.id]) {
        weaponAtk = getWeaponAtk(character.weapon.id, character.weapon.level || 1);
        totalAtk += weaponAtk;
    }

    const isMainChar = mainCharId === character.id;
    const avatarSrc = getCharacterAvatar(character.id, character.nameEn);

    // 已配置状态
    return (
        <div className="relative" ref={slotRef}>
            <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 overflow-hidden">
                {/* 顶部行：头像、名称、星级、主控、等级、操作按钮 */}
                <div className="flex items-center gap-2 p-2 border-b border-neutral-700/50">
                    {/* 头像 */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0 border border-neutral-600">
                        <img 
                            src={avatarSrc} 
                            alt={character.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = `<span class="w-full h-full flex items-center justify-center text-lg font-bold text-neutral-300">${character.name[0]}</span>`;
                            }}
                        />
                    </div>
                    
                    {/* 名称和星级 */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className="text-sm font-bold text-white truncate">{character.name}</span>
                            <RarityStars rarity={character.rarity} />
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                            {/* 主控标识 */}
                            {isMainChar ? (
                                <span className="text-[10px] text-amber-400 flex items-center gap-0.5">
                                    <Crown size={10} /> 主控
                                </span>
                            ) : (
                                <button
                                    onClick={() => setMainCharacter(character.id)}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900/70 border border-neutral-700 
                                               text-neutral-400 hover:text-white hover:border-neutral-500 transition-colors"
                                    title="设为主控角色（仅主控可放置普攻）"
                                >
                                    设为主控
                                </button>
                            )}
                            <span className="text-[10px] text-neutral-500">Lv.{character.level}</span>
                        </div>
                    </div>
                    
                    {/* 操作按钮 */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setShowEditor(true)}
                            className="p-1.5 text-neutral-500 hover:text-white bg-neutral-900/50 rounded transition-colors"
                            title="编辑角色"
                        >
                            <Edit2 size={14} />
                        </button>
                        <button
                            onClick={() => setShowPicker(true)}
                            className="p-1.5 text-neutral-500 hover:text-white bg-neutral-900/50 rounded transition-colors"
                            title="更换角色"
                        >
                            <RefreshCw size={14} />
                        </button>
                    </div>
                </div>

                {/* 属性面板 */}
                <div className="grid grid-cols-2 gap-1 p-2 text-[10px]">
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">攻击</span>
                        <span className="text-neutral-200">
                            {Math.round(totalAtk)}
                            {weaponAtk > 0 && <span className="text-green-400 ml-0.5">(+{Math.round(weaponAtk)})</span>}
                        </span>
                    </div>
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">生命</span>
                        <span className="text-neutral-200">{Math.round(character.stats?.baseHp || 0)}</span>
                    </div>
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">力量</span>
                        <span className="text-neutral-200">{Math.round(character.stats?.strength || 0)}</span>
                    </div>
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">敏捷</span>
                        <span className="text-neutral-200">{Math.round(character.stats?.agility || 0)}</span>
                    </div>
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">智识</span>
                        <span className="text-neutral-200">{Math.round(character.stats?.intelligence || 0)}</span>
                    </div>
                    <div className="bg-neutral-900/50 px-2 py-1 rounded flex justify-between">
                        <span className="text-neutral-500">意志</span>
                        <span className="text-neutral-200">{Math.round(character.stats?.willpower || 0)}</span>
                    </div>
                </div>

                {/* 技能图标组 */}
                <div className="px-2 pb-2">
                    <CharacterSkillIconsWithLabels
                        character={character}
                        selectedSkillId={selectedTool?.skillId}
                        onSelectSkill={handleSelectSkill}
                        mainCharId={mainCharId}
                    />
                </div>
            </div>

            {/* 角色选择弹出框 - 使用 Portal 渲染到 body */}
            {showPicker && createPortal(
                <CharacterPicker
                    team={team}
                    onSelect={handleSelectCharacter}
                    onClose={() => setShowPicker(false)}
                    position={popupPosition}
                />,
                document.body
            )}

            {/* 角色编辑器弹窗 - 使用 Portal 渲染到 body */}
            {showEditor && createPortal(
                <CharacterEditorPopup
                    charId={character.id}
                    onClose={() => setShowEditor(false)}
                    position={popupPosition}
                />,
                document.body
            )}
        </div>
    );
};

export default CharacterSlot;
