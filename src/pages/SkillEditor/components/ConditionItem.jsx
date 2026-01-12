import React from 'react';
import { CONDITION_TYPES } from './ConditionBuilder';
import { BuffSelector } from './BuffSelector';
import { Trash2 } from 'lucide-react';

// 目标类型选项
const TARGET_TYPES = [
    { value: 'self', label: '自身' },
    { value: 'ally', label: '自身或队友' },
    { value: 'other_ally', label: '其他队友' },
    { value: 'main_char', label: '主控角色' },
    { value: 'enemy', label: '敌人' },
    { value: 'target_enemy', label: '目标敌人' }
];

// 比较方式选项
const COMPARE_TYPES = [
    { value: 'eq', label: '等于' },
    { value: 'gt', label: '大于' },
    { value: 'lt', label: '小于' },
    { value: 'gte', label: '大于等于' },
    { value: 'lte', label: '小于等于' },
    { value: 'ne', label: '不等于' }
];

// 历史行为类型
const ACTION_HISTORY_TYPES = [
    { value: 'cast_skill', label: '释放技能' },
    { value: 'deal_damage', label: '造成伤害' },
    { value: 'apply_buff', label: '施加 Buff' },
    { value: 'receive_buff', label: '获得 Buff' },
    { value: 'consume_buff', label: '消耗 Buff' },
    { value: 'buff_consumed', label: '被消耗 Buff' },
    { value: 'buff_expired', label: 'Buff 过期' }
];

// 技能类型选项
const SKILL_TYPES = [
    { value: '', label: '任意' },
    { value: 'BASIC', label: '普通攻击' },
    { value: 'TACTICAL', label: '战技' },
    { value: 'CHAIN', label: '连携技' },
    { value: 'ULTIMATE', label: '终结技' }
];

// 敌人状态选项
const ENEMY_STATES = [
    { value: 'staggered', label: '失衡' },
    { value: 'frozen', label: '冻结' },
    { value: 'burning', label: '燃烧' },
    { value: 'conducting', label: '导电' },
    { value: 'corroding', label: '腐蚀' },
    { value: 'has_break', label: '有破防' }
];

// 属性类型选项
const ATTRIBUTE_TYPES = [
    { value: 'hp', label: '生命值' },
    { value: 'hp_percent', label: '生命百分比' },
    { value: 'atk', label: '攻击力' },
    { value: 'def', label: '防御力' },
    { value: 'usp', label: '终结技能量' },
    { value: 'atb', label: '技力' },
    { value: 'poise', label: '失衡值' }
];

const inputClassName = "bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-500";
const selectClassName = "bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-neutral-500";

