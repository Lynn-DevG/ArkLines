import React, { useState } from 'react';
import { ACTION_TYPES } from './ActionEditor';
import { BuffSelector } from './BuffSelector';
import { ConditionBuilder } from './ConditionBuilder';
import { ValueOrKeyInput } from './ValueOrKeyInput';
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

const inputClassName = "w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#ffff21]";
const selectClassName = "w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#ffff21]";

export function ActionItem({ action, index, onChange, onRemove }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [showCondition, setShowCondition] = useState(!!action.condition?.length);

    const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <div className="border border-neutral-700 rounded-lg bg-neutral-800/30">
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
                        <div className="space-y-3">
                            {/* 第一行：元素（不需要切换） */}
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
                            </div>
                            
                            {/* 第二行：支持值/Key切换的字段 */}
                            <div className="grid grid-cols-3 gap-3">
                                <ValueOrKeyInput
                                    label="技力回复"
                                    paramName="atb"
                                    value={action.atb}
                                    keyValue={action.atbKey}
                                    onChange={onChange}
                                    step={1}
                                    min={0}
                                    placeholder="atb"
                                />
                                <ValueOrKeyInput
                                    label="失衡值"
                                    paramName="poise"
                                    value={action.poise}
                                    keyValue={action.poiseKey}
                                    onChange={onChange}
                                    step={1}
                                    min={0}
                                    placeholder="poise"
                                />
                                <ValueOrKeyInput
                                    label="伤害倍率"
                                    paramName="scaling"
                                    value={action.scaling}
                                    keyValue={action.scalingKey}
                                    onChange={onChange}
                                    step={0.01}
                                    min={0}
                                    placeholder="atk_scale"
                                    hint="倍率通常使用Key"
                                />
                            </div>
                        </div>
                    )}

                    {/* add_buff / consume_buff 类型专属字段 */}
                    {(action.type === 'add_buff' || action.type === 'consume_buff') && (
                        <div className="space-y-3">
                            {/* Buff 选择器 */}
                            <div>
                                <label className="text-xs text-neutral-500 mb-1 block">Buff</label>
                                <BuffSelector
                                    value={action.buffId || ''}
                                    onChange={(value) => updateField('buffId', value)}
                                />
                            </div>
                            
                            {/* 支持值/Key切换的字段 */}
                            <div className="grid grid-cols-2 gap-3">
                                <ValueOrKeyInput
                                    label="层数"
                                    paramName="stacks"
                                    value={action.stacks}
                                    keyValue={action.stacksKey}
                                    onChange={onChange}
                                    step={1}
                                    min={1}
                                    placeholder="stacks"
                                />
                                {action.type === 'add_buff' && (
                                    <ValueOrKeyInput
                                        label="持续时间"
                                        paramName="duration"
                                        value={action.duration}
                                        keyValue={action.durationKey}
                                        onChange={onChange}
                                        step={0.1}
                                        min={0}
                                        placeholder="duration"
                                        hint="留空使用默认"
                                    />
                                )}
                            </div>
                        </div>
                    )}

                    {/* 数值类型专属字段 */}
                    {['add_stagger', 'recover_usp_self', 'recover_usp_team', 'recover_atb'].includes(action.type) && (
                        <div className="grid grid-cols-1 gap-3">
                            <ValueOrKeyInput
                                label="数值"
                                paramName="value"
                                value={action.value}
                                keyValue={action.valueKey}
                                onChange={onChange}
                                step={0.1}
                                placeholder="value"
                            />
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
