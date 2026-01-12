import React, { useState } from 'react';
import { ConditionItem } from './ConditionItem';
import { Plus } from 'lucide-react';
import { createConditionTemplate, CONDITION_TYPE } from '../../../data/skillSchema';

// 条件类型配置
export const CONDITION_TYPES = {
    combo: { label: '连击段数', color: 'bg-amber-500' },
    buff_check: { label: 'Buff 检查', color: 'bg-purple-500' },
    action_history: { label: '历史行为', color: 'bg-blue-500' },
    attribute_check: { label: '属性检查', color: 'bg-green-500' },
    enemy_state: { label: '敌人状态', color: 'bg-red-500' },
    is_main_char: { label: '是否主控', color: 'bg-cyan-500' }
};

export function ConditionBuilder({ conditions = [], onChange, compact = false }) {
    const [showAddMenu, setShowAddMenu] = useState(false);

    // 添加条件
    const addCondition = (type) => {
        const template = createConditionTemplate(type);
        onChange([...conditions, template]);
        setShowAddMenu(false);
    };

    // 更新条件
    const updateCondition = (index, updates) => {
        const newConditions = [...conditions];
        newConditions[index] = { ...newConditions[index], ...updates };
        onChange(newConditions);
    };

    // 删除条件
    const removeCondition = (index) => {
        const newConditions = [...conditions];
        newConditions.splice(index, 1);
        onChange(newConditions);
    };

    return (
        <div className="space-y-2">
            {/* 条件列表 */}
            {conditions.length === 0 ? (
                <div className={`text-center ${compact ? 'py-4' : 'py-6'} text-neutral-500 text-sm`}>
                    暂无条件
                </div>
            ) : (
                <div className="space-y-2">
                    {conditions.map((condition, index) => (
                        <React.Fragment key={index}>
                            {index > 0 && (
                                <div className="text-center text-xs text-neutral-600">— 或 —</div>
                            )}
                            <ConditionItem
                                condition={condition}
                                index={index}
                                onChange={(updates) => updateCondition(index, updates)}
                                onRemove={() => removeCondition(index)}
                                compact={compact}
                            />
                        </React.Fragment>
                    ))}
                </div>
            )}

            {/* 添加条件按钮 */}
            <div className="relative">
                <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className={`w-full flex items-center justify-center gap-2 border border-dashed border-neutral-700 hover:border-neutral-600 rounded text-neutral-400 hover:text-neutral-300 transition-colors
                        ${compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'}`}
                >
                    <Plus size={compact ? 12 : 16} />
                    添加条件
                </button>

                {showAddMenu && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800 border border-neutral-700 rounded-lg shadow-lg z-10 overflow-hidden max-h-64 overflow-y-auto">
                        {Object.entries(CONDITION_TYPES).map(([type, config]) => (
                            <button
                                key={type}
                                onClick={() => addCondition(type)}
                                className={`w-full flex items-center gap-3 hover:bg-neutral-700 text-left
                                    ${compact ? 'px-3 py-2 text-xs' : 'px-4 py-2.5 text-sm'}`}
                            >
                                <div className={`w-2.5 h-2.5 rounded ${config.color}`} />
                                {config.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {conditions.length > 1 && (
                <p className={`text-neutral-600 text-center ${compact ? 'text-[10px]' : 'text-xs'}`}>
                    多个条件之间为"或"关系，任一满足即可
                </p>
            )}
        </div>
    );
}
