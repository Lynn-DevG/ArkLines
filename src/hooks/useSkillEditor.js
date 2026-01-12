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
    }, []);

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
    
    // 添加 Action
    const addAction = useCallback((actionType = 'damage') => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const template = createActionTemplate(actionType);
        const actions = [...(skills[currentSkillId].actions || []), template];
        
        updateCurrentSkill({ actions });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // 更新 Action
    const updateAction = useCallback((index, updates) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...(skills[currentSkillId].actions || [])];
        actions[index] = { ...actions[index], ...updates };
        
        updateCurrentSkill({ actions });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // 删除 Action
    const removeAction = useCallback((index) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...(skills[currentSkillId].actions || [])];
        actions.splice(index, 1);
        
        updateCurrentSkill({ actions });
    }, [currentSkillId, skills, updateCurrentSkill]);

    // 移动 Action
    const moveAction = useCallback((fromIndex, toIndex) => {
        if (!currentSkillId || !skills[currentSkillId]) return;
        
        const actions = [...(skills[currentSkillId].actions || [])];
        const [removed] = actions.splice(fromIndex, 1);
        actions.splice(toIndex, 0, removed);
        
        updateCurrentSkill({ actions });
    }, [currentSkillId, skills, updateCurrentSkill]);

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
        variants[index] = { ...variants[index], ...updates };
        
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
        
        // 状态
        isDirty,
        saveStatus,
        validationResult,
        filter,
        
        // 技能操作
        selectSkill,
        updateCurrentSkill,
        updateSkillField,
        createSkill,
        duplicateSkill,
        deleteSkill,
        
        // Action 操作
        addAction,
        updateAction,
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
