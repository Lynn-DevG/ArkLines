import React, { useState, useMemo } from 'react';
import { BUFFS } from '../../../data/buffs';
import { ChevronDown, Search } from 'lucide-react';

// Buff 类型分组
const BUFF_CATEGORIES = {
    ATTACHMENT: { label: '法术附着', color: 'text-cyan-400' },
    ANOMALY: { label: '法术异常', color: 'text-purple-400' },
    PHYSICAL_ANOMALY: { label: '物理异常', color: 'text-orange-400' },
    DEBUFF: { label: '减益状态', color: 'text-red-400' },
    STUN: { label: '控制状态', color: 'text-yellow-400' },
    NAMED_BUFF: { label: '具名增益', color: 'text-green-400' },
    NAMED_DEBUFF: { label: '具名减益', color: 'text-pink-400' },
    CHARACTER_BUFF: { label: '角色专属', color: 'text-neutral-300' },
    AFFIX: { label: '词缀效果', color: 'text-neutral-400' }
};

export function BuffSelector({ value, onChange }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');

    // 当前选中的 Buff
    const selectedBuff = BUFFS[value];

    // 按类型分组的 Buff 列表
    const groupedBuffs = useMemo(() => {
        const groups = {};
        
        Object.entries(BUFFS).forEach(([id, buff]) => {
            const type = buff.type || 'OTHER';
            if (!groups[type]) {
                groups[type] = [];
            }
            
            // 搜索过滤
            if (search) {
                const searchLower = search.toLowerCase();
                if (!buff.name?.toLowerCase().includes(searchLower) &&
                    !id.toLowerCase().includes(searchLower)) {
                    return;
                }
            }
            
            groups[type].push({ id, ...buff });
        });

        return groups;
    }, [search]);

    return (
        <div className="relative">
            {/* 选择按钮 */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white hover:border-[#ffff21] focus:outline-none focus:border-[#ffff21] transition-colors"
            >
                {selectedBuff ? (
                    <span className="truncate">{selectedBuff.name}</span>
                ) : value ? (
                    <span className="truncate text-neutral-400">{value}</span>
                ) : (
                    <span className="text-neutral-500">选择 Buff...</span>
                )}
                <ChevronDown size={14} className="text-neutral-500 shrink-0" />
            </button>

            {/* 下拉菜单 */}
            {isOpen && (
                <>
                    {/* 遮罩层 */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    
                    {/* 下拉内容 */}
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-xl z-20 max-h-80 overflow-hidden flex flex-col">
                        {/* 搜索框 */}
                        <div className="p-2 border-b border-neutral-700">
                            <div className="relative">
                                <Search size={12} className="absolute left-2 top-1/2 -translate-y-1/2 text-neutral-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="搜索 Buff..."
                                    className="w-full bg-neutral-900 border border-neutral-700 rounded pl-7 pr-2 py-1 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#ffff21]"
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Buff 列表 */}
                        <div className="flex-1 overflow-y-auto">
                            {/* 清除选择 */}
                            <button
                                onClick={() => {
                                    onChange('');
                                    setIsOpen(false);
                                }}
                                className="w-full px-3 py-2 text-left text-xs text-neutral-500 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset transition-all"
                            >
                                清除选择
                            </button>

                            {/* 自定义输入 */}
                            {search && !BUFFS[search] && (
                                <button
                                    onClick={() => {
                                        onChange(search);
                                        setIsOpen(false);
                                    }}
                                    className="w-full px-3 py-2 text-left text-xs text-neutral-300 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset border-b border-neutral-700 transition-all"
                                >
                                    使用自定义 ID: {search}
                                </button>
                            )}

                            {/* 分组列表 */}
                            {Object.entries(groupedBuffs).map(([type, buffs]) => {
                                if (buffs.length === 0) return null;
                                const category = BUFF_CATEGORIES[type] || { label: type, color: 'text-slate-400' };

                                return (
                                    <div key={type}>
                                        <div className={`px-3 py-1.5 text-[10px] font-medium ${category.color} bg-neutral-900/50 sticky top-0`}>
                                            {category.label}
                                        </div>
                                        {buffs.map(buff => (
                                            <button
                                                key={buff.id}
                                                onClick={() => {
                                                    onChange(buff.id);
                                                    setIsOpen(false);
                                                }}
                                                className={`w-full px-3 py-1.5 text-left text-xs hover:ring-2 hover:ring-[#ffff21] hover:ring-inset flex items-center justify-between transition-all
                                                    ${value === buff.id ? 'bg-neutral-600/20 text-neutral-300' : 'text-white'}`}
                                            >
                                                <span>{buff.name}</span>
                                                <span className="text-neutral-500 text-[10px]">{buff.id}</span>
                                            </button>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
