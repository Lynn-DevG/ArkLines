import React, { useMemo } from 'react';
import { TimelineBlock } from './TimelineBlock';
import { SKILLS } from '../../data/skills';
import { SKILL_TYPES } from '../../data/skillSchema';
import { ComboManager } from '../../engine/ComboManager';
import { FPS } from '../../config/simulation';
import { getBuffDef } from '../../data/buffs';

/**
 * 获取角色的终结技能量上限
 */
function getCharUspCost(char) {
    if (!char?.skills?.ultimate) return 100;
    const ultSkill = SKILLS[char.skills.ultimate];
    return ultSkill?.uspCost || 100;
}

export const TimelineTrackResolved = ({ 
    char, 
    actions, 
    uspTimeline = [], // 从模拟器传入的终结技能量变化数据
    buffIntervals = {}, // 从模拟器传入的 buff 区间数据
    pxPerSec, 
    onRemoveAction, 
    onActionDragStart, 
    onActionClick, 
    conflictingActionIds, 
    invalidResourceActionIds 
}) => {
    // 分轴高度配置
    const BLOCK_HEIGHT = 24; // 时间块高度保持不变
    const ULTIMATE_ROW_HEIGHT = 48; // 终结技分轴高度 (原40 * 1.5)
    const TACTICAL_CHAIN_ROW_HEIGHT = 48; // 战技+连携共轴高度 (原32 * 1.5)
    const BASIC_ROW_HEIGHT = 32; // 普攻分轴高度 (原28 * 1.5)
    
    const ROW_GAP = 2; // 分轴间距
    const TOP_PADDING = 4;
    const HEADER_WIDTH = 100;
    const COLOR_INDICATOR_WIDTH = 4; // 左侧颜色指示条宽度
    
    // 各分轴的顶部位置
    const ULTIMATE_TOP = TOP_PADDING;
    const TACTICAL_CHAIN_TOP = ULTIMATE_TOP + ULTIMATE_ROW_HEIGHT + ROW_GAP;
    const BASIC_TOP = TACTICAL_CHAIN_TOP + TACTICAL_CHAIN_ROW_HEIGHT + ROW_GAP;
    
    // Buff overlay 区域（额外增加高度，不挤压技能块）
    const BUFF_ROW_HEIGHT = 2;
    const BUFF_ROW_GAP = 2;
    const BUFF_ROWS = 5;
    const BUFF_AREA_HEIGHT = BUFF_ROWS * BUFF_ROW_HEIGHT + (BUFF_ROWS - 1) * BUFF_ROW_GAP;
    const BUFF_TOP = BASIC_TOP + BASIC_ROW_HEIGHT + ROW_GAP;
    
    // 计算总高度（包含 buff overlay 区域）
    const totalHeight = TOP_PADDING + ULTIMATE_ROW_HEIGHT + ROW_GAP + TACTICAL_CHAIN_ROW_HEIGHT + ROW_GAP + BASIC_ROW_HEIGHT + ROW_GAP + BUFF_AREA_HEIGHT + TOP_PADDING;
    
    // 获取终结技能量上限
    const uspCost = getCharUspCost(char);
    
    // 生成终结技能量背景填充的多边形点（阶梯状）
    // 使用帧数进行精确定位
    const generateUspFillPath = useMemo(() => {
        if (uspTimeline.length < 2) return null;
        
        const points = [];
        const fillHeight = ULTIMATE_ROW_HEIGHT - 2; // 留一点边距
        
        // 辅助函数：根据事件获取 x 坐标（优先使用帧数）
        const getX = (event) => {
            // 如果有帧数，使用帧数计算（更精确）
            if (event.frame !== undefined) {
                return (event.frame / FPS) * pxPerSec;
            }
            return event.time * pxPerSec;
        };
        
        // 从左下角开始
        points.push(`0,${fillHeight}`);
        
        // 添加能量变化点（阶梯状：先水平再垂直）
        for (let i = 0; i < uspTimeline.length; i++) {
            const event = uspTimeline[i];
            const x = getX(event);
            const energyRatio = event.energy / uspCost;
            const y = fillHeight - (energyRatio * fillHeight);
            
            // 如果不是第一个点，先画水平线到当前x位置（使用上一个点的y值）
            if (i > 0) {
                const prevEvent = uspTimeline[i - 1];
                const prevEnergyRatio = prevEvent.energy / uspCost;
                const prevY = fillHeight - (prevEnergyRatio * fillHeight);
                points.push(`${x},${prevY}`);
            }
            
            // 再画垂直线到当前y位置
            points.push(`${x},${y}`);
        }
        
        // 回到右下角
        const lastEvent = uspTimeline[uspTimeline.length - 1];
        const lastX = getX(lastEvent);
        points.push(`${lastX},${fillHeight}`);
        
        return points.join(' ');
    }, [uspTimeline, pxPerSec, uspCost, ULTIMATE_ROW_HEIGHT]);

    return (
        <div 
            className="flex-1 border-b border-neutral-800/50 relative group"
            style={{ minHeight: `${totalHeight}px`, height: `${totalHeight}px` }}
        >
            {/* 左侧角色名称区域 */}
            <div 
                className="absolute left-0 top-0 bottom-0 bg-neutral-900/80 z-20 flex border-r border-neutral-700"
                style={{ width: `${HEADER_WIDTH}px` }}
            >
                {/* 角色名称 */}
                <div className="flex-1 flex items-center px-2 overflow-hidden">
                    <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-tighter truncate">
                        {char.name}
                    </span>
                </div>
                
                {/* 右侧颜色指示条 */}
                <div 
                    className="flex flex-col"
                    style={{ width: `${COLOR_INDICATOR_WIDTH}px`, paddingTop: `${TOP_PADDING}px`, paddingBottom: `${TOP_PADDING}px` }}
                >
                    {/* 终结技颜色指示 */}
                    <div 
                        className={`${SKILL_TYPES['ULTIMATE'].color}`}
                        style={{ height: `${ULTIMATE_ROW_HEIGHT}px` }}
                    />
                    {/* 间隔 */}
                    <div style={{ height: `${ROW_GAP}px` }} />
                    {/* 连携技+战技共轴颜色指示（上下分色） */}
                    <div 
                        className="flex flex-col"
                        style={{ height: `${TACTICAL_CHAIN_ROW_HEIGHT}px` }}
                    >
                        <div 
                            className={`${SKILL_TYPES['CHAIN'].color}`}
                            style={{ height: '50%' }}
                        />
                        <div 
                            className={`${SKILL_TYPES['TACTICAL'].color}`}
                            style={{ height: '50%' }}
                        />
                    </div>
                    {/* 间隔 */}
                    <div style={{ height: `${ROW_GAP}px` }} />
                    {/* 普攻颜色指示 */}
                    <div 
                        className={`${SKILL_TYPES['BASIC'].color}`}
                        style={{ height: `${BASIC_ROW_HEIGHT}px` }}
                    />
                </div>
            </div>

            {/* 时间轴区域 */}
            <div 
                className="absolute right-0 top-0 bottom-0"
                style={{ left: `${HEADER_WIDTH}px` }}
            >
                {/* 分轴背景 */}
                <div className="absolute inset-0 pointer-events-none">
                    {/* 终结技分轴背景 */}
                    <div 
                        className="absolute w-full bg-amber-900/10 border-b border-neutral-700/30"
                        style={{ top: `${ULTIMATE_TOP}px`, height: `${ULTIMATE_ROW_HEIGHT}px` }}
                    >
                        {/* 终结技能量填充 */}
                        {generateUspFillPath && (
                            <svg 
                                className="absolute inset-0 w-full h-full overflow-visible"
                                preserveAspectRatio="none"
                            >
                                <polygon
                                    points={generateUspFillPath}
                                    fill="rgba(251, 191, 36, 0.15)"
                                    stroke="rgba(251, 191, 36, 0.3)"
                                    strokeWidth="1"
                                />
                            </svg>
                        )}
                    </div>
                    
                    {/* 连携技+战技共轴背景 */}
                    <div 
                        className="absolute w-full border-b border-neutral-700/30"
                        style={{ top: `${TACTICAL_CHAIN_TOP}px`, height: `${TACTICAL_CHAIN_ROW_HEIGHT}px` }}
                    >
                        {/* 上半部分（连携技区域） */}
                        <div 
                            className="absolute w-full bg-purple-900/5"
                            style={{ top: 0, height: '50%' }}
                        />
                        {/* 下半部分（战技区域） */}
                        <div 
                            className="absolute w-full bg-blue-900/5"
                            style={{ top: '50%', height: '50%' }}
                        />
                        {/* 中间分隔线 */}
                        <div 
                            className="absolute w-full border-t border-neutral-700/20"
                            style={{ top: '50%' }}
                        />
                    </div>
                    
                    {/* 普攻分轴背景 */}
                    <div 
                        className="absolute w-full bg-neutral-800/10"
                        style={{ top: `${BASIC_TOP}px`, height: `${BASIC_ROW_HEIGHT}px` }}
                    />
                    
                    {/* Buff overlay 背景 */}
                    <div
                        className="absolute w-full bg-neutral-950/20 border-t border-neutral-700/20"
                        style={{ top: `${BUFF_TOP}px`, height: `${BUFF_AREA_HEIGHT}px` }}
                    />
                </div>

                {/* 技能时间块 */}
                {(() => {
                    const sortedActions = [...actions].sort((a, b) => a.startTime - b.startTime);
                    const comboManager = new ComboManager();

                    return sortedActions.map(action => {
                        const skill = SKILLS[action.skillId];
                        if (!skill) return null;

                        let comboInfo = null;
                        if (skill.type === 'BASIC') {
                            const pred = comboManager.predictNext(action.charId, action.startTime, true);
                            // 显式添加 isExecution: false，因为 UI 层无法准确判断处决状态
                            // 真正的处决判断由模拟器通过 resolvedActionSkills 提供
                            comboInfo = { ...pred, isExecution: false };
                        }

                        // 根据技能类型计算位置
                        let top;
                        
                        switch (skill.type) {
                            case 'ULTIMATE':
                                // 终结技：在分轴内垂直居中
                                top = ULTIMATE_TOP + (ULTIMATE_ROW_HEIGHT - BLOCK_HEIGHT) / 2;
                                break;
                            case 'CHAIN':
                                // 连携技：上边对齐分轴上边
                                top = TACTICAL_CHAIN_TOP;
                                break;
                            case 'TACTICAL':
                                // 战技：下边对齐分轴下边
                                top = TACTICAL_CHAIN_TOP + TACTICAL_CHAIN_ROW_HEIGHT - BLOCK_HEIGHT;
                                break;
                            case 'BASIC':
                            default:
                                // 普攻：下边对齐分轴下边
                                top = BASIC_TOP + BASIC_ROW_HEIGHT - BLOCK_HEIGHT;
                                break;
                        }

                        return (
                            <div 
                                key={action.id} 
                                style={{ position: 'absolute', top: `${top}px` }}
                            >
                                <TimelineBlock
                                    action={action}
                                    pxPerSec={pxPerSec}
                                    onRemove={onRemoveAction}
                                    onDragStart={onActionDragStart}
                                    onActionClick={onActionClick}
                                    comboInfo={comboInfo}
                                    isInvalid={conflictingActionIds?.has(action.id) || invalidResourceActionIds?.has(action.id)}
                                />
                            </div>
                        );
                    });
                })()}
                
                {/* Buff overlay：基于模拟器输出的 buffIntervals */}
                {(() => {
                    const enemyId = 'enemy_01';
                    const sources = [
                        { targetId: enemyId, label: '敌人' },
                        { targetId: 'team', label: '全队' },
                        { targetId: char.id, label: '自身' }
                    ];
                    
                    const segs = [];
                    sources.forEach(({ targetId, label }) => {
                        const byBuff = buffIntervals?.[targetId];
                        if (!byBuff) return;
                        Object.entries(byBuff).forEach(([buffId, list]) => {
                            if (!Array.isArray(list)) return;
                            list.forEach(seg => {
                                if (!seg) return;
                                segs.push({
                                    targetLabel: label,
                                    targetId,
                                    buffId,
                                    start: seg.start,
                                    end: seg.end,
                                    stacks: seg.stacks || 1,
                                    sourceId: seg.sourceId
                                });
                            });
                        });
                    });
                    
                    const rowOf = (buffId) => {
                        const def = getBuffDef(buffId);
                        switch (def?.type) {
                            case 'ATTACHMENT':
                                return 0;
                            case 'ANOMALY':
                                return 1;
                            case 'PHYSICAL_ANOMALY':
                            case 'DEBUFF':
                                return 2;
                            case 'STUN':
                                return 3;
                            case 'NAMED_BUFF':
                            case 'CHARACTER_BUFF':
                            default:
                                return 4;
                        }
                    };
                    
                    const colorOf = (buffId) => {
                        const def = getBuffDef(buffId);
                        const el = String(def?.element || '').toLowerCase();
                        if (def?.type === 'ATTACHMENT' || def?.type === 'ANOMALY') {
                            if (el === 'fire') return 'bg-red-500/40 border-red-500/60';
                            if (el === 'ice') return 'bg-cyan-500/40 border-cyan-500/60';
                            if (el === 'nature') return 'bg-green-500/40 border-green-500/60';
                            if (el === 'electric') return 'bg-purple-500/40 border-purple-500/60';
                            return 'bg-indigo-500/40 border-indigo-500/60';
                        }
                        if (def?.type === 'STUN') return 'bg-amber-500/35 border-amber-500/60';
                        if (def?.type === 'DEBUFF') return 'bg-red-500/25 border-red-500/60';
                        if (def?.type === 'PHYSICAL_ANOMALY') return 'bg-orange-500/30 border-orange-500/60';
                        if (def?.type === 'NAMED_BUFF') return 'bg-emerald-500/25 border-emerald-500/60';
                        return 'bg-slate-500/25 border-slate-500/50';
                    };
                    
                    // refresh 标识：同 targetId+buffId 的相邻片段若首尾相接，画 marker
                    const markers = [];
                    const keyToSegs = new Map();
                    segs.forEach(s => {
                        const k = `${s.targetId}::${s.buffId}`;
                        if (!keyToSegs.has(k)) keyToSegs.set(k, []);
                        keyToSegs.get(k).push(s);
                    });
                    keyToSegs.forEach(list => {
                        list.sort((a, b) => a.start - b.start);
                        for (let i = 0; i < list.length - 1; i++) {
                            const a = list[i];
                            const b = list[i + 1];
                            if (Math.abs(a.end - b.start) < 1e-6) {
                                markers.push({ buffId: a.buffId, time: a.end });
                            }
                        }
                    });
                    
                    return (
                        <>
                            {segs.map((seg, idx) => {
                                const row = rowOf(seg.buffId);
                                const top = BUFF_TOP + row * (BUFF_ROW_HEIGHT + BUFF_ROW_GAP);
                                const left = seg.start * pxPerSec;
                                const width = Math.max(1, (seg.end - seg.start) * pxPerSec);
                                const def = getBuffDef(seg.buffId);
                                const name = def?.name || seg.buffId;
                                return (
                                    <div
                                        key={`buffseg-${seg.targetId}-${seg.buffId}-${idx}`}
                                        className={`absolute rounded-sm border ${colorOf(seg.buffId)}`}
                                        style={{
                                            top: `${top}px`,
                                            left: `${left}px`,
                                            width: `${width}px`,
                                            height: `${BUFF_ROW_HEIGHT}px`,
                                            pointerEvents: 'none'
                                        }}
                                        title={`${seg.targetLabel}：${name} x${seg.stacks} (${seg.start.toFixed(2)}s - ${seg.end.toFixed(2)}s)`}
                                    />
                                );
                            })}
                            {markers.map((m, idx) => {
                                const row = rowOf(m.buffId);
                                const top = BUFF_TOP + row * (BUFF_ROW_HEIGHT + BUFF_ROW_GAP);
                                const x = m.time * pxPerSec;
                                return (
                                    <div
                                        key={`buffmk-${idx}`}
                                        className="absolute bg-white/40"
                                        style={{
                                            top: `${top}px`,
                                            left: `${x}px`,
                                            width: '1px',
                                            height: `${BUFF_ROW_HEIGHT}px`,
                                            pointerEvents: 'none'
                                        }}
                                        title="刷新/重置"
                                    />
                                );
                            })}
                        </>
                    );
                })()}
            </div>
        </div>
    );
};

export default TimelineTrackResolved;
