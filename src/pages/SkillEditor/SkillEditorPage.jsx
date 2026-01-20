import React, { createContext, useContext } from 'react';
import { useSkillEditor } from '../../hooks/useSkillEditor';
import { SkillList } from './components/SkillList';
import { SkillForm } from './components/SkillForm';
import { PreviewPanel } from './components/PreviewPanel';
import { Wand2, ArrowLeft } from 'lucide-react';

// 创建 Context 用于共享编辑器状态
const SkillEditorContext = createContext(null);

export function useSkillEditorContext() {
    const context = useContext(SkillEditorContext);
    if (!context) {
        throw new Error('useSkillEditorContext must be used within SkillEditorPage');
    }
    return context;
}

export function SkillEditorPage({ onBack }) {
    const editor = useSkillEditor();

    return (
        <SkillEditorContext.Provider value={editor}>
            <div className="h-screen flex flex-col bg-neutral-950 text-white">
                {/* 顶部工具栏 */}
                <header className="h-12 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between px-4 shrink-0">
                    <div className="flex items-center gap-4">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="flex items-center gap-1 text-neutral-400 hover:text-[#ffff21] text-sm transition-colors"
                            >
                                <ArrowLeft size={16} />
                                返回模拟器
                            </button>
                        )}
                        <div className="flex items-center gap-2 text-neutral-300">
                            <Wand2 size={20} />
                            <span className="font-bold">技能数据编辑器</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        {editor.isDirty && (
                            <span className="text-xs text-amber-400">● 有未保存的修改</span>
                        )}
                        {editor.saveStatus.lastSaved && (
                            <span className="text-xs text-neutral-500">
                                上次保存: {editor.saveStatus.lastSaved.toLocaleTimeString()}
                            </span>
                        )}
                        <button
                            onClick={editor.saveToFile}
                            disabled={editor.saveStatus.saving || !editor.isDirty}
                            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors
                                ${editor.isDirty 
                                    ? 'bg-neutral-600 hover:bg-[#ffff21] hover:text-black text-white' 
                                    : 'bg-neutral-800 text-neutral-500 cursor-not-allowed'}`}
                        >
                            {editor.saveStatus.saving ? '保存中...' : '保存到文件'}
                        </button>
                    </div>
                </header>

                {/* 主内容区 - 三栏布局 */}
                <div className="flex-1 flex overflow-hidden">
                    {/* 左栏 - 技能列表 */}
                    <aside className="w-64 border-r border-neutral-800 flex flex-col bg-neutral-900/50">
                        <SkillList />
                    </aside>

                    {/* 中栏 - 编辑表单 */}
                    <main className="flex-1 overflow-y-auto">
                        {editor.currentSkill ? (
                            <SkillForm />
                        ) : (
                            <div className="h-full flex items-center justify-center text-neutral-500">
                                <div className="text-center">
                                    <Wand2 size={48} className="mx-auto mb-4 opacity-30" />
                                    <p>从左侧选择一个技能进行编辑</p>
                                    <p className="text-sm mt-2">或点击"新建技能"创建新的技能</p>
                                </div>
                            </div>
                        )}
                    </main>

                    {/* 右栏 - 预览面板 */}
                    <aside className="w-80 border-l border-neutral-800 flex flex-col bg-neutral-900/50">
                        <PreviewPanel />
                    </aside>
                </div>

                {/* 错误提示 */}
                {editor.saveStatus.error && (
                    <div className="absolute bottom-4 right-4 bg-red-900/90 text-red-200 px-4 py-2 rounded-lg shadow-lg">
                        保存失败: {editor.saveStatus.error}
                    </div>
                )}
            </div>
        </SkillEditorContext.Provider>
    );
}
