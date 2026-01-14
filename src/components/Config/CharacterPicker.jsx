import React, { useState, useMemo, useEffect, useRef } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { CHARACTERS } from '../../data/characters';
import { getCharacterAvatar } from '../../utils/skillIconUtils';

/**
 * 职业类型映射
 */
const CLASS_TYPE_MAP = {
    'Guard': '近卫',
    'Caster': '术师',
    'Vanguard': '先锋',
    'Defender': '重装',
    'Supporter': '辅助',
    'Striker': '突击',
};

/**
 * 属性类型映射
 */
const ELEMENT_MAP = {
    'physical': '物理',
    'electric': '电磁',
    'fire': '灼热',
    'ice': '寒冷',
    'nature': '自然',
};

/**
 * 星级颜色
 */
const RARITY_COLORS = {
    4: 'text-purple-400',
    5: 'text-yellow-400',
    6: 'text-orange-400',
};

/**
 * 下拉选择器组件
 */
const FilterDropdown = ({ label, value, options, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label || '全部';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 px-2 py-1 bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 hover:border-neutral-500 transition-colors"
            >
                <span className="text-neutral-500">{label}:</span>
                <span>{selectedLabel}</span>
                <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isOpen && (
                <div className="absolute top-full left-0 mt-1 w-32 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-10 max-h-48 overflow-y-auto">
                    {options.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-1.5 text-left text-xs hover:bg-neutral-700 transition-colors ${
                                value === opt.value ? 'bg-neutral-700 text-white' : 'text-neutral-300'
                            }`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

/**
 * 角色列表项
 */
const CharacterItem = ({ char, isInTeam, onSelect }) => {
    const avatarSrc = getCharacterAvatar(char.id, char.nameEn);
    const starColor = RARITY_COLORS[char.rarity] || 'text-yellow-400';

    return (
        <button
            onClick={() => !isInTeam && onSelect(char)}
            disabled={isInTeam}
            className={`w-full flex items-center gap-2 p-2 rounded transition-colors ${
                isInTeam 
                    ? 'opacity-40 cursor-not-allowed bg-neutral-800/30' 
                    : 'hover:bg-neutral-700/50 cursor-pointer'
            }`}
        >
            {/* 头像 */}
            <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-700 flex-shrink-0 border border-neutral-600">
                <img 
                    src={avatarSrc} 
                    alt={char.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="w-full h-full flex items-center justify-center text-sm font-bold text-neutral-300">${char.name[0]}</span>`;
                    }}
                />
            </div>
            
            {/* 名称和星级 */}
            <div className="flex-1 text-left min-w-0">
                <div className="text-xs font-medium text-neutral-200 truncate">{char.name}</div>
                <div className="flex items-center gap-1">
                    <span className={`text-[10px] ${starColor}`}>{'★'.repeat(char.rarity || 5)}</span>
                    <span className="text-[10px] text-neutral-500">{CLASS_TYPE_MAP[char.classType] || char.classType}</span>
                </div>
            </div>
            
            {/* 已在队伍标识 */}
            {isInTeam && (
                <span className="text-[10px] text-neutral-500">已选</span>
            )}
        </button>
    );
};

/**
 * 角色选择弹出框组件
 */
