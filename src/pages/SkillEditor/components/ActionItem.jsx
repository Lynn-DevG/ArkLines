import React, { useState } from 'react';
import { ACTION_TYPES } from './ActionEditor';
import { BuffSelector } from './BuffSelector';
import { ConditionBuilder } from './ConditionBuilder';
import { ChevronDown, ChevronRight, Trash2, GripVertical } from 'lucide-react';

// 目标类型选项
const TARGET_TYPES = [
    { value: 'enemy', label: '敌人' },
    { value: 'self', label: '自身' },
    { value: 'ally', label: '自身或队友' },
    { value: 'other_ally', label: '其他队友' },
    { value: 'main_char', label: '主控角色' },
    { value: 'target_enemy', label: '目标敌人' }
];

// 元素属性选项
const ELEMENTS = [
    { value: 'physical', label: '物理' },
    { value: 'blaze', label: '灼热' },
    { value: 'cold', label: '寒冷' },
    { value: 'nature', label: '自然' },
    { value: 'emag', label: '电磁' }
];

const inputClassName = "w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-500";
const selectClassName = "w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-500";

export function ActionItem({ action, index, onChange, onRemove }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showCondition, setShowCondition] = useState(!!action.condition?.length);

    const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <div className="border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800/30">
            {/* 头部 */}
            <div className="flex items-center gap-2 px-3 py-2 bg-neutral-800/50">
                <GripVertical size={14} className="text-neutral-600 cursor-grab" />
                
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex items-center gap-2 flex-1 text-left"
                >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    <div className={`w-2.5 h-2.5 rounded ${config.color}`} />
                    <span className="text-sm font-medium">{config.label}</span>
                    <span className="text-xs text-neutral-500">@{action.offset || 0}s</span>
                </button>

                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-500 hover:text-white rounded text-red-400 transition-colors"
                    title="删除"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* 内容 */}
            {isExpanded && (
                <div className="p-3 space-y-3 border-t border-neutral-700/50">
                    {/* 通用字段 */}
                    <div className="grid grid-cols-3 gap-3">
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">目标</label>
                            <select
                                value={action.target || 'enemy'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={selectClassName}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">时间偏移 (秒)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={action.offset || 0}
                                onChange={(e) => updateField('offset', parseFloat(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-neutral-500 mb-1 block">索引</label>
                            <input
                                type="number"
                                min="1"
                                value={action.index || 1}
                                onChange={(e) => updateField('index', parseInt(e.target.value) || 1)}
                                className={inputClassName}
                            />
                        </div>
                    </div>

                    {/* damage 类型专属字段 */}
                    {action.type === 'damage' && (
                        <div className="grid grid-cols-4 gap-3">
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">元素</label>
                                <select
                                    value={action.element || 'physical'}
                                    onChange={(e) => updateField('element', e.target.value)}
                                    className={selectClassName}
                                >
                                    {ELEMENTS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">技力回复</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={action.atb || 0}
                                    onChange={(e) => updateField('atb', parseInt(e.target.value) || 0)}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">失衡值</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={action.poise || 0}
                                    onChange={(e) => updateField('poise', parseInt(e.target.value) || 0)}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">倍率 Key</label>
                                <input
                                    type="text"
                                    value={action.scalingKey || ''}
                                    onChange={(e) => updateField('scalingKey', e.target.value)}
                                    className={inputClassName}
                                    placeholder="atk_scale"
                                />
                            </div>
                        </div>
                    )}

                    {/* add_buff / consume_buff 类型专属字段 */}
                    {(action.type === 'add_buff' || action.type === 'consume_buff') && (
                        <div className="grid grid-cols-3 gap-3">
                            <div className="col-span-2">
                                <label className="text-xs text-neutral-500 mb-1 block">Buff</label>
                                <BuffSelector
                                    value={action.buffId || ''}
                                    onChange={(value) => updateField('buffId', value)}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">层数</label>
                                <input
                                    type="number"
                                    min="1"
                                    value={action.stacks || 1}
                                    onChange={(e) => updateField('stacks', parseInt(e.target.value) || 1)}
                                    className={inputClassName}
                                />
                            </div>
                            {action.type === 'add_buff' && (
                                <>
                                    <div>
                                        <label className="text-xs text-neutral-500 mb-1 block">持续时间</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={action.duration || ''}
                                            onChange={(e) => updateField('duration', parseFloat(e.target.value) || undefined)}
                                            className={inputClassName}
                                            placeholder="默认"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-neutral-500 mb-1 block">持续时间 Key</label>
                                        <input
                                            type="text"
                                            value={action.durationKey || ''}
                                            onChange={(e) => updateField('durationKey', e.target.value)}
                                            className={inputClassName}
                                            placeholder="duration"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    )}

                    {/* 数值类型专属字段 */}
                    {['add_stagger', 'recover_usp_self', 'recover_usp_team', 'recover_atb'].includes(action.type) && (
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">数值</label>
                                <input
                                    type="number"
                                    step="0.1"
                                    value={action.value || 0}
                                    onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)}
                                    className={inputClassName}
                                />
                            </div>
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">数值 Key</label>
                                <input
                                    type="text"
                                    value={action.valueKey || ''}
                                    onChange={(e) => updateField('valueKey', e.target.value)}
                                    className={inputClassName}
                                    placeholder="可选"
                                />
                            </div>
                        </div>
                    )}

                    {/* 条件设置 */}
                    <div className="border-t border-neutral-700/50 pt-3">
                        <button
                            onClick={() => setShowCondition(!showCondition)}
                            className="text-xs text-neutral-400 hover:text-[#ffff21] flex items-center gap-1 transition-colors"
                        >
                            {showCondition ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            行为生效条件
                            {action.condition?.length > 0 && (
                                <span className="text-neutral-300">({action.condition.length})</span>
                            )}
                        </button>
                        
                        {showCondition && (
                            <div className="mt-2">
                                <ConditionBuilder
                                    conditions={action.condition || []}
                                    onChange={(conditions) => updateField('condition', conditions)}
                                    compact
                                />
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
