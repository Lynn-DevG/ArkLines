import React from 'react';
import { Hash, Key } from 'lucide-react';

/**
 * ValueOrKeyInput - 支持固定值或等级映射key的输入组件
 * 
 * 用于技能行为参数配置，允许用户选择：
 * - 固定值模式：直接输入数值（float）
 * - 等级映射模式：输入映射key名称，从技能等级映射JSON中读取
 * 
 * 导出格式：
 * - 固定值模式：{ "paramName": 123 }
 * - 等级映射模式：{ "paramNameKey": "mapping_key" }
 */

const inputClassName = "flex-1 bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-sm text-white focus:outline-none focus:border-[#ffff21]";
const inlineInputClassName = "w-[200px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";
const toggleBtnClassName = "px-2 py-1 text-xs rounded transition-colors flex items-center gap-1";

export function ValueOrKeyInput({
    label,
    paramName,      // 参数名，如 'value', 'stacks', 'duration', 'atb', 'poise', 'scaling'
    value,          // 当前固定值
    keyValue,       // 当前key值 (paramNameKey 的值)
    onChange,       // 回调: (updates) => void，更新action字段
    step = 0.1,     // 数值步进
    min,            // 最小值
    placeholder = '', // key输入占位符
    hint,           // 提示文字
    inline = false, // 是否使用行内布局（用于 ActionDetailEditor）
}) {
    // 判断当前模式：如果 keyValue 字段存在（不是 undefined），则为 key 模式
    // 注意：空字符串也算 key 模式（表示用户正在输入 key）
    const isKeyMode = keyValue !== undefined && keyValue !== null;
    const keyFieldName = `${paramName}Key`;

    // 切换模式
    const handleModeToggle = (toKeyMode) => {
        if (toKeyMode === isKeyMode) return;
        
        if (toKeyMode) {
            // 切换到 key 模式：清除固定值，设置key为空字符串
            onChange({
                [paramName]: undefined,
                [keyFieldName]: ''
            });
        } else {
            // 切换到固定值模式：清除key，设置默认固定值
            onChange({
                [paramName]: 0,
                [keyFieldName]: undefined
            });
        }
    };

    // 更新固定值
    const handleValueChange = (newValue) => {
        onChange({
            [paramName]: newValue,
            [keyFieldName]: undefined
        });
    };

    // 更新key值
    const handleKeyChange = (newKey) => {
        onChange({
            [paramName]: undefined,
            [keyFieldName]: newKey
        });
    };

    // 模式切换按钮组
    const ModeToggle = () => (
        <div className="flex gap-1">
            <button
                type="button"
                onClick={() => handleModeToggle(false)}
                className={`${toggleBtnClassName} ${
                    !isKeyMode 
                        ? 'bg-neutral-600 text-white' 
                        : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                }`}
                title="固定值模式"
            >
                <Hash size={10} />
                <span>值</span>
            </button>
            <button
                type="button"
                onClick={() => handleModeToggle(true)}
                className={`${toggleBtnClassName} ${
                    isKeyMode 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-neutral-800 text-neutral-500 hover:bg-neutral-700'
                }`}
                title="等级映射Key模式"
            >
                <Key size={10} />
                <span>Key</span>
            </button>
        </div>
    );

    // 输入框
    const InputField = ({ className }) => (
        isKeyMode ? (
            <input
                type="text"
                value={keyValue || ''}
                onChange={(e) => handleKeyChange(e.target.value)}
                className={className}
                placeholder={placeholder || `${paramName}_key`}
            />
        ) : (
            <input
                type="number"
                step={step}
                min={min}
                value={value ?? 0}
                onChange={(e) => handleValueChange(parseFloat(e.target.value) || 0)}
                className={className}
            />
        )
    );

    // 行内布局（用于 ActionDetailEditor）
    if (inline) {
        return (
            <div className="flex items-center gap-2">
                <InputField className={inlineInputClassName} />
                <ModeToggle />
                {hint && (
                    <span className="text-xs text-neutral-500">{hint}</span>
                )}
            </div>
        );
    }

    // 默认布局
    return (
        <div>
            <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-neutral-500">{label}</label>
                <ModeToggle />
            </div>
            
            <InputField className={inputClassName} />
            
            {/* 提示文字 */}
            {hint && (
                <div className="mt-1 text-xs text-neutral-600">{hint}</div>
            )}
        </div>
    );
}
