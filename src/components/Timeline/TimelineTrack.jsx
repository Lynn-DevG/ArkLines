import React, { useMemo } from 'react';
import { TimelineBlock } from './TimelineBlock';
import { SKILLS, SKILL_TYPES } from '../../data/skills';
import { ComboManager } from '../../engine/ComboManager';

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
    pxPerSec, 
    onRemoveAction, 
    onActionDragStart, 
    onActionClick, 
    conflictingActionIds, 
    invalidResourceActionIds 
}) => {
    // 分轴高度配置
    const BLOCK_HEIGHT = 24; // 时间块高度保持不变
    const ULTIMATE_ROW_HEIGHT = 60; // 终结技分轴高度 (原40 * 1.5)
    const TACTICAL_CHAIN_ROW_HEIGHT = 48; // 战技+连携共轴高度 (原32 * 1.5)
    const BASIC_ROW_HEIGHT = 42; // 普攻分轴高度 (原28 * 1.5)
    
    const ROW_GAP = 2; // 分轴间距
    const TOP_PADDING = 4;
    const HEADER_WIDTH = 100;
    const COLOR_INDICATOR_WIDTH = 4; // 左侧颜色指示条宽度
    
    // 计算总高度
    const totalHeight = TOP_PADDING + ULTIMATE_ROW_HEIGHT + ROW_GAP + TACTICAL_CHAIN_ROW_HEIGHT + ROW_GAP + BASIC_ROW_HEIGHT + TOP_PADDING;
    
    // 各分轴的顶部位置
    const ULTIMATE_TOP = TOP_PADDING;
    const TACTICAL_CHAIN_TOP = ULTIMATE_TOP + ULTIMATE_ROW_HEIGHT + ROW_GAP;
    const BASIC_TOP = TACTICAL_CHAIN_TOP + TACTICAL_CHAIN_ROW_HEIGHT + ROW_GAP;
    
    // 获取终结技能量上限
    const uspCost = getCharUspCost(char);
    
    // 生成终结技能量背景填充的多边形点（阶梯状）
    const generateUspFillPath = useMemo(() => {
        if (uspTimeline.length < 2) return null;
        
        const points = [];
        const fillHeight = ULTIMATE_ROW_HEIGHT - 2; // 留一点边距
        
        // 从左下角开始
        points.push(`0,${fillHeight}`);
        
        // 添加能量变化点（阶梯状：先水平再垂直）
        for (let i = 0; i < uspTimeline.length; i++) {
            const event = uspTimeline[i];
            const x = event.time * pxPerSec;
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
        const lastX = uspTimeline[uspTimeline.length - 1].time * pxPerSec;
        points.push(`${lastX},${fillHeight}`);
        
        return points.join(' ');
    }, [uspTimeline, pxPerSec, uspCost, ULTIMATE_ROW_HEIGHT]);

    return (
        <div 
            className="flex-1 border-b border-slate-800/50 relative group"
            style={{ minHeight: `${totalHeight}px`, height: `${totalHeight}px` }}
        >
            {/* 左侧角色名称区域 */}
            <div 
                className="absolute left-0 top-0 bottom-0 bg-slate-900/80 z-20 flex border-r border-slate-700"
                style={{ width: `${HEADER_WIDTH}px` }}
            >
                {/* 角色名称 */}
                <div className="flex-1 flex items-center px-2 overflow-hidden">
                    <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter truncate">
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
                        className="absolute w-full bg-amber-900/10 border-b border-slate-700/30"
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
                        className="absolute w-full border-b border-slate-700/30"
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
                            className="absolute w-full border-t border-slate-700/20"
                            style={{ top: '50%' }}
                        />
                    </div>
                    
                    {/* 普攻分轴背景 */}
                    <div 
                        className="absolute w-full bg-slate-800/10"
                        style={{ top: `${BASIC_TOP}px`, height: `${BASIC_ROW_HEIGHT}px` }}
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
                            comboInfo = comboManager.predictNext(action.charId, action.startTime, true);
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
            </div>
        </div>
    );
};

export default TimelineTrackResolved;