export const CharacterPicker = ({ team, onSelect, onClose, position = { top: 100, left: 320 } }) => {
    const [classFilter, setClassFilter] = useState('');
    const [elementFilter, setElementFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');
    const pickerRef = useRef(null);
    const [adjustedPosition, setAdjustedPosition] = useState(position);

    // 调整位置确保不超出屏幕
    useEffect(() => {
        if (pickerRef.current) {
            const rect = pickerRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            
            let newTop = position.top;
            let newLeft = position.left;
            
            // 如果右侧超出屏幕，则在左侧显示
            if (newLeft + rect.width > windowWidth - 16) {
                newLeft = position.left - rect.width - 16 - 288; // 在左侧显示
            }
            
            // 如果底部超出屏幕，向上调整
            if (newTop + rect.height > windowHeight - 16) {
                newTop = windowHeight - rect.height - 16;
            }
            
            // 确保不超出顶部
            if (newTop < 16) {
                newTop = 16;
            }
            
            setAdjustedPosition({ top: newTop, left: newLeft });
        }
    }, [position]);

    // 收集所有可用标签
    const allTags = useMemo(() => {
        const tagSet = new Set();
        CHARACTERS.forEach(char => {
            if (char.tags && Array.isArray(char.tags)) {
                char.tags.forEach(tag => tagSet.add(tag));
            }
        });
        return Array.from(tagSet).sort();
    }, []);

    // 职业选项
    const classOptions = [
        { value: '', label: '全部' },
        ...Object.entries(CLASS_TYPE_MAP).map(([value, label]) => ({ value, label }))
    ];

    // 属性选项
    const elementOptions = [
        { value: '', label: '全部' },
        ...Object.entries(ELEMENT_MAP).map(([value, label]) => ({ value, label }))
    ];

    // 标签选项
    const tagOptions = [
        { value: '', label: '全部' },
        ...allTags.map(tag => ({ value: tag, label: tag }))
    ];

    // 筛选角色列表
    const filteredCharacters = useMemo(() => {
        return CHARACTERS.filter(char => {
            // 职业筛选
            if (classFilter && char.classType !== classFilter) return false;
            // 属性筛选
            if (elementFilter && char.element !== elementFilter) return false;
            // 标签筛选
            if (tagFilter && (!char.tags || !char.tags.includes(tagFilter))) return false;
            return true;
        });
    }, [classFilter, elementFilter, tagFilter]);

    // 检查角色是否已在队伍中
    const isInTeam = (charId) => team.some(c => c?.id === charId);

    return (
        <>
            {/* 半透明遮罩层 */}
            <div 
                className="fixed inset-0 z-[9997] bg-black/20"
                onClick={onClose}
            />
            {/* 弹出框 */}
            <div 
                ref={pickerRef}
                className="fixed w-72 bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl z-[9998]"
                style={{ 
                    top: `${adjustedPosition.top}px`, 
                    left: `${adjustedPosition.left}px`,
                    maxHeight: '520px' 
                }}
                onClick={(e) => e.stopPropagation()}
            >
            {/* 标题栏 */}
            <div className="flex items-center justify-between p-3 border-b border-neutral-700">
                <span className="text-sm font-medium text-neutral-200">选择角色</span>
                <button
                    onClick={onClose}
                    className="p-1 text-neutral-500 hover:text-white transition-colors"
                >
                    <X size={16} />
                </button>
            </div>

            {/* 筛选栏 */}
            <div className="flex flex-wrap gap-2 p-2 border-b border-neutral-700/50">
                <FilterDropdown
                    label="职业"
                    value={classFilter}
                    options={classOptions}
                    onChange={setClassFilter}
                />
                <FilterDropdown
                    label="属性"
                    value={elementFilter}
                    options={elementOptions}
                    onChange={setElementFilter}
                />
                <FilterDropdown
                    label="标签"
                    value={tagFilter}
                    options={tagOptions}
                    onChange={setTagFilter}
                />
            </div>

            {/* 角色列表 */}
            <div className="overflow-y-auto p-1" style={{ maxHeight: '340px' }}>
                {filteredCharacters.length === 0 ? (
                    <div className="p-4 text-center text-neutral-500 text-xs">
                        没有符合条件的角色
                    </div>
                ) : (
                    filteredCharacters.map(char => (
                        <CharacterItem
                            key={char.id}
                            char={char}
                            isInTeam={isInTeam(char.id)}
                            onSelect={onSelect}
                        />
                    ))
                )}
            </div>

            {/* 底部信息 */}
            <div className="p-2 border-t border-neutral-700/50 text-center">
                <span className="text-[10px] text-neutral-500">
                    共 {filteredCharacters.length} 个角色
                </span>
            </div>
        </div>
        </>
    );
};

export default CharacterPicker;
