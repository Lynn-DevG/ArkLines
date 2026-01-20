import React from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { VariantTabs } from './VariantTabs';
import { ActionListCompact } from './ActionListCompact';
import { ActionDetailEditor } from './ActionDetailEditor';
import { SkillTimelinePreview } from './SkillTimelinePreview';
import { ConditionBuilder } from './ConditionBuilder';
import { Info } from 'lucide-react';

// 技能类型选项
const SKILL_TYPES = [
    { value: 'BASIC', label: '普通攻击' },
    { value: 'TACTICAL', label: '战技' },
    { value: 'CHAIN', label: '连携技' },
    { value: 'ULTIMATE', label: '终结技' }
];

// 元素属性选项
const ELEMENTS = [
    { value: 'physical', label: '物理' },
    { value: 'blaze', label: '灼热' },
    { value: 'cold', label: '寒冷' },
    { value: 'nature', label: '自然' },
    { value: 'emag', label: '电磁' }
];

// 输入框样式 - 固定宽度约35字符
const inputClassName = "w-[280px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#ffff21]";
const selectClassName = "w-[280px] bg-neutral-800 border border-neutral-700 rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#ffff21]";

// 表单行组件 - 标签在左，输入框在右
function FormRow({ label, hint, required, children }) {
    return (
        <div className="flex items-center gap-4">
            <label className="w-24 text-sm text-white flex-shrink-0 flex items-center gap-1">
                {label}
                {required && <span className="text-red-400">*</span>}
                {hint && (
                    <span className="text-neutral-500" title={hint}>
                        <Info size={12} />
                    </span>
                )}
            </label>
            {children}
        </div>
    );
}

