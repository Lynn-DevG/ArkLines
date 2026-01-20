import React, { useState } from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { Search, Plus, ChevronDown, ChevronRight, Trash2, Copy, Sword, Zap, Link, Star } from 'lucide-react';

// 技能类型配置
const SKILL_TYPES = {
    BASIC: { label: '普攻', icon: Sword, color: 'text-neutral-400' },
    TACTICAL: { label: '战技', icon: Zap, color: 'text-blue-400' },
    CHAIN: { label: '连携', icon: Link, color: 'text-purple-400' },
    ULTIMATE: { label: '终结', icon: Star, color: 'text-amber-400' }
};

export function SkillList() {
    const {
        skillsByCharacter,
        currentSkillId,
        selectSkill,
        createSkill,
        duplicateSkill,
        deleteSkill,
        filter,
        setFilter
    } = useSkillEditorContext();

    const [expandedChars, setExpandedChars] = useState(new Set(Object.keys(skillsByCharacter)));
    const [showNewSkillMenu, setShowNewSkillMenu] = useState(false);

    // 切换角色展开状态
    const toggleChar = (charKey) => {
        setExpandedChars(prev => {
            const next = new Set(prev);
            if (next.has(charKey)) {
                next.delete(charKey);
            } else {
                next.add(charKey);
            }
            return next;
        });
    };

    // 格式化角色名称
    const formatCharName = (charKey) => {
        if (charKey === 'other') return '其他技能';
        // 从 chr_0003_endminf 提取为 endminf
        const match = charKey.match(/chr_\d+_(.+)/);
        return match ? match[1].toUpperCase() : charKey;
    };

    // 获取技能类型图标
    const SkillTypeIcon = ({ type }) => {
        const config = SKILL_TYPES[type] || SKILL_TYPES.BASIC;
        const Icon = config.icon;
        return <Icon size={12} className={config.color} />;
    };

    // 应用筛选
    const filterSkills = (skills) => {
        return skills.filter(skill => {
            // 搜索过滤
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                if (!skill.name?.toLowerCase().includes(searchLower) &&
                    !skill.id?.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            // 类型过滤
            if (filter.type !== 'all' && skill.type !== filter.type) {
                return false;
            }
            return true;
        });
    };

    return (
        <div className="flex flex-col h-full">
            {/* 搜索栏 */}
            <div className="p-3 border-b border-neutral-800">
                <div className="relative">
                    <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="搜索技能..."
                        value={filter.search}
                        onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full bg-neutral-800 border border-neutral-700 rounded pl-8 pr-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                    />
                </div>
                
                {/* 类型筛选 */}
                <div className="flex gap-1 mt-2">
                    <button
                        onClick={() => setFilter(prev => ({ ...prev, type: 'all' }))}
                        className={`px-2 py-1 text-xs rounded transition-colors
                            ${filter.type === 'all' 
                                ? 'bg-neutral-600 text-white' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-[#ffff21] hover:text-black'}`}
                    >
                        全部
                    </button>
                    {Object.entries(SKILL_TYPES).map(([type, config]) => (
                        <button
                            key={type}
                            onClick={() => setFilter(prev => ({ ...prev, type }))}
                            className={`px-2 py-1 text-xs rounded transition-colors
                                ${filter.type === type 
                                    ? 'bg-neutral-600 text-white' 
                                    : 'bg-neutral-800 text-neutral-400 hover:bg-[#ffff21] hover:text-black'}`}
                        >
                            {config.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 新建按钮 */}
            <div className="p-3 border-b border-neutral-800 relative">
                <button
                    onClick={() => setShowNewSkillMenu(!showNewSkillMenu)}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-600 hover:bg-[#ffff21] hover:text-black rounded text-sm font-medium transition-colors"
                >
                    <Plus size={16} />
                    新建技能
                </button>
                
                {showNewSkillMenu && (
                    <div className="absolute top-full left-3 right-3 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-10">
                        {Object.entries(SKILL_TYPES).map(([type, config]) => {
                            const Icon = config.icon;
                            return (
                                <button
                                    key={type}
                                    onClick={() => {
                                        createSkill(type);
                                        setShowNewSkillMenu(false);
                                    }}
                                    className="w-full flex items-center gap-2 px-3 py-2 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset text-sm text-left transition-all"
                                >
                                    <Icon size={14} className={config.color} />
                                    {config.label}
                                </button>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* 技能列表 */}
            <div className="flex-1 overflow-y-auto">
                {Object.entries(skillsByCharacter).map(([charKey, skills]) => {
                    const filteredSkills = filterSkills(skills);
                    if (filteredSkills.length === 0) return null;
                    
                    const isExpanded = expandedChars.has(charKey);
                    
                    return (
                        <div key={charKey} className="border-b border-neutral-800/50">
                            {/* 角色分组头 */}
                            <button
                                onClick={() => toggleChar(charKey)}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset text-sm font-medium text-neutral-300 transition-all"
                            >
                                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                <span>{formatCharName(charKey)}</span>
                                <span className="text-xs text-neutral-500 ml-auto">{filteredSkills.length}</span>
                            </button>
                            
                            {/* 技能列表 */}
                            {isExpanded && (
                                <div className="pb-1">
                                    {filteredSkills.map(skill => (
                                        <SkillListItem
                                            key={skill.id}
                                            skill={skill}
                                            isSelected={skill.id === currentSkillId}
                                            onSelect={() => selectSkill(skill.id)}
                                            onDuplicate={() => duplicateSkill(skill.id)}
                                            onDelete={() => deleteSkill(skill.id)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* 统计信息 */}
            <div className="p-3 border-t border-neutral-800 text-xs text-neutral-500">
                共 {Object.values(skillsByCharacter).flat().length} 个技能
            </div>
        </div>
    );
}

// 技能列表项组件
function SkillListItem({ skill, isSelected, onSelect, onDuplicate, onDelete }) {
    const [showActions, setShowActions] = useState(false);
    const config = SKILL_TYPES[skill.type] || SKILL_TYPES.BASIC;
    const Icon = config.icon;

    return (
        <div
            className={`group relative mx-2 mb-0.5 rounded transition-all cursor-pointer
                ${isSelected 
                    ? 'bg-neutral-600/20 border border-neutral-500/50' 
                    : 'hover:ring-2 hover:ring-[#ffff21] border border-transparent'}`}
            onClick={onSelect}
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="flex items-center gap-2 px-2 py-1.5">
                <Icon size={12} className={config.color} />
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-white truncate">{skill.name}</div>
                    <div className="text-[10px] text-neutral-500 truncate">{skill.id}</div>
                </div>
                
                {/* 操作按钮 */}
                {showActions && (
                    <div className="flex items-center gap-1">
<button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onDuplicate();
                                            }}
                                            className="p-1 hover:bg-[#ffff21] hover:text-black rounded transition-colors"
                                            title="复制"
                                        >
                                            <Copy size={12} className="text-neutral-400 hover:text-black" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                if (confirm('确定要删除这个技能吗？')) {
                                    onDelete();
                                }
                            }}
                            className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors"
                            title="删除"
                        >
                            <Trash2 size={12} className="text-red-400 hover:text-white" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
