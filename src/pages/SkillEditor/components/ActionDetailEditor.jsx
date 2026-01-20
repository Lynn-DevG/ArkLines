import React, { useState } from 'react';
import { ACTION_TYPES } from './ActionEditor';
import { BuffSelector } from './BuffSelector';
import { ConditionBuilder } from './ConditionBuilder';
import { ValueOrKeyInput } from './ValueOrKeyInput';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

const inputClassName = "w-[280px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";
const selectClassName = "w-[280px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";

// 单行表单字段
function FormRow({ label, children }) {
    return (
        <div className="flex items-center gap-4">
            <label className="w-24 text-sm text-white flex-shrink-0">{label}</label>
            {children}
        </div>
    );
}

/**
 * 行为详情编辑器组件
 * 单列布局，每行一个字段
 */
export function ActionDetailEditor({ action, index, onChange }) {
    const [showCondition, setShowCondition] = useState(!!action?.condition?.length);

    if (!action) {
        return (
            <div className="flex items-center justify-center h-full text-neutral-500 text-sm">
                从左侧选择一个行为进行编辑
            </div>
        );
    }

    const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-4">
            {/* 标题 */}
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-700">
                <div className={`w-3 h-3 rounded-full ${config.color}`} />
                <span className="text-sm font-medium text-white">{config.label}</span>
                <span className="text-xs text-neutral-500">#{index + 1}</span>
            </div>

            {/* 通用字段 */}
            <div className="space-y-3">
                <FormRow label="目标">
                    <select
                        value={action.target || 'enemy'}
                        onChange={(e) => updateField('target', e.target.value)}
                        className={selectClassName}
                    >
                        {TARGET_TYPES.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </FormRow>

                <FormRow label="时间偏移">
                    <div className="flex items-center gap-2">
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={action.offset || 0}
                            onChange={(e) => updateField('offset', parseFloat(e.target.value) || 0)}
                            className={inputClassName}
                        />
                        <span className="text-xs text-neutral-500">秒</span>
                    </div>
                </FormRow>

                <FormRow label="索引">
                    <input
                        type="number"
                        min="1"
                        value={action.index || 1}
                        onChange={(e) => updateField('index', parseInt(e.target.value) || 1)}
                        className={inputClassName}
                    />
                </FormRow>
            </div>

            {/* damage 类型专属字段 */}
            {action.type === 'damage' && (
                <div className="space-y-3 pt-3 border-t border-neutral-700/50">
                    <FormRow label="元素">
                        <select
                            value={action.element || 'physical'}
                            onChange={(e) => updateField('element', e.target.value)}
                            className={selectClassName}
                        >
                            {ELEMENTS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </FormRow>

                    <FormRow label="技力回复">
                        <ValueOrKeyInput
                            paramName="atb"
                            value={action.atb}
                            keyValue={action.atbKey}
                            onChange={onChange}
                            step={1}
                            min={0}
                            placeholder="atb"
                            inline
                        />
                    </FormRow>

                    <FormRow label="失衡值">
                        <ValueOrKeyInput
                            paramName="poise"
                            value={action.poise}
                            keyValue={action.poiseKey}
                            onChange={onChange}
                            step={1}
                            min={0}
                            placeholder="poise"
                            inline
                        />
                    </FormRow>

                    <FormRow label="伤害倍率">
                        <ValueOrKeyInput
                            paramName="scaling"
                            value={action.scaling}
                            keyValue={action.scalingKey}
                            onChange={onChange}
                            step={0.01}
                            min={0}
                            placeholder="atk_scale"
                            hint="倍率通常使用Key"
                            inline
                        />
                    </FormRow>
                </div>
            )}

            {/* add_buff / consume_buff 类型专属字段 */}
            {(action.type === 'add_buff' || action.type === 'consume_buff') && (
                <div className="space-y-3 pt-3 border-t border-neutral-700/50">
                    <FormRow label="Buff">
                        <BuffSelector
                            value={action.buffId || ''}
                            onChange={(value) => updateField('buffId', value)}
                        />
                    </FormRow>

                    <FormRow label="层数">
                        <ValueOrKeyInput
                            paramName="stacks"
                            value={action.stacks}
                            keyValue={action.stacksKey}
                            onChange={onChange}
                            step={1}
                            min={1}
                            placeholder="stacks"
                            inline
                        />
                    </FormRow>

                    {action.type === 'add_buff' && (
                        <FormRow label="持续时间">
                            <ValueOrKeyInput
                                paramName="duration"
                                value={action.duration}
                                keyValue={action.durationKey}
                                onChange={onChange}
                                step={0.1}
                                min={0}
                                placeholder="duration"
                                hint="留空使用默认"
                                inline
                            />
                        </FormRow>
                    )}
                </div>
            )}

            {/* 数值类型专属字段 */}
            {['add_stagger', 'recover_usp_self', 'recover_usp_team', 'recover_atb'].includes(action.type) && (
                <div className="space-y-3 pt-3 border-t border-neutral-700/50">
                    <FormRow label="数值">
                        <ValueOrKeyInput
                            paramName="value"
                            value={action.value}
                            keyValue={action.valueKey}
                            onChange={onChange}
                            step={0.1}
                            placeholder="value"
                            inline
                        />
                    </FormRow>
                </div>
            )}

            {/* 条件设置 */}
            <div className="pt-3 border-t border-neutral-700/50">
                <button
                    onClick={() => setShowCondition(!showCondition)}
                    className="text-sm text-neutral-400 hover:text-[#ffff21] flex items-center gap-1 transition-colors"
                >
                    {showCondition ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    行为生效条件
                    {action.condition?.length > 0 && (
                        <span className="text-neutral-300 ml-1">({action.condition.length})</span>
                    )}
                </button>
                
                {showCondition && (
                    <div className="mt-3">
                        <ConditionBuilder
                            conditions={action.condition || []}
                            onChange={(conditions) => updateField('condition', conditions)}
                            compact
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