export function ConditionItem({ condition, index, onChange, onRemove, compact = false }) {
    const config = CONDITION_TYPES[condition.type] || { label: condition.type, color: 'bg-slate-500' };

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    const updateParams = (field, value) => {
        const params = { ...(condition.params || {}), [field]: value };
        onChange({ params });
    };

    return (
        <div className={`border border-neutral-700 rounded-lg overflow-hidden bg-neutral-800/30
            ${compact ? 'p-2' : 'p-3'}`}>
            {/* 头部 */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded ${config.color}`} />
                    <span className={`font-medium ${compact ? 'text-xs' : 'text-sm'}`}>{config.label}</span>
                </div>
                <button
                    onClick={onRemove}
                    className="p-1 hover:bg-red-900/50 rounded text-red-400"
                    title="删除"
                >
                    <Trash2 size={compact ? 12 : 14} />
                </button>
            </div>

            {/* 条件参数 */}
            <div className={`grid gap-2 ${compact ? 'grid-cols-2' : 'grid-cols-3'}`}>
                {/* combo 条件 */}
                {condition.type === 'combo' && (
                    <div className="col-span-2">
                        <label className="text-[10px] text-neutral-500 mb-1 block">连击段数</label>
                        <select
                            value={condition.value || 1}
                            onChange={(e) => updateField('value', e.target.value === 'heavy' ? 'heavy' : parseInt(e.target.value))}
                            className={`${selectClassName} w-full`}
                        >
                            <option value={1}>第 1 段</option>
                            <option value={2}>第 2 段</option>
                            <option value={3}>第 3 段</option>
                            <option value={4}>第 4 段</option>
                            <option value="heavy">重击</option>
                        </select>
                    </div>
                )}

                {/* buff_check 条件 */}
                {condition.type === 'buff_check' && (
                    <>
                        <div className="col-span-2">
                            <label className="text-[10px] text-neutral-500 mb-1 block">Buff</label>
                            <BuffSelector
                                value={condition.buffId || ''}
                                onChange={(value) => updateField('buffId', value)}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">检查目标</label>
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">比较方式</label>
                            <select
                                value={condition.compare || 'gte'}
                                onChange={(e) => updateField('compare', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {COMPARE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">层数</label>
                            <input
                                type="number"
                                min="0"
                                value={condition.stacks || 1}
                                onChange={(e) => updateField('stacks', parseInt(e.target.value) || 0)}
                                className={`${inputClassName} w-full`}
                            />
                        </div>
                    </>
                )}

                {/* action_history 条件 */}
                {condition.type === 'action_history' && (
                    <>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">行为类型</label>
                            <select
                                value={condition.actionType || 'cast_skill'}
                                onChange={(e) => updateField('actionType', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {ACTION_HISTORY_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">检查目标</label>
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">时间窗口(秒)</label>
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={condition.timeWindow || 4}
                                onChange={(e) => updateField('timeWindow', parseFloat(e.target.value) || 4)}
                                className={`${inputClassName} w-full`}
                            />
                        </div>
                        
                        {/* cast_skill 额外参数 */}
                        {condition.actionType === 'cast_skill' && (
                            <>
                                <div>
                                    <label className="text-[10px] text-neutral-500 mb-1 block">技能类型</label>
                                    <select
                                        value={condition.params?.skillType || ''}
                                        onChange={(e) => updateParams('skillType', e.target.value || undefined)}
                                        className={`${selectClassName} w-full`}
                                    >
                                        {SKILL_TYPES.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] text-neutral-500 mb-1 block">变体类型</label>
                                    <input
                                        type="text"
                                        value={condition.params?.variantType || ''}
                                        onChange={(e) => updateParams('variantType', e.target.value || undefined)}
                                        className={`${inputClassName} w-full`}
                                        placeholder="如: heavy"
                                    />
                                </div>
                            </>
                        )}
                    </>
                )}

                {/* attribute_check 条件 */}
                {condition.type === 'attribute_check' && (
                    <>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">属性</label>
                            <select
                                value={condition.attribute || 'hp'}
                                onChange={(e) => updateField('attribute', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {ATTRIBUTE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">比较方式</label>
                            <select
                                value={condition.compare || 'gte'}
                                onChange={(e) => updateField('compare', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {COMPARE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">比较值</label>
                            <input
                                type="number"
                                step="0.01"
                                value={condition.value || 0}
                                onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)}
                                className={`${inputClassName} w-full`}
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-neutral-500 mb-1 block">检查目标</label>
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={`${selectClassName} w-full`}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>
                    </>
                )}

                {/* enemy_state 条件 */}
                {condition.type === 'enemy_state' && (
                    <div className="col-span-2">
                        <label className="text-[10px] text-neutral-500 mb-1 block">敌人状态</label>
                        <select
                            value={condition.state || 'staggered'}
                            onChange={(e) => updateField('state', e.target.value)}
                            className={`${selectClassName} w-full`}
                        >
                            {ENEMY_STATES.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* is_main_char 条件 - 无需额外参数 */}
                {condition.type === 'is_main_char' && (
                    <div className="col-span-2 text-xs text-neutral-500">
                        检查执行者是否为当前主控角色
                    </div>
                )}
            </div>
        </div>
    );
}
