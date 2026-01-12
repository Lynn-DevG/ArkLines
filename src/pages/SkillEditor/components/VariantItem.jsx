import React, { useState } from 'react';
import { ConditionBuilder } from './ConditionBuilder';
import { ACTION_TYPES } from './ActionEditor';
import { ActionItem } from './ActionItem';
import { ChevronDown, ChevronRight, Trash2, Plus, Copy } from 'lucide-react';
import { createActionTemplate } from '../../../data/skillSchema';

const inputClassName = "w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-500";

export function VariantItem({ variant, index, onChange, onRemove }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showActionsEditor, setShowActionsEditor] = useState(false);
    const [showAddActionMenu, setShowAddActionMenu] = useState(false);

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    // 添加 action 到变体
    const addAction = (type) => {
        const template = createActionTemplate(type);
        const actions = [...(variant.actions || []), template];
        updateField('actions', actions);
        setShowAddActionMenu(false);
    };

    // 更新变体中的 action
    const updateAction = (actionIndex, updates) => {
        const actions = [...(variant.actions || [])];
        actions[actionIndex] = { ...actions[actionIndex], ...updates };
        updateField('actions', actions);
    };

    // 删除变体中的 action
    const removeAction = (actionIndex) => {
        const actions = [...(variant.actions || [])];
        actions.splice(actionIndex, 1);
        updateField('actions', actions);
    };

    return (
        <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800/30">
            {/* 头部 */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50">
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <span className="text-sm font-medium">{variant.name || '未命名变体'}</span>
                    {variant.variantType && (
                        <span className="text-xs text-neutral-300 bg-neutral-700/50 px-1.5 py-0.5 rounded">
                            {variant.variantType}
                        </span>
                    )}
                </button>

                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-900/50 rounded text-red-400"
                    title="删除"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* 内容 */}
            {isExpanded && (
                <div className="p-3 space-y-4 border-t border-neutral-700/50">
                    {/* 基础信息 */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">变体 ID</label>
                            <input
                                type="text"
                                value={variant.id || ''}
                                onChange={(e) => updateField('id', e.target.value)}
                                className={inputClassName}
                                placeholder="v_xxxx"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">变体名称</label>
                            <input
                                type="text"
                                value={variant.name || ''}
                                onChange={(e) => updateField('name', e.target.value)}
                                className={inputClassName}
                                placeholder="变体名称"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">变体类型</label>
                            <input
                                type="text"
                                value={variant.variantType || ''}
                                onChange={(e) => updateField('variantType', e.target.value)}
                                className={inputClassName}
                                placeholder="如: heavy"
                            />
                        </div>
                    </div>

                    {/* 覆盖属性 */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">持续时间</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={variant.duration ?? ''}
                                onChange={(e) => updateField('duration', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className={inputClassName}
                                placeholder="覆盖原值"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">能量获取</label>
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={variant.uspGain ?? ''}
                                onChange={(e) => updateField('uspGain', e.target.value ? parseFloat(e.target.value) : undefined)}
                                className={inputClassName}
                                placeholder="覆盖原值"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">技能类型</label>
                            <input
                                type="text"
                                value={variant.skillType || ''}
                                onChange={(e) => updateField('skillType', e.target.value)}
                                className={inputClassName}
                                placeholder="如: normal_skill"
                            />
                        </div>
                    </div>

                    {/* 触发条件 */}
                    <div>
                        <label className="text-xs text-neutral-500 mb-2 block">触发条件 (必填)</label>
                        <ConditionBuilder
                            conditions={variant.condition || []}
                            onChange={(conditions) => updateField('condition', conditions)}
                            compact
                        />
                    </div>

                    {/* 变体行为 */}
                    <div>
                        <button
                            onClick={() => setShowActionsEditor(!showActionsEditor)}
                            className="flex items-center gap-2 text-xs text-neutral-400 hover:text-neutral-300"
                        >
                            {showActionsEditor ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            变体行为
                            {variant.actions?.length > 0 && (
                                <span className="text-neutral-300">({variant.actions.length})</span>
                            )}
                        </button>

                        {showActionsEditor && (
                            <div className="mt-3 space-y-2">
                                {/* 变体行为列表 */}
                                {variant.actions?.map((action, actionIndex) => (
                                    <ActionItem
                                        key={actionIndex}
                                        action={action}
                                        index={actionIndex}
                                        onChange={(updates) => updateAction(actionIndex, updates)}
                                        onRemove={() => removeAction(actionIndex)}
                                    />
                                ))}

                                {/* 添加行为按钮 */}
                                <div className="relative">
                                    <button
                                        onClick={() => setShowAddActionMenu(!showAddActionMenu)}
                                        className="w-full flex items-center justify-center gap-2 px-3 py-1.5 border border-dashed border-neutral-700 hover:border-neutral-600 rounded text-xs text-neutral-400 hover:text-neutral-300 transition-colors"
                                    >
                                        <Plus size={12} />
                                        添加行为
                                    </button>

                                    {showAddActionMenu && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded shadow-lg z-10 overflow-hidden">
                                            {Object.entries(ACTION_TYPES).map(([type, config]) => (
                                                <button
                                                    key={type}
                                                    onClick={() => addAction(type)}
                                                    className="w-full flex items-center gap-2 px-3 py-2 hover:bg-neutral-700 text-xs text-left"
                                                >
                                                    <div className={`w-2 h-2 rounded ${config.color}`} />
                                                    {config.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
