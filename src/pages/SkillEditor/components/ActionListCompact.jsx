import React, { useState } from 'react';
import { ACTION_TYPES } from './ActionEditor';
import { Plus, Trash2, GripVertical } from 'lucide-react';

/**
 * 简化版行为列表组件
 * 仅显示行为类型、索引和 offset，点击选中后在右侧编辑
 */
export function ActionListCompact({
    actions = [],
    selectedIndex,
    onSelect,
    onAdd,
    onRemove,
    onMove
}) {
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    // 拖拽开始
    const handleDragStart = (e, index) => {
        setDragIndex(index);
        e.dataTransfer.effectAllowed = 'move';
    };

    // 拖拽结束
    const handleDragEnd = () => {
        setDragIndex(null);
    };

    // 拖拽悬停
    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (dragIndex === null || dragIndex === index) return;
        
        onMove(dragIndex, index);
        setDragIndex(index);
    };

    return (
        <div className="space-y-2">
            <div className="text-sm font-medium text-white mb-2">技能行为</div>
            
            {/* 行为列表 */}
            {actions.length === 0 ? (
                <div className="text-center py-4 text-neutral-500 text-sm border border-dashed border-neutral-700 rounded">
                    暂无行为
                </div>
            ) : (
                <div className="space-y-1 max-h-48 overflow-y-auto">
                    {actions.map((action, index) => {
                        const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };
                        const isSelected = selectedIndex === index;
                        const isDragging = dragIndex === index;

                        return (
                            <div
                                key={index}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragEnd={handleDragEnd}
                                onDragOver={(e) => handleDragOver(e, index)}
                                onClick={() => onSelect(index)}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer transition-all
                                    ${isSelected 
                                        ? 'bg-[#ffff21]/10 border border-[#ffff21]/50' 
                                        : 'bg-neutral-800/50 border border-transparent hover:bg-neutral-700/50'
                                    }
                                    ${isDragging ? 'opacity-50' : ''}
                                `}
                            >
                                <GripVertical size={12} className="text-neutral-600 cursor-grab flex-shrink-0" />
                                <div className={`w-2 h-2 rounded-full ${config.color} flex-shrink-0`} />
                                <span className={`text-sm flex-1 truncate ${isSelected ? 'text-[#ffff21]' : 'text-neutral-300'}`}>
                                    {config.label}
                                </span>
                                <span className="text-xs text-neutral-500 flex-shrink-0">
                                    @{(action.offset || 0).toFixed(2)}s
                                </span>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onRemove(index);
                                    }}
                                    className="p-0.5 hover:bg-red-500/20 hover:text-red-400 rounded text-neutral-500 transition-colors flex-shrink-0"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* 添加行为按钮 */}
            <div className="relative">
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="w-full flex items-center justify-center gap-1 px-3 py-1.5 border border-dashed border-neutral-700 hover:border-[#ffff21] rounded text-xs text-neutral-400 hover:text-[#ffff21] transition-colors"
                >
                    <Plus size={14} />
                    添加行为
                </button>

                {showAddMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-50 overflow-hidden max-h-48 overflow-y-auto">
                        {Object.entries(ACTION_TYPES).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => {
                                    onAdd(type);
                                    setShowAddMenu(false);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset text-xs text-left transition-all"
                            >
                                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                {config.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
