import { useState, useEffect, useCallback, useMemo } from 'react';
import { SKILLS } from '../data/skills';
import { validateSkill, createSkillTemplate, createActionTemplate } from '../data/skillSchema';
import { saveSkillsToFile, generateSkillId, generateVariantId } from '../utils/skillFileGenerator';

const STORAGE_KEY = 'skill_editor_draft';

/**
 * useSkillEditor - 技能编辑器状态管理 Hook
 */
export function useSkillEditor() {
    // 所有技能数据
    const [skills, setSkills] = useState({});
    // 当前选中的技能 ID
    const [currentSkillId, setCurrentSkillId] = useState(null);
    // 当前选中的变体索引 (-1 表示主技能)
    const [activeVariantIndex, setActiveVariantIndex] = useState(-1);
    // 当前选中的行为索引 (null 表示未选中)
    const [selectedActionIndex, setSelectedActionIndex] = useState(null);
    // 是否有未保存的修改
    const [isDirty, setIsDirty] = useState(false);
    // 保存状态
    const [saveStatus, setSaveStatus] = useState({ saving: false, lastSaved: null, error: null });
    // 搜索/筛选
    const [filter, setFilter] = useState({ search: '', type: 'all' });

    // 初始化：从 SKILLS 加载数据，检查 localStorage 是否有草稿
    useEffect(() => {
        const savedDraft = localStorage.getItem(STORAGE_KEY);
        if (savedDraft) {
            try {
                const draft = JSON.parse(savedDraft);
                // 如果有草稿，询问是否恢复
                if (Object.keys(draft).length > 0) {
                    setSkills(draft);
                    setIsDirty(true);
                    return;
                }
            } catch (e) {
                console.error('Failed to parse draft:', e);
            }
        }
        // 否则从 SKILLS 加载
        setSkills({ ...SKILLS });
    }, []);

    // 自动保存草稿到 localStorage
    useEffect(() => {
        if (isDirty) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
        }
    }, [skills, isDirty]);

    // 当前编辑的技能
    const currentSkill = useMemo(() => {
        return currentSkillId ? skills[currentSkillId] : null;
    }, [skills, currentSkillId]);

    // 验证当前技能
    const validationResult = useMemo(() => {
        if (!currentSkill) return { valid: true, errors: [] };
        return validateSkill(currentSkill);
    }, [currentSkill]);

    // 筛选后的技能列表
    const filteredSkills = useMemo(() => {
        return Object.values(skills).filter(skill => {
            // 搜索过滤
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                if (!skill.name?.toLowerCase().includes(searchLower) &&
                    !skill.id?.toLowerCase().includes(searchLower)) {
                    return false;
                }
            }
            // 类型过滤
            if (filter.type !== 'all' && skill.type !== filter.type) {
                return false;
            }
            return true;
        }).sort((a, b) => {
            // 按 ID 排序
            return (a.id || '').localeCompare(b.id || '');
        });
    }, [skills, filter]);

    // 按角色分组的技能
    const skillsByCharacter = useMemo(() => {
        const grouped = {};
        Object.values(skills).forEach(skill => {
            // 从 skill.id 提取角色前缀 (如 chr_0003_endminf)
            const match = skill.id?.match(/^(chr_\d+_[a-z]+)_/);
            const charKey = match ? match[1] : 'other';
            if (!grouped[charKey]) {
                grouped[charKey] = [];
            }
            grouped[charKey].push(skill);
        });
        return grouped;
    }, [skills]);

    // 选择技能
    const selectSkill = useCallback((skillId) => {
        setCurrentSkillId(skillId);
        setActiveVariantIndex(-1); // 重置为主技能
        setSelectedActionIndex(null); // 重置选中的行为
    }, []);

    // 选择变体
    const selectVariant = useCallback((index) => {
        setActiveVariantIndex(index);
        setSelectedActionIndex(null); // 重置选中的行为
    }, []);

    // 选择行为
    const selectAction = useCallback((index) => {
        setSelectedActionIndex(index);
    }, []);

    // 获取当前编辑的数据（主技能或变体）
    const currentEditingData = useMemo(() => {
        if (!currentSkill) return null;
        if (activeVariantIndex === -1) {
            return currentSkill;
        }
        return currentSkill.variants?.[activeVariantIndex] || null;
    }, [currentSkill, activeVariantIndex]);

    // 获取当前编辑数据的 actions
    const currentActions = useMemo(() => {
        if (!currentEditingData) return [];
        return currentEditingData.actions || [];
    }, [currentEditingData]);

    // 获取当前选中的行为
    const selectedAction = useMemo(() => {
        if (selectedActionIndex === null || !currentActions[selectedActionIndex]) {
            return null;
        }
        return currentActions[selectedActionIndex];
    }, [currentActions, selectedActionIndex]);

    // 更新当前技能
    const updateCurrentSkill = useCallback((updates) => {
        if (!currentSkillId) return;
        
        setSkills(prev => ({
            ...prev,
            [currentSkillId]: {
                ...prev[currentSkillId],
                ...updates
            }
        }));
        setIsDirty(true);
    }, [currentSkillId]);

    // 更新技能的特定字段
    const updateSkillField = useCallback((field, value) => {
        updateCurrentSkill({ [field]: value });
    }, [updateCurrentSkill]);

    // 创建新技能
    const createSkill = useCallback((type = 'BASIC', baseId = '') => {
        const id = baseId || generateSkillId('new_skill');
        const template = createSkillTemplate(type);
        const newSkill = {
            ...template,
            id,
            name: '新技能'
        };
        
        setSkills(prev => ({
            ...prev,
            [id]: newSkill
        }));
        setCurrentSkillId(id);
        setIsDirty(true);
        
        return id;
    }, []);

    // 复制技能
    const duplicateSkill = useCallback((skillId) => {
        const source = skills[skillId];
        if (!source) return null;
        
        const newId = generateSkillId(skillId + '_copy');
        const newSkill = {
            ...JSON.parse(JSON.stringify(source)),
            id: newId,
            name: source.name + ' (副本)'
        };
        
        setSkills(prev => ({
            ...prev,
            [newId]: newSkill
        }));
        setCurrentSkillId(newId);
        setIsDirty(true);
        
        return newId;
    }, [skills]);

    // 删除技能
    const deleteSkill = useCallback((skillId) => {
        setSkills(prev => {
            const newSkills = { ...prev };
            delete newSkills[skillId];
            return newSkills;
        });
        
        if (currentSkillId === skillId) {
            setCurrentSkillId(null);
        }
        setIsDirty(true);
    }, [currentSkillId]);

    // === Action 操作 ===
    
    // 辅助函数：更新当前编辑数据的 actions
    const updateCurrentActions = useCallback((newActions) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        if (activeVariantIndex === -1) {
            // 更新主技能
            updateCurrentSkill({ actions: newActions });
        } else {
            // 更新变体
            const variants = [...(skills[currentSkillId].variants || [])];
            if (variants[activeVariantIndex]) {
                variants[activeVariantIndex] = {
                    ...variants[activeVariantIndex],
                    actions: newActions
                };
                updateCurrentSkill({ variants });
            }
        }
    }, [currentSkillId, skills, activeVariantIndex, updateCurrentSkill]);
    
    // 添加 Action
    const addAction = useCallback((actionType = 'damage') => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const template = createActionTemplate(actionType);
        const actions = [...currentActions, template];
        
        updateCurrentActions(actions);
        // 选中新添加的行为
        setSelectedActionIndex(actions.length - 1);
    }, [currentSkillId, skills, currentActions, updateCurrentActions]);

    // 更新 Action
    const updateAction = useCallback((index, updates) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...currentActions];
        const merged = { ...actions[index], ...updates };
        
        // 清理 undefined 值，确保导出的 JSON 干净
        Object.keys(merged).forEach(key => {
            if (merged[key] === undefined) {
                delete merged[key];
            }
        });
        
        actions[index] = merged;
        
        updateCurrentActions(actions);
    }, [currentSkillId, skills, currentActions, updateCurrentActions]);

    // 更新 Action 的 offset（用于时间轴拖拽）
    const updateActionOffset = useCallback((index, newOffset) => {
        // 对齐到 0.01 秒
        const alignedOffset = Math.round(newOffset * 100) / 100;
        updateAction(index, { offset: Math.max(0, alignedOffset) });
    }, [updateAction]);

    // 删除 Action
    const removeAction = useCallback((index) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...currentActions];
        actions.splice(index, 1);
        
        updateCurrentActions(actions);
        
        // 重置选中状态
        if (selectedActionIndex === index) {
            setSelectedActionIndex(null);
        } else if (selectedActionIndex !== null && selectedActionIndex > index) {
            setSelectedActionIndex(selectedActionIndex - 1);
        }
    }, [currentSkillId, skills, currentActions, updateCurrentActions, selectedActionIndex]);

    // 移动 Action
    const moveAction = useCallback((fromIndex, toIndex) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...currentActions];
        const [removed] = actions.splice(fromIndex, 1);
        actions.splice(toIndex, 0, removed);
        
        updateCurrentActions(actions);
        
        // 更新选中状态
        if (selectedActionIndex === fromIndex) {
            setSelectedActionIndex(toIndex);
        }
    }, [currentSkillId, skills, currentActions, updateCurrentActions, selectedActionIndex]);

    // === Variant 操作 ===
    
    // 添加 Variant
    const addVariant = useCallback(() => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const newVariant = {
            id: generateVariantId(),
            name: '新变体',
            condition: [{ type: 'combo', value: 2 }],
            actions: []
        };
        
        const variants = [...(skills[currentSkillId].variants || []), newVariant];
        updateCurrentSkill({ variants });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // 更新 Variant
    const updateVariant = useCallback((index, updates) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const variants = [...(skills[currentSkillId].variants || [])];
        const merged = { ...variants[index], ...updates };
        
        // 清理 undefined 值，确保导出的 JSON 干净
        Object.keys(merged).forEach(key => {
            if (merged[key] === undefined) {
                delete merged[key];
            }
        });
        
        variants[index] = merged;
        
        updateCurrentSkill({ variants });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // 删除 Variant
    const removeVariant = useCallback((index) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const variants = [...(skills[currentSkillId].variants || [])];
        variants.splice(index, 1);
        
        updateCurrentSkill({ variants });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // === 保存操作 ===

    // 保存到文件
    const saveToFile = useCallback(async () => {
        setSaveStatus({ saving: true, lastSaved: null, error: null });
        
        try {
            const result = await saveSkillsToFile(skills);
            
            if (result.success) {
                setSaveStatus({ 
                    saving: false, 
                    lastSaved: new Date(), 
                    error: null 
                });
                setIsDirty(false);
                localStorage.removeItem(STORAGE_KEY);
                return true;
            } else {
                setSaveStatus({ 
                    saving: false, 
                    lastSaved: null, 
                    error: result.error || '保存失败' 
                });
                return false;
            }
        } catch (error) {
            setSaveStatus({ 
                saving: false, 
                lastSaved: null, 
                error: error.message 
            });
            return false;
        }
    }, [skills]);

    // 重置为原始数据
    const resetToOriginal = useCallback(() => {
        setSkills({ ...SKILLS });
        setIsDirty(false);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // 丢弃草稿
    const discardDraft = useCallback(() => {
        localStorage.removeItem(STORAGE_KEY);
        setSkills({ ...SKILLS });
        setIsDirty(false);
    }, []);

    return {
        // 数据
        skills,
        currentSkill,
        currentSkillId,
        filteredSkills,
        skillsByCharacter,
        
        // 当前编辑数据（主技能或选中的变体）
        currentEditingData,
        currentActions,
        selectedAction,
        
        // 状态
        isDirty,
        saveStatus,
        validationResult,
        filter,
        activeVariantIndex,
        selectedActionIndex,
        
        // 技能操作
        selectSkill,
        updateCurrentSkill,
        updateSkillField,
        createSkill,
        duplicateSkill,
        deleteSkill,
        
        // 变体/行为选择
        selectVariant,
        selectAction,
        
        // Action 操作
        addAction,
        updateAction,
        updateActionOffset,
        removeAction,
        moveAction,
        
        // Variant 操作
        addVariant,
        updateVariant,
        removeVariant,
        
        // 筛选
        setFilter,
        
        // 保存操作
        saveToFile,
        resetToOriginal,
        discardDraft
    };
}
