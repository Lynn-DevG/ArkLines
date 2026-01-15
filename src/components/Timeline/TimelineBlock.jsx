import React from 'react';
import { SKILLS } from '../../data/skills';
import { SKILL_TYPES } from '../../data/skillSchema';
import { BUFFS, getBuffDef } from '../../data/buffs';
import { X } from 'lucide-react';
import { useSimulation } from '../../store/SimulationContext';
import { resolveVariantForTimeline } from '../../engine/VariantResolver';

export const TimelineBlock = ({ action, pxPerSec, onRemove, onDragStart, comboInfo, onActionClick, isInvalid }) => {
    const { getResolvedSkill, getActionSkillLevel, actions, resolvedActionSkills } = useSimulation();
    
    // 获取角色的技能等级
    const skillLevel = getActionSkillLevel(action);
    
    // 获取原始技能定义
    const baseSkillDef = SKILLS[action.skillId];
    if (!baseSkillDef) return null;
    
    // 优先使用模拟器的解析结果（完整条件评估），回退到本地解析（编辑阶段预估）
    const simResolved = resolvedActionSkills?.get(action.id);
    const resolvedSkillDef = simResolved?.skillDef || resolveVariantForTimeline(action, actions);
    const resolvedComboInfo = simResolved?.comboInfo || comboInfo;
    
    // 获取带技能等级动态值的技能数据
    const skillDef = getResolvedSkill(action.skillId, skillLevel) || baseSkillDef;

    const typeConfig = SKILL_TYPES[baseSkillDef.type];
    const left = action.startTime * pxPerSec;

    // Visual override for Heavy
    let displayName = baseSkillDef.name;
    let styleClass = typeConfig.color;
    
    // 从解析后的变体获取 actions 和 duration
    let activeActions = resolvedSkillDef?.actions || resolvedSkillDef?.damage_ticks || skillDef.actions || skillDef.damage_ticks || [];
    let activeDuration = resolvedSkillDef?.duration || skillDef.duration;

    // 使用解析后的 comboInfo 显示名称
    const effectiveComboInfo = resolvedComboInfo || comboInfo;
    if (effectiveComboInfo) {
        if (effectiveComboInfo.isExecution) {
            displayName = '处决';
            styleClass = 'bg-red-700';
        } else if (effectiveComboInfo.isHeavy) {
            displayName = '重击';
            styleClass = 'bg-orange-600'; // Override color
        } else if (baseSkillDef.type === 'BASIC') {
            displayName = `普${effectiveComboInfo.step}`;
        }
    }

    // 使用解析后的 activeDuration 计算宽度
    const width = activeDuration * pxPerSec;

    return (
        <div
            className={`absolute rounded shadow-md border border-white/10 flex items-center px-2 hover:brightness-110 cursor-pointer transition-transform hover:scale-[1.02] z-10 ${styleClass} select-none ${isInvalid ? 'grayscale opacity-50 border-red-500' : ''}`}
            style={{
                left: `${left}px`,
                width: `${width}px`,
                height: '24px',
                top: '0px' // Positioning handled by parent track usually, or we pass top prop
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
                // 立即开始拖拽，无需死区检测
                onDragStart(e, action);
            }}
            onDoubleClick={(e) => {
                e.stopPropagation();
                // 双击打开技能详情
                if (onActionClick) onActionClick(e, action);
            }}
            title={`${skillDef.name} ${comboInfo ? '(连击 ' + comboInfo.step + ')' : ''}`}
        >
            <span className="text-[10px] font-bold text-white whitespace-nowrap drop-shadow-md truncate">
                {displayName}
            </span>
            <button
                onClick={(e) => { e.stopPropagation(); onRemove(action.id); }}
                className="absolute top-0 right-0 bottom-0 bg-black/20 hover:bg-red-500/80 w-5 flex items-center justify-center text-white opacity-0 hover:opacity-100 transition-opacity"
            >
                <X size={10} />
            </button>

            {/* Node Indicators (Damage Ticks / Actions) */}
            {activeActions.filter(a => a.type === 'damage' || a.atb !== undefined).map((tick, idx) => (
                <div
                    key={`tick-${idx}`}
                    className="absolute top-0 bottom-0 w-px bg-white/50"
                    style={{ left: `${((tick.offset || 0) / activeDuration) * 100}%` }}
                />
            ))}

            {/* Buff Duration Bars - 新格式：从 actions 中提取 add_buff 类型 */}
            {activeActions.filter(a => a.type === 'add_buff').map((buff, idx) => {
                const buffDef = getBuffDef(buff.buffId);
                
                // 优先使用解析后的动态值，其次使用配置的固定值
                let duration = buff._resolved_duration || buff.duration;
                
                // 根据 buff 类型决定颜色
                let color, borderColor;
                const buffType = buffDef?.type;
                
                switch (buffType) {
                    case 'ANOMALY':
                        // 法术异常 - 紫色
                        color = 'bg-purple-500/30';
                        borderColor = 'border-purple-500';
                        break;
                    case 'PHYSICAL_ANOMALY':
                        // 物理异常 - 橙色
                        color = 'bg-orange-500/30';
                        borderColor = 'border-orange-500';
                        break;
                    case 'ATTACHMENT':
                        // 附着 - 蓝色
                        color = 'bg-blue-500/30';
                        borderColor = 'border-blue-500';
                        break;
                    case 'DEBUFF':
                        // 减益 - 红色
                        color = 'bg-red-500/30';
                        borderColor = 'border-red-500';
                        break;
                    default:
                        // 增益或其他 - 绿色
                        color = 'bg-green-400/30';
                        borderColor = 'border-green-400';
                }

                // Lookup duration if still missing
                if (!duration) {
                    if (buffDef) {
                        if (buffDef.duration) {
                            duration = buffDef.duration;
                        } else if (buffDef.durations && buffDef.durations.length > 0) {
                            duration = buffDef.durations[0];
                        }
                    }
                }

                if (duration) {
                    const barLeft = (buff.offset || 0) * pxPerSec;
                    const barWidth = duration * pxPerSec;
                    const buffName = buffDef?.name || buff.buffId;
                    // 如果有解析后的动态值，显示实际值；否则显示配置信息
                    const tooltipText = buff._resolved_duration 
                        ? `${buffName} (${duration}秒, Lv.${skillLevel})`
                        : `${buffName} (${duration}秒)`;

                    return (
                        <div
                            key={`buff-${idx}`}
                            className={`absolute h-1.5 bottom-0 z-0 pointer-events-none border-l border-t rounded-br ${color} ${borderColor}`}
                            style={{
                                left: `${barLeft}px`,
                                width: `${barWidth}px`,
                                transform: 'translateY(100%)',
                                opacity: 0.8
                            }}
                            title={tooltipText}
                        />
                    );
                }
                return null;
            })}

            {/* 旧格式兼容：anomalies */}
            {!skillDef.actions && skillDef.anomalies && skillDef.anomalies.map((list, listIdx) => {
                return list.map((ano, anoIdx) => {
                    const buffDef = getBuffDef(ano.type);
                    let duration = ano.duration;
                    
                    // 根据 buff 类型决定颜色
                    let color, borderColor;
                    const buffType = buffDef?.type;
                    
                    switch (buffType) {
                        case 'ANOMALY':
                            color = 'bg-purple-500/30';
                            borderColor = 'border-purple-500';
                            break;
                        case 'PHYSICAL_ANOMALY':
                            color = 'bg-orange-500/30';
                            borderColor = 'border-orange-500';
                            break;
                        case 'ATTACHMENT':
                            color = 'bg-blue-500/30';
                            borderColor = 'border-blue-500';
                            break;
                        case 'DEBUFF':
                            color = 'bg-red-500/30';
                            borderColor = 'border-red-500';
                            break;
                        default:
                            color = 'bg-green-400/30';
                            borderColor = 'border-green-400';
                    }

                    if (!duration) {
                        if (buffDef) {
                            if (buffDef.duration) {
                                duration = buffDef.duration;
                            } else if (buffDef.durations && buffDef.durations.length > 0) {
                                duration = buffDef.durations[0];
                            }
                        }
                    }

                    if (duration) {
                        const barLeft = ano.offset * pxPerSec;
                        const barWidth = duration * pxPerSec;
                        const anoName = buffDef?.name || ano.type;

                        return (
                            <div
                                key={`ano-${listIdx}-${anoIdx}`}
                                className={`absolute h-1.5 bottom-0 z-0 pointer-events-none border-l border-t rounded-br ${color} ${borderColor}`}
                                style={{
                                    left: `${barLeft}px`,
                                    width: `${barWidth}px`,
                                    transform: 'translateY(100%)',
                                    opacity: 0.8
                                }}
                                title={`${anoName} (${duration}秒)`}
                            />
                        );
                    }
                    return null;
                });
            })}
        </div>
    );
};
