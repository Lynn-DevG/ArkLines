import React, { useState, useMemo } from 'react';
import { useSkillEditorContext } from '../SkillEditorPage';
import { Copy, Check, AlertCircle, CheckCircle, Save, RotateCcw, FileJson } from 'lucide-react';

export function PreviewPanel() {
    const {
        currentSkill,
        validationResult,
        saveToFile,
        saveStatus,
        isDirty,
        skills,
        resetToOriginal
    } = useSkillEditorContext();

    const [copied, setCopied] = useState(false);
    const [showAllSkills, setShowAllSkills] = useState(false);

    // 格式化 JSON
    const jsonPreview = useMemo(() => {
        if (showAllSkills) {
            return JSON.stringify(skills, null, 2);
        }
        if (!currentSkill) return '';
        return JSON.stringify(currentSkill, null, 2);
    }, [currentSkill, skills, showAllSkills]);

    // 复制到剪贴板
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(jsonPreview);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('复制失败:', err);
        }
    };

    // 保存到文件
    const handleSave = async () => {
        const success = await saveToFile();
        if (success) {
            // 可以添加成功提示
        }
    };

    // 统计信息
    const stats = useMemo(() => {
        const count = Object.keys(skills).length;
        const byType = {
            BASIC: 0,
            TACTICAL: 0,
            CHAIN: 0,
            ULTIMATE: 0
        };
        Object.values(skills).forEach(skill => {
            if (skill.type && byType[skill.type] !== undefined) {
                byType[skill.type]++;
            }
        });
        return { count, byType };
    }, [skills]);

    return (
        <div className="flex flex-col h-full">
            {/* 头部 */}
            <div className="p-3 border-b border-neutral-800">
                <h3 className="text-sm font-medium text-neutral-300 mb-2">数据预览</h3>
                
                {/* 切换按钮 */}
                <div className="flex gap-1">
                    <button
                        onClick={() => setShowAllSkills(false)}
                        className={`px-2 py-1 text-xs rounded transition-colors
                            ${!showAllSkills 
                                ? 'bg-neutral-600 text-white' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-[#ffff21] hover:text-black'}`}
                    >
                        当前技能
                    </button>
                    <button
                        onClick={() => setShowAllSkills(true)}
                        className={`px-2 py-1 text-xs rounded transition-colors
                            ${showAllSkills 
                                ? 'bg-neutral-600 text-white' 
                                : 'bg-neutral-800 text-neutral-400 hover:bg-[#ffff21] hover:text-black'}`}
                    >
                        全部数据
                    </button>
                </div>
            </div>

            {/* 验证状态 */}
            {currentSkill && !showAllSkills && (
                <div className={`px-3 py-2 border-b border-neutral-800
                    ${validationResult.valid 
                        ? 'bg-green-900/20' 
                        : 'bg-red-900/20'}`}
                >
                    <div className="flex items-center gap-2">
                        {validationResult.valid ? (
                            <>
                                <CheckCircle size={14} className="text-green-400" />
                                <span className="text-xs text-green-400">验证通过</span>
                            </>
                        ) : (
                            <>
                                <AlertCircle size={14} className="text-red-400" />
                                <span className="text-xs text-red-400">
                                    {validationResult.errors.length} 个错误
                                </span>
                            </>
                        )}
                    </div>
                    
                    {!validationResult.valid && (
                        <ul className="mt-2 text-xs text-red-300 space-y-1">
                            {validationResult.errors.map((error, i) => (
                                <li key={i} className="flex items-start gap-1">
                                    <span className="text-red-500">•</span>
                                    {error}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {/* JSON 预览 */}
            <div className="flex-1 overflow-auto p-3">
                {jsonPreview ? (
                    <pre className="text-xs text-neutral-300 font-mono whitespace-pre-wrap break-all">
                        {jsonPreview}
                    </pre>
                ) : (
                    <div className="text-center text-neutral-500 text-sm py-8">
                        <FileJson size={32} className="mx-auto mb-2 opacity-30" />
                        选择一个技能查看数据
                    </div>
                )}
            </div>

            {/* 操作按钮 */}
            <div className="p-3 border-t border-neutral-800 space-y-2">
                {/* 统计信息 */}
                <div className="text-xs text-neutral-500 flex justify-between">
                    <span>共 {stats.count} 个技能</span>
                    <span>
                        普攻:{stats.byType.BASIC} 战技:{stats.byType.TACTICAL} 
                        连携:{stats.byType.CHAIN} 终结:{stats.byType.ULTIMATE}
                    </span>
                </div>

                {/* 复制按钮 */}
                <button
                    onClick={handleCopy}
                    disabled={!jsonPreview}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-[#ffff21] hover:text-black disabled:opacity-50 disabled:cursor-not-allowed rounded text-sm transition-colors"
                >
                    {copied ? (
                        <>
                            <Check size={14} className="text-green-400" />
                            <span className="text-green-400">已复制</span>
                        </>
                    ) : (
                        <>
                            <Copy size={14} />
                            <span>复制 JSON</span>
                        </>
                    )}
                </button>

                {/* 保存按钮 */}
                <button
                    onClick={handleSave}
                    disabled={saveStatus.saving || !isDirty}
                    className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded text-sm font-medium transition-colors
                        ${isDirty 
                            ? 'bg-neutral-600 hover:bg-[#ffff21] hover:text-black text-white' 
                            : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                >
                    <Save size={14} />
                    {saveStatus.saving ? '保存中...' : '保存到 skills.js'}
                </button>

                {/* 重置按钮 */}
                {isDirty && (
                    <button
                        onClick={() => {
                            if (confirm('确定要放弃所有修改并重置为原始数据吗？')) {
                                resetToOriginal();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-800 hover:bg-red-500 rounded text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                        <RotateCcw size={14} />
                        重置为原始数据
                    </button>
                )}

                {/* 保存状态 */}
                {saveStatus.lastSaved && (
                    <div className="text-xs text-center text-neutral-500">
                        上次保存: {saveStatus.lastSaved.toLocaleTimeString()}
                    </div>
                )}
                
                {saveStatus.error && (
                    <div className="text-xs text-center text-red-400">
                        保存失败: {saveStatus.error}
                    </div>
                )}
            </div>
        </div>
    );
}
