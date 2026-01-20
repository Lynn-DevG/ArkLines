import React, { useMemo } from 'react';
import { SKILLS } from '../../data/skills';
import { SKILL_TYPES } from '../../data/skillSchema';
import { getBuffDef } from '../../data/buffs';
import { X, Zap, Clock, Info } from 'lucide-react';
import { useSimulation } from '../../store/SimulationContext';
import { resolveVariantForTimeline } from '../../engine/VariantResolver';

export const ActionInspector = ({ action, onClose }) => {
    const { actions, getResolvedSkill, getActionSkillLevel, resolvedActionSkills, logs } = useSimulation();

    if (!action) return null;
    
    // 获取角色的技能等级
    const skillLevel = getActionSkillLevel(action);
    
    // 获取原始技能定义
    const baseSkill = SKILLS[action.skillId];
    if (!baseSkill) return null;
    
    // 优先使用模拟器的解析结果（完整条件评估），回退到本地解析（编辑阶段预估）
    const simResolved = resolvedActionSkills?.get(action.id);
    const resolvedVariant = simResolved?.skillDef || resolveVariantForTimeline(action, actions);
    
    // 获取带技能等级动态值的技能数据，然后合并变体覆盖
    const skillWithLevel = getResolvedSkill(action.skillId, skillLevel) || baseSkill;
    
    // 合并变体覆盖（变体优先）
    const skill = resolvedVariant 
        ? { ...skillWithLevel, ...resolvedVariant, type: baseSkill.type }
        : skillWithLevel;

    const typeConfig = SKILL_TYPES[baseSkill.type];
    
    const actionDamage = useMemo(() => {
        const list = (logs || []).filter(l => l && l.actionId === action.id && l.type === 'DAMAGE');
        return list.reduce((acc, l) => acc + (l.value || 0), 0);
    }, [logs, action.id]);

    return (
        <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-700">
            <div className="p-4 border-b border-neutral-700 flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300">
                    <Info size={20} /> 技能详情
                </h2>
                <button onClick={onClose} className="text-neutral-400 hover:text-[#ffff21] transition-colors">
                    <X size={16} />
                </button>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto">
                {/* Header */}
                <div className={`p-3 rounded-lg border border-white/10 ${typeConfig.color}`}>
                    <div className="font-bold text-white text-lg">{skill.name}</div>
                    <div className="text-white/60 text-xs font-mono uppercase mt-1">{typeConfig?.name || skill.type}</div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-neutral-800 p-2 rounded">
                        <div className="text-neutral-400 mb-1 flex items-center gap-1"><Clock size={10} /> 开始时间</div>
                        <div className="text-white font-mono">{action.startTime.toFixed(2)}秒</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded">
                        <div className="text-neutral-400 mb-1 flex items-center gap-1"><Clock size={10} /> 持续时间</div>
                        <div className="text-white font-mono">{skill.duration}秒</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded">
                        <div className="text-neutral-400 mb-1 flex items-center gap-1"><Zap size={10} /> 技力消耗</div>
                        <div className="text-white font-mono">{skill.atbCost || 0}</div>
                    </div>
                    <div className="bg-neutral-800 p-2 rounded">
                        <div className="text-neutral-400 mb-1 flex items-center gap-1"><Zap size={10} /> 本次伤害</div>
                        <div className="text-white font-mono">{Math.round(actionDamage).toLocaleString()}</div>
                    </div>
                </div>

                {/* Nodes Timeline (Actions / Damage Ticks & Anomalies) */}
                <div>
                    <h3 className="text-xs font-bold text-neutral-400 mb-2 uppercase tracking-wider">技能事件</h3>
                    <div className="space-y-2">
                        {/* 新格式：actions 数组 */}
                        {skill.actions && skill.actions.map((act, i) => {
                            // 辅助函数：获取解析后的值或固定值
                            const getVal = (paramName, defaultVal = 0) => {
                                return act[`_resolved_${paramName}`] ?? act[paramName] ?? defaultVal;
                            };
                            const hasResolvedVal = (paramName) => act[`_resolved_${paramName}`] !== undefined;
                            
                            if (act.type === 'damage') {
                                const scaling = act._resolved_scaling;
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-red-400 font-bold uppercase">伤害</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className="text-neutral-300">
                                            {act.element && <span className="mr-2">元素: {act.element}</span>}
                                            {scaling !== undefined && <span className="text-cyan-400 mr-2">倍率: {(scaling * 100).toFixed(1)}%</span>}
                                            {act.atb ? `技力: +${act.atb} ` : ''}
                                            {act.poise ? `失衡值: +${act.poise}` : ''}
                                            {act.scalingKey && !scaling && <span className="text-neutral-500 ml-2">[{act.scalingKey}]</span>}
                                        </div>
                                    </div>
                                );
                            } else if (act.type === 'add_buff') {
                                const buffName = getBuffDef(act.buffId)?.name || act.buffId;
                                const stacks = getVal('stacks', 1);
                                const duration = getVal('duration', null);
                                const durationResolved = hasResolvedVal('duration');
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-amber-400 font-bold uppercase">施加状态</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className="text-neutral-300">
                                            {buffName} {stacks > 1 ? `x${stacks}` : ''} 
                                            {duration !== null && (
                                                <span className={durationResolved ? 'text-cyan-400' : ''}>
                                                    ({duration}秒{durationResolved ? ` Lv.${skillLevel}` : ''})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            } else if (act.type === 'consume_buff') {
                                const buffName = getBuffDef(act.buffId)?.name || act.buffId;
                                const stacks = getVal('stacks', 1);
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-purple-400 font-bold uppercase">消耗状态</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className="text-neutral-300">
                                            {buffName} {stacks > 1 ? `x${stacks}` : ''}
                                        </div>
                                    </div>
                                );
                            } else if (act.type === 'recover_usp_self' || act.type === 'recover_usp_team') {
                                const value = getVal('value', 0);
                                const isResolved = hasResolvedVal('value');
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-yellow-400 font-bold uppercase">
                                                {act.type === 'recover_usp_self' ? '回复能量(自身)' : '回复能量(全队)'}
                                            </span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className={isResolved ? 'text-cyan-400' : 'text-neutral-300'}>
                                            +{value}{isResolved ? ` (Lv.${skillLevel})` : ''}
                                        </div>
                                    </div>
                                );
                            } else if (act.type === 'recover_atb') {
                                const value = getVal('value', 0);
                                const isResolved = hasResolvedVal('value');
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-blue-400 font-bold uppercase">回复技力</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className={isResolved ? 'text-cyan-400' : 'text-neutral-300'}>
                                            +{value}{isResolved ? ` (Lv.${skillLevel})` : ''}
                                        </div>
                                    </div>
                                );
                            } else if (act.type === 'add_stagger') {
                                const value = getVal('value', 0) || getVal('poise', 0);
                                const isResolved = hasResolvedVal('value') || hasResolvedVal('poise');
                                return (
                                    <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-orange-400 font-bold uppercase">增加失衡</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                        </div>
                                        <div className={isResolved ? 'text-cyan-400' : 'text-neutral-300'}>
                                            +{value}{isResolved ? ` (Lv.${skillLevel})` : ''}
                                        </div>
                                    </div>
                                );
                            }
                            // 默认显示
                            return (
                                <div key={`action-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                    <div className="flex justify-between mb-1">
                                        <span className="text-neutral-400 font-bold uppercase">{act.type}</span>
                                        <span className="text-neutral-500 font-mono">{(action.startTime + (act.offset || 0)).toFixed(2)}秒</span>
                                    </div>
                                </div>
                            );
                        })}
                        
                        {/* 旧格式兼容：damage_ticks */}
                        {!skill.actions && skill.damage_ticks && skill.damage_ticks.map((tick, i) => (
                            <div key={`tick-${i}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                <div className="flex justify-between mb-1">
                                    <span className="text-red-400 font-bold uppercase">伤害</span>
                                    <span className="text-neutral-500 font-mono">{(action.startTime + tick.offset).toFixed(2)}秒</span>
                                </div>
                                <div className="text-neutral-300">
                                    {tick.atb ? `技力: +${tick.atb} ` : ''}
                                    {tick.poise ? `失衡值: +${tick.poise}` : ''}
                                </div>
                            </div>
                        ))}
                        
                        {/* 旧格式兼容：anomalies */}
                        {!skill.actions && skill.anomalies && skill.anomalies.map((list, listIdx) => (
                            list.map((ano, anoIdx) => {
                                const anoName = getBuffDef(ano.type)?.name || ano.type;
                                return (
                                    <div key={`ano-${listIdx}-${anoIdx}`} className="bg-neutral-800/50 p-2 rounded border border-neutral-700 text-xs">
                                        <div className="flex justify-between mb-1">
                                            <span className="text-amber-400 font-bold uppercase">状态</span>
                                            <span className="text-neutral-500 font-mono">{(action.startTime + ano.offset).toFixed(2)}秒</span>
                                        </div>
                                        <div className="text-neutral-300">
                                            {anoName} x{ano.stacks || 1} ({ano.duration}秒)
                                        </div>
                                    </div>
                                );
                            })
                        ))}
                        
                        {/* 无事件时显示提示 */}
                        {!skill.actions && !skill.damage_ticks && !skill.anomalies && (
                            <div className="text-neutral-500 text-xs">无技能事件</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
