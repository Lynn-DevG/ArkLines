import React, { useMemo } from 'react';
import { useSimulation } from '../../store/SimulationContext';
import { Activity, Terminal, Bug } from 'lucide-react';
import { getBuffDef } from '../../data/buffs';
import { SKILLS } from '../../data/skills';
import { getElementColor, normalizeElement } from '../../utils/skillIconUtils';

// 获取buff显示名称（优先使用中文名称）
const getBuffDisplayName = (buffId) => {
    const buffDef = getBuffDef(buffId);
    return buffDef?.name || buffId;
};

const ELEMENT_LABELS = {
    physical: '物理',
    blaze: '灼热',
    cold: '寒冷',
    nature: '自然',
    emag: '电磁'
};

const getElementLabel = (element) => {
    const normalized = normalizeElement(element);
    return ELEMENT_LABELS[normalized] || normalized;
};

const resolveLogElement = (log) => {
    if (!log) return null;
    if (log.element) return log.element;
    if (log.type === 'DAMAGE' && log.skillId) {
        return SKILLS?.[log.skillId]?.element;
    }
    if (log.type === 'DOT' && log.source) {
        return getBuffDef(log.source)?.element;
    }
    if (log.type === 'REACTION_DAMAGE' && log.anomalyId) {
        return getBuffDef(log.anomalyId)?.element;
    }
    return null;
};

