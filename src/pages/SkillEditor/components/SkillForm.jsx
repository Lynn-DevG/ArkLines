import React from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { ActionEditor } from './ActionEditor';
import { VariantEditor } from './VariantEditor';
import { ConditionBuilder } from './ConditionBuilder';
import { ChevronDown, ChevronRight, Info } from 'lucide-react';

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

// 可折叠的表单区块
function FormSection({ title, defaultOpen = true, children, badge }) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);
    
    return (
        <div className="border border-neutral-800 rounded-lg overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-2 px-4 py-3 bg-neutral-800/50 hover:bg-[#ffff21] hover:text-black text-sm font-medium text-left transition-colors"
            >
                {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                <span>{title}</span>
                {badge && (
                    <span className="ml-auto text-xs text-neutral-500">{badge}</span>
                )}
            </button>
            {isOpen && (
                <div className="p-4 border-t border-neutral-800">
                    {children}
                </div>
            )}
        </div>
    );
}

// 表单字段组件
function FormField({ label, hint, required, children }) {
    return (
        <div className="mb-4">
            <label className="flex items-center gap-1 text-sm text-neutral-400 mb-1.5">
                {label}
                {required && <span className="text-red-400">*</span>}
                {hint && (
                    <span className="ml-1 text-neutral-600" title={hint}>
                        <Info size={12} />
                    </span>
                )}
            </label>
            {children}
        </div>
    );
}

// 输入框样式
const inputClassName = "w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500";
const selectClassName = "w-full bg-neutral-800 border border-neutral-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-neutral-500";

export function SkillForm() {
    const { currentSkill, updateSkillField, validationResult } = useSkillEditorContext();

    if (!currentSkill) return null;

    const skillType = currentSkill.type || 'BASIC';

    return (
        <div className="p-6 space-y-6">
            {/* 验证错误提示 */}
            {!validationResult.valid && (
                <div className="bg-red-900/20 border border-red-800 rounded-lg p-4">
                    <div className="text-sm font-medium text-red-400 mb-2">验证错误</div>
                    <ul className="list-disc list-inside text-sm text-red-300 space-y-1">
                        {validationResult.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* 基础信息 */}
            <FormSection title="基础信息">
                <div className="grid grid-cols-2 gap-4">
                    <FormField label="技能 ID" required hint="唯一标识符，如 chr_0003_endminf_attack">
                        <input
                            type="text"
                            value={currentSkill.id || ''}
                            onChange={(e) => updateSkillField('id', e.target.value)}
                            className={inputClassName}
                            placeholder="skill_id"
                        />
                    </FormField>

                    <FormField label="技能名称" required>
                        <input
                            type="text"
                            value={currentSkill.name || ''}
                            onChange={(e) => updateSkillField('name', e.target.value)}
                            className={inputClassName}
                            placeholder="技能名称"
                        />
                    </FormField>

                    <FormField label="技能类型" required>
                        <select
                            value={currentSkill.type || 'BASIC'}
                            onChange={(e) => updateSkillField('type', e.target.value)}
                            className={selectClassName}
                        >
                            {SKILL_TYPES.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="元素属性">
                        <select
                            value={currentSkill.element || 'physical'}
                            onChange={(e) => updateSkillField('element', e.target.value)}
                            className={selectClassName}
                        >
                            {ELEMENTS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </FormField>

                    <FormField label="持续时间" hint="技能动作持续时间（秒）">
                        <input
                            type="number"
                            step="0.1"
                            min="0"
                            value={currentSkill.duration || 0}
                            onChange={(e) => updateSkillField('duration', parseFloat(e.target.value) || 0)}
                            className={inputClassName}
                        />
                    </FormField>
                </div>
            </FormSection>

            {/* 消耗/获取 - 根据技能类型动态显示 */}
            <FormSection title="消耗与获取">
                <div className="grid grid-cols-2 gap-4">
                    {/* 战技：技力消耗 */}
                    {skillType === 'TACTICAL' && (
                        <FormField label="技力消耗" hint="默认 100">
                            <input
                                type="number"
                                min="0"
                                value={currentSkill.atbCost ?? 100}
                                onChange={(e) => updateSkillField('atbCost', parseInt(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </FormField>
                    )}

                    {/* 连携技：冷却时间 */}
                    {skillType === 'CHAIN' && (
                        <FormField label="冷却时间" hint="秒">
                            <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={currentSkill.cooldown || 0}
                                onChange={(e) => updateSkillField('cooldown', parseFloat(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </FormField>
                    )}

                    {/* 终结技：能量消耗 */}
                    {skillType === 'ULTIMATE' && (
                        <>
                            <FormField label="能量消耗" hint="终结技能量消耗">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={currentSkill.uspCost || 0}
                                    onChange={(e) => updateSkillField('uspCost', parseFloat(e.target.value) || 0)}
                                    className={inputClassName}
                                />
                            </FormField>
                            <FormField label="能量回复" hint="释放后回复的能量（通常为0）">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={currentSkill.uspReply || 0}
                                    onChange={(e) => updateSkillField('uspReply', parseFloat(e.target.value) || 0)}
                                    className={inputClassName}
                                />
                            </FormField>
                        </>
                    )}

                    {/* 通用：能量获取 */}
                    {(skillType === 'TACTICAL' || skillType === 'CHAIN') && (
                        <FormField label="能量获取" hint="释放后获得的终结技能量">
                            <input
                                type="number"
                                step="0.5"
                                min="0"
                                value={currentSkill.uspGain || 0}
                                onChange={(e) => updateSkillField('uspGain', parseFloat(e.target.value) || 0)}
                                className={inputClassName}
                            />
                        </FormField>
                    )}
                </div>
            </FormSection>

            {/* 释放条件 */}
            <FormSection title="释放条件" defaultOpen={false}>
                <p className="text-sm text-neutral-500 mb-4">
                    设置技能释放的前提条件，多个条件之间为"或"关系
                </p>
                <ConditionBuilder
                    conditions={currentSkill.condition || []}
                    onChange={(conditions) => updateSkillField('condition', conditions)}
                />
            </FormSection>

            {/* 技能行为 */}
            <FormSection 
                title="技能行为" 
                badge={`${(currentSkill.actions || []).length} 个行为`}
            >
                <ActionEditor />
            </FormSection>

            {/* 技能变体 */}
            <FormSection 
                title="技能变体" 
                defaultOpen={false}
                badge={`${(currentSkill.variants || []).length} 个变体`}
            >
                <p className="text-sm text-neutral-500 mb-4">
                    变体用于根据条件切换不同的技能版本（如连击段数）
                </p>
                <VariantEditor />
            </FormSection>
        </div>
    );
}
