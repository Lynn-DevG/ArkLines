import React, { useState } from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { ActionItem } from './ActionItem';
import { Plus, GripVertical } from 'lucide-react';

// 行为类型配置
export const ACTION_TYPES = {
    damage: { label: '造成伤害', color: 'bg-red-500' },
    add_stagger: { label: '增加失衡', color: 'bg-orange-500' },
    recover_usp_self: { label: '回复自身能量', color: 'bg-blue-500' },
    recover_usp_team: { label: '回复全队能量', color: 'bg-cyan-500' },
    recover_atb: { label: '回复技力', color: 'bg-green-500' },
    add_buff: { label: '添加 Buff', color: 'bg-purple-500' },
    consume_buff: { label: '消耗 Buff', color: 'bg-pink-500' }
};

export function ActionEditor() {
    const { currentSkill, addAction, updateAction, removeAction, moveAction } = useSkillEditorContext();
    const [showAddMenu, setShowAddMenu] = useState(false);
    const [dragIndex, setDragIndex] = useState(null);

    const actions = currentSkill?.actions || [];

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
        
        moveAction(dragIndex, index);
        setDragIndex(index);
    };

    return (
        <div className="space-y-3">
            {/* 行为列表 */}
            {actions.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                    暂无行为，点击下方按钮添加
                </div>
            ) : (
                <div className="space-y-2">
                    {actions.map((action, index) => (
                        <div
                            key={index}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragEnd={handleDragEnd}
                            onDragOver={(e) => handleDragOver(e, index)}
                            className={`transition-opacity ${dragIndex === index ? 'opacity-50' : ''}`}
                        >
                            <ActionItem
                                action={action}
                                index={index}
                                onChange={(updates) => updateAction(index, updates)}
                                onRemove={() => removeAction(index)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* 添加行为按钮 */}
            <div className="relative">
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-700 hover:border-[#ffff21] rounded-lg text-sm text-neutral-400 hover:text-[#ffff21] transition-colors"
                >
                    <Plus size={16} />
                    添加行为
                </button>

                {showAddMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-50 overflow-hidden max-h-64 overflow-y-auto">
                        {Object.entries(ACTION_TYPES).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => {
                                    addAction(type);
                                    setShowAddMenu(false);
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2.5 hover:ring-2 hover:ring-[#ffff21] hover:ring-inset text-sm text-left transition-all"
                            >
                                <div className={`w-3 h-3 rounded ${config.color}`} />
                                {config.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* 提示 */}
            <p className="text-xs text-neutral-600 text-center">
                拖拽行为可以调整顺序
            </p>
        </div>
    );
}