export const StatsDashboard = () => {
    const { totalDamage, logs, actions, team, invalidActionIds, invalidConflictActionIds, debugMode, setDebugMode } = useSimulation();

    // Latest logs first
    const reversedLogs = [...logs].reverse();
    
    const analysis = useMemo(() => {
        const damageLogs = logs.filter(l => ['DAMAGE', 'DOT', 'REACTION_DAMAGE'].includes(l.type));
        const maxTime = damageLogs.reduce((m, l) => Math.max(m, l.time || 0), 0);
        const effectiveTime = Math.max(1, maxTime);
        const dps = totalDamage / effectiveTime;
        const dpm = dps * 60;
        
        const invalidIds = new Set([...(invalidActionIds || []), ...(invalidConflictActionIds || [])]);
        const validActions = (actions || []).filter(a => !invalidIds.has(a.id));
        
        // 按角色
        const bySource = {};
        damageLogs.forEach(l => {
            const key = l.type === 'DOT' ? `DOT:${l.source}` : (l.source || '未知');
            bySource[key] = (bySource[key] || 0) + (l.value || 0);
        });
        
        // 按技能（仅 DAMAGE 且带 skillId）
        const bySkillId = {};
        logs.forEach(l => {
            if (l.type !== 'DAMAGE') return;
            if (!l.skillId) return;
            bySkillId[l.skillId] = (bySkillId[l.skillId] || 0) + (l.value || 0);
        });
        
        // 按技能类型
        const bySkillType = {};
        logs.forEach(l => {
            if (l.type !== 'DAMAGE') return;
            const t = l.skillType || 'UNKNOWN';
            bySkillType[t] = (bySkillType[t] || 0) + (l.value || 0);
        });
        
        // 按时间段（10秒一段）
        const bucketSize = 10;
        const bucketCount = Math.max(1, Math.ceil(effectiveTime / bucketSize));
        const buckets = Array.from({ length: bucketCount }).map((_, i) => ({
            start: i * bucketSize,
            end: (i + 1) * bucketSize,
            damage: 0
        }));
        damageLogs.forEach(l => {
            const idx = Math.min(bucketCount - 1, Math.floor((l.time || 0) / bucketSize));
            buckets[idx].damage += (l.value || 0);
        });
        
        const topBy = (obj, topN = 8) => Object.entries(obj)
            .sort((a, b) => b[1] - a[1])
            .slice(0, topN);
        
        return {
            effectiveTime,
            dps,
            dpm,
            validActionCount: validActions.length,
            totalActionCount: (actions || []).length,
            topSources: topBy(bySource, 8),
            topSkills: topBy(bySkillId, 8),
            topTypes: topBy(bySkillType, 8),
            buckets
        };
    }, [logs, totalDamage, actions, invalidActionIds, invalidConflictActionIds]);

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-neutral-700 bg-neutral-900/50">
                <h2 className="text-lg font-bold flex items-center gap-2 text-neutral-300">
                    <Activity size={20} />
                    数据分析
                </h2>
            </div>

            <div className="p-4 space-y-4 flex-shrink-0">
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <div className="text-xs text-neutral-400 uppercase">有效总伤害</div>
                        <div className="text-2xl font-bold text-white tracking-tight">{totalDamage.toLocaleString()}</div>
                        <div className="text-[10px] text-neutral-500 mt-1">
                            有效技能 {analysis.validActionCount}/{analysis.totalActionCount} · 时长 {analysis.effectiveTime.toFixed(1)}s
                        </div>
                    </div>
                    <div className="bg-neutral-800 p-4 rounded-lg border border-neutral-700">
                        <div className="text-xs text-neutral-400 uppercase">DPS / DPM</div>
                        <div className="text-lg font-bold text-white tracking-tight">
                            {Math.round(analysis.dps).toLocaleString()} / {Math.round(analysis.dpm).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-neutral-500 mt-1">基于有效伤害与日志时长</div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-800/50 p-3 rounded border border-neutral-700">
                        <div className="text-xs text-neutral-400 mb-2">技能类型占比</div>
                        <div className="space-y-1 text-[10px]">
                            {analysis.topTypes.length === 0 && <div className="text-neutral-600">暂无</div>}
                            {analysis.topTypes.map(([type, dmg]) => (
                                <div key={type} className="flex justify-between">
                                    <span className="text-neutral-300">{type}</span>
                                    <span className="text-white font-mono">{Math.round(dmg).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-neutral-800/50 p-3 rounded border border-neutral-700">
                        <div className="text-xs text-neutral-400 mb-2">时间段伤害（每10秒）</div>
                        <div className="space-y-1 text-[10px]">
                            {analysis.buckets.map((b, idx) => (
                                <div key={idx} className="flex justify-between">
                                    <span className="text-neutral-300">{b.start}-{b.end}s</span>
                                    <span className="text-white font-mono">{Math.round(b.damage).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-800/50 p-3 rounded border border-neutral-700">
                        <div className="text-xs text-neutral-400 mb-2">Top 伤害来源</div>
                        <div className="space-y-1 text-[10px]">
                            {analysis.topSources.length === 0 && <div className="text-neutral-600">暂无</div>}
                            {analysis.topSources.map(([src, dmg]) => (
                                <div key={src} className="flex justify-between">
                                    <span className="text-neutral-300 truncate">{src.startsWith('DOT:') ? getBuffDisplayName(src.slice(4)) : src}</span>
                                    <span className="text-white font-mono">{Math.round(dmg).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-neutral-800/50 p-3 rounded border border-neutral-700">
                        <div className="text-xs text-neutral-400 mb-2">Top 技能伤害</div>
                        <div className="space-y-1 text-[10px]">
                            {analysis.topSkills.length === 0 && <div className="text-neutral-600">暂无（需要技能命中日志）</div>}
                            {analysis.topSkills.map(([skillId, dmg]) => (
                                <div key={skillId} className="flex justify-between">
                                    <span className="text-neutral-300 truncate">{SKILLS?.[skillId]?.name || skillId}</span>
                                    <span className="text-white font-mono">{Math.round(dmg).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* 调试模式开关（仅开发环境显示） */}
                {import.meta.env.DEV && (
                    <>
                        <button
                            onClick={() => setDebugMode(!debugMode)}
                            className={`flex items-center gap-2 px-3 py-2 rounded text-xs transition-all w-full justify-center ${
                                debugMode 
                                    ? 'bg-amber-500/20 border border-amber-500/50 text-amber-400' 
                                    : 'bg-neutral-800 border border-neutral-700 text-neutral-500 hover:text-neutral-300'
                            }`}
                        >
                            <Bug size={14} />
                            <span>{debugMode ? '调试模式已开启' : '开启调试模式'}</span>
                        </button>
                        {debugMode && (
                            <div className="text-[10px] text-amber-500/70 text-center">
                                伤害计算详情将打印到浏览器控制台 (F12)
                            </div>
                        )}
                    </>
                )}
            </div>

            <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
                <h3 className="text-xs font-bold text-neutral-400 mb-2 flex items-center gap-2">
                    <Terminal size={12} /> 战斗日志
                </h3>
                <div className="flex-1 bg-black/50 rounded border border-neutral-800 p-2 overflow-y-auto font-mono text-[10px] leading-relaxed custom-scrollbar">
                    {reversedLogs.length === 0 && <div className="text-neutral-600 italic p-2">准备模拟中...</div>}
                    {reversedLogs.map((log, i) => {
                        const timeValue = Number(log?.time);
                        const timeLabel = Number.isFinite(timeValue) ? timeValue.toFixed(1) : '--';
                        const element = resolveLogElement(log);
                        const elementLabel = element ? getElementLabel(element) : null;
                        const elementColor = element ? getElementColor(element) : null;
                        const isDamageLog = ['DAMAGE', 'DOT', 'REACTION_DAMAGE'].includes(log?.type);
                        const skillName = log?.skillId ? (SKILLS?.[log.skillId]?.name || log.skillId) : null;
                        const anomalyName = log?.anomalyName || (log?.anomalyId ? getBuffDisplayName(log.anomalyId) : null);
                        const reactionName = log?.reactionType === 'BURST' && elementLabel
                            ? `${elementLabel}爆发`
                            : anomalyName;
                        const damageValue = Math.round(log?.value || 0).toLocaleString();
                        const infoClassName = {
                            STATUS: 'text-yellow-500',
                            REACTION: 'text-red-400 font-bold glow',
                            STAGGER: 'text-amber-400',
                            STAGGER_ADD: 'text-orange-400',
                            COMBO_CONSUME: 'text-purple-400',
                            BUFF_APPLIED: 'text-emerald-400',
                            BUFF_CONSUMED: 'text-emerald-400',
                            ATB_GAIN: 'text-sky-400',
                            USP_GAIN: 'text-yellow-400',
                            USP_GAIN_TEAM: 'text-yellow-400'
                        }[log?.type] || 'text-neutral-300';

                        return (
                            <div key={i} className="mb-1 border-b border-white/5 pb-1">
                                <span className="text-neutral-500">[{timeLabel}秒]</span>{' '}
                                {isDamageLog && (
                                    <>
                                        <span className="text-neutral-300 font-bold">
                                            {log.type === 'DOT' ? getBuffDisplayName(log.source) : (log.source || '未知')}
                                        </span>
                                        <span className="text-neutral-400">
                                            {log.type === 'REACTION_DAMAGE' ? ' 触发爆发，造成 ' : ' 造成 '}
                                        </span>
                                        <span className={`font-bold ${log.type === 'REACTION_DAMAGE' ? 'text-amber-400 glow' : 'text-white'}`}>
                                            {damageValue}
                                        </span>
                                        <span className="text-neutral-400">
                                            {log.type === 'DOT' ? ' 持续伤害' : ' 伤害'}
                                        </span>
                                        {elementLabel && (
                                            <span className="ml-1" style={{ color: elementColor }}>
                                                [{elementLabel}]
                                            </span>
                                        )}
                                        {reactionName && (
                                            <span className="text-neutral-500 ml-1">({reactionName})</span>
                                        )}
                                        {skillName && log.type === 'DAMAGE' && (
                                            <span className="text-neutral-500 ml-1">[{skillName}]</span>
                                        )}
                                    </>
                                )}
                                {!isDamageLog && log?.detail && (
                                    <span className={infoClassName}>{log.detail}</span>
                                )}
                                {!isDamageLog && !log?.detail && log?.type && (
                                    <span className="text-neutral-500">{log.type}</span>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
