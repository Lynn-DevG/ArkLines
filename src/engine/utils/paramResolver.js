/**
 * paramResolver.js - 统一参数解析工具
 * 
 * 处理 xxxKey 动态值查找
 * 供 TimelineSimulator、ActionExecutor、SimulationContext 共用
 */

import { getSkillValue } from '../../data/levelMappings.js';
import { SKILLS } from '../../data/skills.js';

/**
 * 通用参数值解析函数
 * 
 * 如果参数配置了对应的 xxxKey，则从 JSON 中查找；否则使用配置的固定值
 * 
 * @param {Object} node - action 配置对象
 * @param {string} paramName - 参数名（如 'value', 'stacks', 'duration'）
 * @param {*} defaultValue - 默认值
 * @param {Object} context - 上下文，包含 skillId 和 skillLevel
 * @returns {*} 解析后的参数值
 * 
 * @example
 * // 配置示例：
 * // { "stacks": 2 }                    → 返回固定值 2
 * // { "stacksKey": "buff_stacks" }     → 从 JSON 查找 buff_stacks
 * // { "stacks": 2, "stacksKey": "x" }  → 优先使用 xxxKey 查找
 */
export function resolveValue(node, paramName, defaultValue, context) {
    const keyName = `${paramName}Key`;
    
    // 如果配置了 xxxKey，则从 JSON 中查找
    if (node[keyName] && context.skillId) {
        const value = getSkillValue(
            context.skillId, 
            node[keyName], 
            context.skillLevel || 1,
            node.index || null
        );
        // 如果查找到有效值，返回它；否则回退到固定值或默认值
        if (value !== 0 || node[paramName] === undefined) {
            return value;
        }
    }
    
    // 检查是否有预解析的值（来自 SimulationContext）
    const resolvedKey = `_resolved_${paramName}`;
    if (node[resolvedKey] !== undefined) {
        return node[resolvedKey];
    }
    
    // 使用配置的固定值或默认值
    return node[paramName] !== undefined ? node[paramName] : defaultValue;
}

/**
 * 获取角色终结技能量上限
 * 
 * @param {string} charId - 角色ID
 * @param {Array} characters - 角色列表
 * @returns {number} 终结技能量上限
 */
export function getMaxUsp(charId, characters) {
    const char = characters?.find(c => c.id === charId);
    if (!char?.skills?.ultimate) return 100;
    const ultSkill = SKILLS?.[char.skills.ultimate];
    return ultSkill?.uspCost || 100;
}

/**
 * 解析 action 中的所有动态参数
 * 
 * @param {Object} action - action 配置对象
 * @param {Object} context - 上下文
 * @returns {Object} 解析后的 action
 */
export function resolveActionParams(action, context) {
    if (!action) return action;
    
    const resolved = { ...action };
    const paramKeys = ['duration', 'stacks', 'value', 'atb', 'usp', 'poise', 'scaling'];
    
    paramKeys.forEach(param => {
        const keyName = `${param}Key`;
        if (resolved[keyName] && context.skillId) {
            const value = getSkillValue(
                context.skillId, 
                resolved[keyName], 
                context.skillLevel || 1,
                resolved.index || null
            );
            if (value !== 0) {
                resolved[`_resolved_${param}`] = value;
            }
        }
    });
    
    return resolved;
}
