import React, { useState } from 'react';
import { CONDITION_TYPES } from './ConditionBuilder';
import { BuffSelector } from './BuffSelector';
import { Trash2, ChevronDown, ChevronRight } from 'lucide-react';

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

// 输入框样式 - 固定宽度
const inputClassName = "w-[200px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";
const selectClassName = "w-[200px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";

// 表单行组件 - 标签在左，输入框在右
function FormRow({ label, children }) {
    return (
        <div className="flex items-center gap-4">
            <label className="w-20 text-sm text-white flex-shrink-0">{label}</label>
            {children}
        </div>
    );
}

export function ConditionItem({ condition, index, onChange, onRemove, compact = false }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const config = CONDITION_TYPES[condition.type] || { label: condition.type, color: 'bg-slate-500' };

    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    const updateParams = (field, value) => {
        const params = { ...(condition.params || {}), [field]: value };
        onChange({ params });
    };

    // 生成条件摘要（折叠时显示）
    const getSummary = () => {
        switch (condition.type) {
            case 'combo':
                return condition.value === 'heavy' ? '重击' : `第 ${condition.value || 1} 段`;
            case 'buff_check':
                return `${condition.buffId || '未选择'} ≥ ${condition.stacks || 1} 层`;
            case 'action_history':
                return `${condition.timeWindow || 4}秒内 ${ACTION_HISTORY_TYPES.find(t => t.value === condition.actionType)?.label || ''}`;
            case 'attribute_check':
                return `${ATTRIBUTE_TYPES.find(t => t.value === condition.attribute)?.label || ''} ${COMPARE_TYPES.find(t => t.value === condition.compare)?.label || ''} ${condition.value || 0}`;
            case 'enemy_state':
                return ENEMY_STATES.find(t => t.value === condition.state)?.label || '';
            case 'is_main_char':
                return '是主控角色';
            default:
                return '';
        }
    };

    return (
        <div className="border border-neutral-700 rounded-lg bg-neutral-800/30">
            {/* 头部 - 可点击折叠 */}
            <div 
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-neutral-700/30 transition-colors ${isExpanded ? 'border-b border-neutral-700/50' : ''}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {isExpanded ? <ChevronDown size={14} className="text-neutral-400 flex-shrink-0" /> : <ChevronRight size={14} className="text-neutral-400 flex-shrink-0" />}
                    <div className={`w-2.5 h-2.5 rounded flex-shrink-0 ${config.color}`} />
                    <span className="text-sm font-medium text-white">{config.label}</span>
                    {!isExpanded && (
                        <span className="text-xs text-neutral-500 truncate ml-2">{getSummary()}</span>
                    )}
                </div>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className="p-1 hover:bg-red-500 hover:text-white rounded text-red-400 transition-colors flex-shrink-0"
                    title="删除"
                >
                    <Trash2 size={14} />
                </button>
            </div>

            {/* 条件参数 - 每行一条 */}
            {isExpanded && (
            <div className="space-y-3 p-3">
                {/* combo 条件 */}
                {condition.type === 'combo' && (
                    <FormRow label="连击段数">
                        <select
                            value={condition.value || 1}
                            onChange={(e) => updateField('value', e.target.value === 'heavy' ? 'heavy' : parseInt(e.target.value))}
                            className={selectClassName}
                        >
                            <option value={1}>第 1 段</option>
                            <option value={2}>第 2 段</option>
                            <option value={3}>第 3 段</option>
                            <option value={4}>第 4 段</option>
                            <option value="heavy">重击</option>
                        </select>
                    </FormRow>
                )}

                {/* buff_check 条件 */}
                {condition.type === 'buff_check' && (
                    <>
                        <FormRow label="Buff">
                            <BuffSelector
                                value={condition.buffId || ''}
                                onChange={(value) => updateField('buffId', value)}
                            />
                        </FormRow>
                        <FormRow label="检查目标">
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={selectClassName}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="比较方式">
                            <select
                                value={condition.compare || 'gte'}
                                onChange={(e) => updateField('compare', e.target.value)}
                                className={selectClassName}
                            >
                                {COMPARE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="层数">
                            <input
                                type="number"
                                min="0"
                                value={condition.stacks || 1}
                                onChange={(e) => updateField('stacks', parseInt(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </FormRow>
                    </>
                )}

                {/* action_history 条件 */}
                {condition.type === 'action_history' && (
                    <>
                        <FormRow label="行为类型">
                            <select
                                value={condition.actionType || 'cast_skill'}
                                onChange={(e) => updateField('actionType', e.target.value)}
                                className={selectClassName}
                            >
                                {ACTION_HISTORY_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="检查目标">
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={selectClassName}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="时间窗口">
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={condition.timeWindow || 4}
                                    onChange={(e) => updateField('timeWindow', parseFloat(e.target.value) || 4)}
                                    className={inputClassName}
                                />
                                <span className="text-xs text-neutral-500">秒</span>
                            </div>
                        </FormRow>
                        
                        {/* cast_skill 额外参数 */}
                        {condition.actionType === 'cast_skill' && (
                            <>
                                <FormRow label="技能类型">
                                    <select
                                        value={condition.params?.skillType || ''}
                                        onChange={(e) => updateParams('skillType', e.target.value || undefined)}
                                        className={selectClassName}
                                    >
                                        {SKILL_TYPES.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </FormRow>
                                <FormRow label="变体类型">
                                    <input
                                        type="text"
                                        value={condition.params?.variantType || ''}
                                        onChange={(e) => updateParams('variantType', e.target.value || undefined)}
                                        className={inputClassName}
                                        placeholder="如: heavy"
                                    />
                                </FormRow>
                            </>
                        )}
                    </>
                )}

                {/* attribute_check 条件 */}
                {condition.type === 'attribute_check' && (
                    <>
                        <FormRow label="属性">
                            <select
                                value={condition.attribute || 'hp'}
                                onChange={(e) => updateField('attribute', e.target.value)}
                                className={selectClassName}
                            >
                                {ATTRIBUTE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="检查目标">
                            <select
                                value={condition.target || 'self'}
                                onChange={(e) => updateField('target', e.target.value)}
                                className={selectClassName}
                            >
                                {TARGET_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="比较方式">
                            <select
                                value={condition.compare || 'gte'}
                                onChange={(e) => updateField('compare', e.target.value)}
                                className={selectClassName}
                            >
                                {COMPARE_TYPES.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </FormRow>
                        <FormRow label="比较值">
                            <input
                                type="number"
                                step="0.01"
                                value={condition.value || 0}
                                onChange={(e) => updateField('value', parseFloat(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </FormRow>
                    </>
                )}

                {/* enemy_state 条件 */}
                {condition.type === 'enemy_state' && (
                    <FormRow label="敌人状态">
                        <select
                            value={condition.state || 'staggered'}
                            onChange={(e) => updateField('state', e.target.value)}
                            className={selectClassName}
                        >
                            {ENEMY_STATES.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </FormRow>
                )}

                {/* is_main_char 条件 - 无需额外参数 */}
                {condition.type === 'is_main_char' && (
                    <div className="text-sm text-neutral-400">
                        检查执行者是否为当前主控角色
                    </div>
                )}
            </div>
            )}
        </div>
    );
}
