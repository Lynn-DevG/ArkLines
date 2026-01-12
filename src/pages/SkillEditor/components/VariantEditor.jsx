import React, { useState } from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { VariantItem } from './VariantItem';
import { Plus } from 'lucide-react';

export function VariantEditor() {
    const { currentSkill, addVariant, updateVariant, removeVariant } = useSkillEditorContext();

    const variants = currentSkill?.variants || [];

    return (
        <div className="space-y-3">
            {/* 变体列表 */}
            {variants.length === 0 ? (
                <div className="text-center py-8 text-neutral-500 text-sm">
                    暂无变体，点击下方按钮添加
                </div>
            ) : (
                <div className="space-y-3">
                    {variants.map((variant, index) => (
                        <VariantItem
                            key={variant.id || index}
                            variant={variant}
                            index={index}
                            onChange={(updates) => updateVariant(index, updates)}
                            onRemove={() => removeVariant(index)}
                        />
                    ))}
                </div>
            )}

            {/* 添加变体按钮 */}
            <button
                onClick={addVariant}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 border-2 border-dashed border-neutral-700 hover:border-neutral-600 rounded-lg text-sm text-neutral-400 hover:text-neutral-300 transition-colors"
            >
                <Plus size={16} />
                添加变体
            </button>
        </div>
    );
}
