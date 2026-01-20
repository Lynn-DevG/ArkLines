import React from 'react';
import { Plus, X } from 'lucide-react';

/**
 * 变体标签页组件
 * 显示主技能和所有变体的标签，支持切换和新增
 */
export function VariantTabs({ 
    variants = [], 
    activeIndex = -1, // -1 表示主技能
    onSelect, 
    onAddVariant,
    onRemoveVariant 
}) {
    return (
        <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-900/50 px-2">
            {/* 主技能标签 */}
            <button
                onClick={() => onSelect(-1)}
                className={`px-4 py-2 text-sm font-medium transition-colors relative
                    ${activeIndex === -1 
                        ? 'text-white bg-neutral-800' 
                        : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                    }`}
            >
                主技能
                {activeIndex === -1 && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffff21]" />
                )}
            </button>

            {/* 变体标签 */}
            {variants.map((variant, index) => (
                <button
                    key={variant.id || index}
                    onClick={() => onSelect(index)}
                    className={`group px-4 py-2 text-sm font-medium transition-colors relative flex items-center gap-2
                        ${activeIndex === index 
                            ? 'text-white bg-neutral-800' 
                            : 'text-neutral-400 hover:text-white hover:bg-neutral-800/50'
                        }`}
                >
                    <span>{variant.name || `变体 ${index + 1}`}</span>
                    {variant.variantType && (
                        <span className="text-xs text-neutral-500">({variant.variantType})</span>
                    )}
                    {/* 删除按钮 */}
                    <span
                        onClick={(e) => {
                            e.stopPropagation();
                            onRemoveVariant(index);
                        }}
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition-opacity"
                    >
                        <X size={14} />
                    </span>
                    {activeIndex === index && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ffff21]" />
                    )}
                </button>
            ))}

            {/* 新增变体按钮 */}
            <button
                onClick={onAddVariant}
                className="px-3 py-2 text-neutral-500 hover:text-[#ffff21] transition-colors"
                title="添加变体"
            >
                <Plus size={16} />
            </button>
        </div>
    );
}