// 变体表单字段组件
function VariantFormFields({ variant, onChange }) {
    const updateField = (field, value) => {
        onChange({ [field]: value });
    };

    return (
        <div className="space-y-3">
            <FormRow label="变体 ID" required>
                <input
                    type="text"
                    value={variant.id || ''}
                    onChange={(e) => updateField('id', e.target.value)}
                    className={inputClassName}
                    placeholder="v_xxxx"
                />
            </FormRow>

            <FormRow label="变体名称" required>
                <input
                    type="text"
                    value={variant.name || ''}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputClassName}
                    placeholder="变体名称"
                />
            </FormRow>

            <FormRow label="变体类型">
                <input
                    type="text"
                    value={variant.variantType || ''}
                    onChange={(e) => updateField('variantType', e.target.value)}
                    className={inputClassName}
                    placeholder="如: heavy"
                />
            </FormRow>

            <FormRow label="持续时间" hint="覆盖主技能的持续时间">
                <input
                    type="number"
                    step="0.1"
                    min="0"
                    value={variant.duration ?? ''}
                    onChange={(e) => updateField('duration', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className={inputClassName}
                    placeholder="覆盖原值"
                />
            </FormRow>

            <FormRow label="能量获取" hint="覆盖主技能的能量获取">
                <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={variant.uspGain ?? ''}
                    onChange={(e) => updateField('uspGain', e.target.value ? parseFloat(e.target.value) : undefined)}
                    className={inputClassName}
                    placeholder="覆盖原值"
                />
            </FormRow>

            {/* 触发条件（变体必填） */}
            <div className="pt-3 border-t border-neutral-700/50">
                <div className="text-sm text-white mb-2 flex items-center gap-1">
                    触发条件 <span className="text-red-400">*</span>
                    <span className="text-xs text-neutral-500 ml-2">（变体的触发条件为必填）</span>
                </div>
                <ConditionBuilder
                    conditions={variant.condition || []}
                    onChange={(conditions) => updateField('condition', conditions)}
                    compact
                />
            </div>
        </div>
    );
}

export function SkillForm() {
    const { 
        currentSkill, 
        updateSkillField, 
        validationResult,
        activeVariantIndex,
        selectVariant,
        currentEditingData,
        currentActions,
        selectedActionIndex,
        selectAction,
        addAction,
        updateAction,
        updateActionOffset,
        removeAction,
        moveAction,
        addVariant,
        updateVariant,
        removeVariant
    } = useSkillEditorContext();

    if (!currentSkill) return null;

    const skillType = currentSkill.type || 'BASIC';
    const isMainSkill = activeVariantIndex === -1;
    const editingData = isMainSkill ? currentSkill : currentSkill.variants?.[activeVariantIndex];

    // 获取当前编辑数据的 duration（用于时间轴预览）
    const currentDuration = editingData?.duration ?? currentSkill.duration ?? 1;

    return (
        <div className="h-full flex flex-col">
            {/* 变体标签页 */}
            <VariantTabs
                variants={currentSkill.variants || []}
                activeIndex={activeVariantIndex}
                onSelect={selectVariant}
                onAddVariant={addVariant}
                onRemoveVariant={removeVariant}
            />

            {/* 验证错误提示 */}
            {!validationResult.valid && (
                <div className="mx-4 mt-4 bg-red-900/20 border border-red-800 rounded-lg p-3">
                    <div className="text-sm font-medium text-red-400 mb-1">验证错误</div>
                    <ul className="list-disc list-inside text-sm text-red-300 space-y-0.5">
                        {validationResult.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 主内容区 - 左右分栏 */}
            <div className="flex-1 flex overflow-hidden">
                {/* 左列 - 配置区 */}
                <div className="w-[400px] flex-shrink-0 border-r border-neutral-800 overflow-y-auto p-4 space-y-6">
                    {isMainSkill ? (
                        // 主技能表单
                        <>
                            {/* 基础信息 */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-neutral-400 border-b border-neutral-700 pb-2">基础信息</div>
                                
                                <FormRow label="技能 ID" required hint="唯一标识符，如 chr_0003_endminf_attack">
                                    <input
                                        type="text"
                                        value={currentSkill.id || ''}
                                        onChange={(e) => updateSkillField('id', e.target.value)}
                                        className={inputClassName}
                                        placeholder="skill_id"
                                    />
                                </FormRow>

                                <FormRow label="技能名称" required>
                                    <input
                                        type="text"
                                        value={currentSkill.name || ''}
                                        onChange={(e) => updateSkillField('name', e.target.value)}
                                        className={inputClassName}
                                        placeholder="技能名称"
                                    />
                                </FormRow>

                                <FormRow label="技能类型" required>
                                    <select
                                        value={currentSkill.type || 'BASIC'}
                                        onChange={(e) => updateSkillField('type', e.target.value)}
                                        className={selectClassName}
                                    >
                                        {SKILL_TYPES.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </FormRow>

                                <FormRow label="元素属性" hint="技能展示用">
                                    <select
                                        value={currentSkill.element || 'physical'}
                                        onChange={(e) => updateSkillField('element', e.target.value)}
                                        className={selectClassName}
                                    >
                                        {ELEMENTS.map(opt => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                </FormRow>

                                <FormRow label="持续时间" hint="技能动作持续时间（秒）">
                                    <input
                                        type="number"
                                        step="0.1"
                                        min="0"
                                        value={currentSkill.duration || 0}
                                        onChange={(e) => updateSkillField('duration', parseFloat(e.target.value) || 0)}
                                        className={inputClassName}
                                    />
                                </FormRow>
                            </div>

                            {/* 消耗与获取 */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-neutral-400 border-b border-neutral-700 pb-2">消耗与获取</div>
                                
                                {/* 战技：技力消耗 */}
                                {skillType === 'TACTICAL' && (
                                    <FormRow label="技力消耗" hint="默认 100">
                                        <input
                                            type="number"
                                            min="0"
                                            value={currentSkill.atbCost ?? 100}
                                            onChange={(e) => updateSkillField('atbCost', parseInt(e.target.value) || 0)}
                                            className={inputClassName}
                                        />
                                    </FormRow>
                                )}

                                {/* 连携技：冷却时间 */}
                                {skillType === 'CHAIN' && (
                                    <FormRow label="冷却时间" hint="秒">
                                        <input
                                            type="number"
                                            step="0.1"
                                            min="0"
                                            value={currentSkill.cooldown || 0}
                                            onChange={(e) => updateSkillField('cooldown', parseFloat(e.target.value) || 0)}
                                            className={inputClassName}
                                        />
                                    </FormRow>
                                )}

                                {/* 终结技：能量消耗 */}
                                {skillType === 'ULTIMATE' && (
                                    <>
                                        <FormRow label="能量消耗" hint="终结技能量消耗">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                value={currentSkill.uspCost || 0}
                                                onChange={(e) => updateSkillField('uspCost', parseFloat(e.target.value) || 0)}
                                                className={inputClassName}
                                            />
                                        </FormRow>
                                        <FormRow label="能量回复" hint="释放后回复的能量（通常为0）">
                                            <input
                                                type="number"
                                                step="0.5"
                                                min="0"
                                                value={currentSkill.uspReply || 0}
                                                onChange={(e) => updateSkillField('uspReply', parseFloat(e.target.value) || 0)}
                                                className={inputClassName}
                                            />
                                        </FormRow>
                                    </>
                                )}

                                {/* 通用：能量获取 */}
                                {(skillType === 'TACTICAL' || skillType === 'CHAIN') && (
                                    <FormRow label="能量获取" hint="释放后获得的终结技能量">
                                        <input
                                            type="number"
                                            step="0.5"
                                            min="0"
                                            value={currentSkill.uspGain || 0}
                                            onChange={(e) => updateSkillField('uspGain', parseFloat(e.target.value) || 0)}
                                            className={inputClassName}
                                        />
                                    </FormRow>
                                )}
                            </div>

                            {/* 释放条件 */}
                            <div className="space-y-3">
                                <div className="text-sm font-medium text-neutral-400 border-b border-neutral-700 pb-2">释放条件</div>
                                <p className="text-xs text-neutral-500 mb-2">
                                    设置技能释放的前提条件，多个条件之间为"或"关系
                                </p>
                                <ConditionBuilder
                                    conditions={currentSkill.condition || []}
                                    onChange={(conditions) => updateSkillField('condition', conditions)}
                                />
                            </div>

                            {/* 技能行为列表 */}
                            <ActionListCompact
                                actions={currentActions}
                                selectedIndex={selectedActionIndex}
                                onSelect={selectAction}
                                onAdd={addAction}
                                onRemove={removeAction}
                                onMove={moveAction}
                            />
                        </>
                    ) : (
                        // 变体表单
                        editingData && (
                            <>
                                <div className="text-sm font-medium text-neutral-400 border-b border-neutral-700 pb-2">
                                    变体配置
                                </div>
                                <VariantFormFields
                                    variant={editingData}
                                    onChange={(updates) => updateVariant(activeVariantIndex, updates)}
                                />

                                {/* 变体行为列表 */}
                                <ActionListCompact
                                    actions={currentActions}
                                    selectedIndex={selectedActionIndex}
                                    onSelect={selectAction}
                                    onAdd={addAction}
                                    onRemove={removeAction}
                                    onMove={moveAction}
                                />
                            </>
                        )
                    )}
                </div>

                {/* 右列 - 时间轴和行为编辑区 */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* 时间轴预览 */}
                    <div className="p-4 border-b border-neutral-800">
                        <div className="text-sm font-medium text-neutral-400 mb-3">时间轴预览</div>
                        <SkillTimelinePreview
                            duration={currentDuration}
                            maxDuration={10}
                            actions={currentActions}
                            selectedActionIndex={selectedActionIndex}
                            onSelectAction={selectAction}
                            onUpdateOffset={updateActionOffset}
                        />
                    </div>

                    {/* 行为编辑区 */}
                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="text-sm font-medium text-neutral-400 mb-3">行为编辑</div>
                        <ActionDetailEditor
                            action={currentActions[selectedActionIndex]}
                            index={selectedActionIndex ?? 0}
                            onChange={(updates) => {
                                if (selectedActionIndex !== null) {
                                    updateAction(selectedActionIndex, updates);
                                }
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
