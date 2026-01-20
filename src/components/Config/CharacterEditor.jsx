import React, { useState, useEffect, useMemo } from 'react';
import { useSimulation } from '../../store/SimulationContext';
import { ChevronLeft, Save, Sword, ChevronDown } from 'lucide-react';
import { getCharacterStatsAtLevel, getCharacterStatsWithWeapon } from '../../data/characters';
import { SKILLS } from '../../data/skills';
import { getWeaponsByType, getWeaponAtk, getWeaponAttrBonus, WEAPONS, WEAPON_TYPE_NAMES, WEAPON_TYPE_REVERSE_MAP } from '../../data/weapons';
import { SkillIcon } from '../Timeline/SkillIcon';

// 稀有度星级颜色
const RARITY_COLORS = {
    3: 'text-blue-400',
    4: 'text-purple-400',
    5: 'text-yellow-400',
    6: 'text-orange-400'
};

const RARITY_BG = {
    3: 'bg-blue-500/10 border-blue-500/30',
    4: 'bg-purple-500/10 border-purple-500/30',
    5: 'bg-yellow-500/10 border-yellow-500/30',
    6: 'bg-orange-500/10 border-orange-500/30'
};

export const CharacterEditor = ({ charId, onClose }) => {
    const { team, updateCharacter } = useSimulation();
    const char = team.find(c => c?.id === charId);

    const [localState, setLocalState] = useState(null);
    const [weaponDropdownOpen, setWeaponDropdownOpen] = useState(false);

    useEffect(() => {
        if (char) {
            const cloned = JSON.parse(JSON.stringify(char));
            // 初始化每槽位技能等级（兼容旧字段 skillLevel）
            const legacyLevel = Number(cloned.skillLevel || 1);
            const safeLegacyLevel = Number.isFinite(legacyLevel) ? legacyLevel : 1;
            const existing = cloned.skillLevelsBySlot || {};
            cloned.skillLevelsBySlot = {
                basic: existing.basic ?? safeLegacyLevel,
                tactical: existing.tactical ?? safeLegacyLevel,
                chain: existing.chain ?? safeLegacyLevel,
                ultimate: existing.ultimate ?? safeLegacyLevel
            };
            setLocalState(cloned);
        }
    }, [char]);

    // 获取当前角色可用的武器列表
    const availableWeapons = useMemo(() => {
        if (!localState) return [];
        return getWeaponsByType(localState.weaponType);
    }, [localState?.weaponType]);

    // 当前选择的武器信息
    const currentWeapon = useMemo(() => {
        if (!localState?.weapon?.id) return null;
        return WEAPONS[localState.weapon.id];
    }, [localState?.weapon?.id]);

    // 武器是否有次要属性
    const hasSubAttr = useMemo(() => {
        return currentWeapon?.subAttrId != null;
    }, [currentWeapon]);

    // 武器属性加成（使用独立的主/次属性等级）
    const weaponBonus = useMemo(() => {
        if (!localState?.weapon?.id) return null;
        return getWeaponAttrBonus(
            localState.weapon.id,
            localState.weapon.mainAttrLevel || 1,
            localState.weapon.subAttrLevel || 1,
            localState.mainAttr
        );
    }, [localState?.weapon?.id, localState?.weapon?.mainAttrLevel, localState?.weapon?.subAttrLevel, localState?.mainAttr]);

    // 武器攻击力
    const weaponAtk = useMemo(() => {
        if (!localState?.weapon?.id) return 0;
        return getWeaponAtk(localState.weapon.id, localState.weapon.level || 1);
    }, [localState?.weapon?.id, localState?.weapon?.level]);

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

    const handleWeaponSelect = (weaponId) => {
        if (weaponId === null) {
            // 卸下武器
            setLocalState(prev => ({
                ...prev,
                weapon: null
            }));
        } else {
            setLocalState(prev => ({
                ...prev,
                weapon: {
                    id: weaponId,
                    level: prev.weapon?.level || 1,
                    mainAttrLevel: prev.weapon?.mainAttrLevel || 1,
                    subAttrLevel: prev.weapon?.subAttrLevel || 1
                }
            }));
        }
        setWeaponDropdownOpen(false);
    };

    const handleWeaponLevelChange = (newLevel) => {
        setLocalState(prev => ({
            ...prev,
            weapon: {
                ...prev.weapon,
                level: newLevel
            }
        }));
    };

    const handleMainAttrLevelChange = (newLevel) => {
        setLocalState(prev => ({
            ...prev,
            weapon: {
                ...prev.weapon,
                mainAttrLevel: newLevel
            }
        }));
    };

    const handleSubAttrLevelChange = (newLevel) => {
        setLocalState(prev => ({
            ...prev,
            weapon: {
                ...prev.weapon,
                subAttrLevel: newLevel
            }
        }));
    };

    const handleSave = () => {
        updateCharacter(char.id, localState);
        onClose();
    };
    
    const handleSkillLevelChange = (slot, newLevel) => {
        setLocalState(prev => ({
            ...prev,
            skillLevelsBySlot: {
                ...(prev.skillLevelsBySlot || {}),
                [slot]: newLevel
            }
        }));
    };

    // 格式化属性加成显示
    const formatAttrBonus = (attr) => {
        if (!attr) return null;
        const { type, value, displayName } = attr;
        
        // 判断是百分比还是固定值
        const isPercent = ['atkPercent', 'hpPercent', 'physicalDamage', 'magicDamage', 
            'fireDamage', 'iceDamage', 'electricDamage', 'natureDamage', 
            'critRate', 'ultimateChargeRate', 'healEfficiency'].includes(type);
        
        if (isPercent) {
            return `${displayName}: +${(value * 100).toFixed(1)}%`;
        }
        return `${displayName}: +${Math.round(value)}`;
    };

    // 武器类型中文名
    const weaponTypeName = WEAPON_TYPE_NAMES[WEAPON_TYPE_REVERSE_MAP[localState.weaponType]] || localState.weaponType;

    // 获取技能元素
    const getSkillElement = (skillId) => {
        const skill = SKILLS[skillId];
        return skill?.element || localState.element;
    };

    return (
        <div className="flex flex-col bg-neutral-900 max-h-full">
            {/* 标题栏 - 固定在顶部 */}
            <div className="flex items-center justify-between p-4 pb-2 border-b border-neutral-700 shrink-0">
                <button onClick={onClose} className="text-neutral-400 hover:text-[#ffff21] flex items-center text-xs transition-colors">
                    <ChevronLeft size={16} /> 返回
                </button>
                <div className="text-sm font-bold text-white">{localState.name}</div>
                <button onClick={handleSave} className="text-neutral-300 hover:text-[#ffff21] flex items-center text-xs gap-1 transition-colors">
                    <Save size={14} /> 保存
                </button>
            </div>

            {/* 内容区域 - 自适应高度，超出时可滚动 */}
            <div className="flex-1 overflow-y-auto p-4 pt-3 space-y-3 custom-scrollbar">
                {/* ===== 第一部分：角色等级和属性 ===== */}
                <div className="bg-neutral-800/30 rounded-lg p-3">
                    {/* 等级控制 */}
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-xs text-neutral-500 w-10">等级</span>
                        <input
                            type="range" min="1" max="99"
                            value={localState.level}
                            onChange={(e) => handleLevelChange(parseInt(e.target.value))}
                            className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="text-white font-mono w-8 text-right text-sm">{localState.level}</span>
                    </div>
                    
                    {/* 攻击和生命 */}
                    <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                        <div className="bg-neutral-900/50 px-3 py-1.5 rounded flex justify-between">
                            <span className="text-neutral-500">攻击</span>
                            <span className="text-white">
                                {Math.round(localState.stats.baseAtk)}
                                {weaponAtk > 0 && <span className="text-amber-400 ml-1">+{weaponAtk}</span>}
                            </span>
                        </div>
                        <div className="bg-neutral-900/50 px-3 py-1.5 rounded flex justify-between">
                            <span className="text-neutral-500">生命</span>
                            <span className="text-white">{Math.round(localState.stats.baseHp)}</span>
                        </div>
                    </div>
                    
                    {/* 分割线 */}
                    <div className="border-t border-neutral-700/50 my-2"></div>
                    
                    {/* 四维属性 */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        {[
                            { key: 'strength', label: '力量' },
                            { key: 'agility', label: '敏捷' },
                            { key: 'intelligence', label: '智识' },
                            { key: 'willpower', label: '意志' }
                        ].map(({ key: attr, label }) => {
                            const isMain = localState.mainAttr === attr;
                            const isSub = localState.subAttr === attr;
                            let weaponAttrBonus = 0;
                            if (weaponBonus?.mainAttr) {
                                const mainType = weaponBonus.mainAttr.type;
                                if (mainType === attr || (mainType === 'mainAttr' && isMain)) {
                                    weaponAttrBonus = weaponBonus.mainAttr.value;
                                }
                            }
                            
                            // 背景和边框样式
                            let bgClass = 'bg-neutral-900/50';
                            let borderClass = '';
                            if (isMain) {
                                bgClass = 'bg-yellow-500/10';
                                borderClass = 'border border-yellow-500/30';
                            } else if (isSub) {
                                bgClass = 'bg-neutral-400/10';
                                borderClass = 'border border-neutral-500/30';
                            }
                            
                            return (
                                <div key={attr} className={`px-3 py-1.5 rounded flex justify-between ${bgClass} ${borderClass}`}>
                                    <span className={isMain ? 'text-yellow-400 font-semibold' : isSub ? 'text-neutral-300' : 'text-neutral-500'}>
                                        {label}
                                    </span>
                                    <span className="text-white">
                                        {Math.round(localState.stats[attr] || 0)}
                                        {weaponAttrBonus > 0 && <span className="text-green-400 ml-1">+{Math.round(weaponAttrBonus)}</span>}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ===== 第二部分：武器编辑 ===== */}
                <div className="bg-neutral-800/30 rounded-lg p-3">
                    <div className="flex items-center gap-1.5 mb-2">
                        <Sword size={12} className="text-neutral-500" />
                        <span className="text-xs text-neutral-500 font-bold">武器</span>
                        <span className="text-xs text-neutral-600">({weaponTypeName})</span>
                    </div>
                    
                    {/* 武器选择器 */}
                    <div className="relative mb-2">
                        <button
                            onClick={() => setWeaponDropdownOpen(!weaponDropdownOpen)}
                            className={`w-full p-2 rounded border text-left text-xs flex items-center justify-between
                                ${currentWeapon 
                                    ? `${RARITY_BG[currentWeapon.rarity]}` 
                                    : 'bg-neutral-800 border-neutral-700'}`}
                        >
                            {currentWeapon ? (
                                <span className={RARITY_COLORS[currentWeapon.rarity]}>
                                    {'★'.repeat(currentWeapon.rarity)} {currentWeapon.name}
                                </span>
                            ) : (
                                <span className="text-neutral-500">未装备武器</span>
                            )}
                            <ChevronDown size={14} className={`text-neutral-400 transition-transform ${weaponDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {weaponDropdownOpen && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-20 max-h-40 overflow-y-auto custom-scrollbar">
                                <button
                                    onClick={() => handleWeaponSelect(null)}
                                    className="w-full p-2 text-left text-xs text-neutral-500 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset transition-all"
                                >
                                    卸下武器
                                </button>
                                {availableWeapons.map(weapon => (
                                    <button
                                        key={weapon.id}
                                        onClick={() => handleWeaponSelect(weapon.id)}
                                        className={`w-full p-2 text-left text-xs hover:ring-2 hover:ring-[#ffff21] hover:ring-inset transition-all
                                            ${localState.weapon?.id === weapon.id ? 'bg-neutral-700' : ''}`}
                                    >
                                        <span className={RARITY_COLORS[weapon.rarity]}>
                                            {'★'.repeat(weapon.rarity)} {weapon.name}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 武器等级和属性调节 */}
                    {currentWeapon && localState.weapon && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-neutral-500 w-16">武器等级</span>
                                <input
                                    type="range" min="1" max="99"
                                    value={localState.weapon.level || 1}
                                    onChange={(e) => handleWeaponLevelChange(parseInt(e.target.value))}
                                    className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className="text-white font-mono w-8 text-right text-xs">{localState.weapon.level || 1}</span>
                            </div>

                            {weaponBonus?.mainAttr && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-500 w-16 truncate" title={weaponBonus.mainAttr.displayName}>
                                        {weaponBonus.mainAttr.displayName.replace('提升', '').replace('·', '')}
                                    </span>
                                    <input
                                        type="range" min="1" max="9"
                                        value={localState.weapon.mainAttrLevel || 1}
                                        onChange={(e) => handleMainAttrLevelChange(parseInt(e.target.value))}
                                        className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                    />
                                    <span className="text-green-400 font-mono w-8 text-right text-xs">{localState.weapon.mainAttrLevel || 1}</span>
                                </div>
                            )}

                            {hasSubAttr && weaponBonus?.subAttr && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-neutral-500 w-16 truncate" title={weaponBonus.subAttr.displayName}>
                                        {weaponBonus.subAttr.displayName.replace('提升', '').replace('·', '')}
                                    </span>
                                    <input
                                        type="range" min="1" max="9"
                                        value={localState.weapon.subAttrLevel || 1}
                                        onChange={(e) => handleSubAttrLevelChange(parseInt(e.target.value))}
                                        className="flex-1 h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                    />
                                    <span className="text-cyan-400 font-mono w-8 text-right text-xs">{localState.weapon.subAttrLevel || 1}</span>
                                </div>
                            )}

                            {/* 武器加成显示 */}
                            <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 pt-2 border-t border-neutral-700/50">
                                <span>攻击 <span className="text-amber-400">+{weaponAtk}</span></span>
                                {weaponBonus?.mainAttr && (
                                    <span>{weaponBonus.mainAttr.displayName} <span className="text-green-400">+{Math.round(weaponBonus.mainAttr.value)}</span></span>
                                )}
                                {weaponBonus?.subAttr && (
                                    <span>{weaponBonus.subAttr.displayName} <span className="text-cyan-400">
                                        {['atkPercent', 'hpPercent', 'physicalDamage', 'magicDamage', 
                                          'fireDamage', 'iceDamage', 'electricDamage', 'natureDamage', 
                                          'critRate', 'ultimateChargeRate', 'healEfficiency'].includes(weaponBonus.subAttr.type)
                                            ? `+${(weaponBonus.subAttr.value * 100).toFixed(1)}%`
                                            : `+${Math.round(weaponBonus.subAttr.value)}`
                                        }
                                    </span></span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* ===== 第三部分：技能等级编辑 ===== */}
                <div className="bg-neutral-800/30 rounded-lg p-3">
                    <div className="text-xs text-neutral-500 font-bold mb-2">技能等级</div>
                    <div className="space-y-2">
                        {[
                            { slot: 'basic', label: '普攻', skillId: localState.skills?.basic },
                            { slot: 'tactical', label: '战技', skillId: localState.skills?.tactical },
                            { slot: 'chain', label: '连携', skillId: localState.skills?.chain },
                            { slot: 'ultimate', label: '终结', skillId: localState.skills?.ultimate }
                        ].map(({ slot, label, skillId }) => {
                            const skillData = SKILLS?.[skillId];
                            const name = skillData?.name || '';
                            const level = localState.skillLevelsBySlot?.[slot] ?? localState.skillLevel ?? 1;
                            return (
                                <div key={slot} className="flex items-center gap-2">
                                    {/* 技能图标 */}
                                    <SkillIcon
                                        charId={localState.id}
                                        skillType={slot}
                                        element={getSkillElement(skillId)}
                                        weaponType={localState.weaponType}
                                        nameEn={localState.nameEn}
                                        size={32}
                                        iconScale={0.8}
                                        isActive={false}
                                        disabled={false}
                                        onClick={() => {}}
                                        title={name}
                                    />
                                    {/* 技能名称和等级 */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-neutral-300 truncate" title={name}>
                                                {name || label}
                                            </span>
                                            <span className="text-xs font-mono text-white ml-1">Lv.{level}</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="1"
                                            max="12"
                                            value={level}
                                            onChange={(e) => handleSkillLevelChange(slot, parseInt(e.target.value))}
                                            className="w-full h-1.5 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};
