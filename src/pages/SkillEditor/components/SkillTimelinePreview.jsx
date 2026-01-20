import React, { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ACTION_TYPES } from './ActionEditor';

// 每秒宽度（与模拟器一致）
const PX_PER_SEC = 120;
// 标签高度
const LABEL_HEIGHT = 24;
// 标签间距
const LABEL_GAP = 4;
// 时间轴高度
const TIMELINE_HEIGHT = 32;
// 标记高度
const MARKER_HEIGHT = 20;

/**
 * 技能时间轴预览组件
 * 显示技能的持续时间和行为标记，支持拖拽调整 offset
 */
export function SkillTimelinePreview({
    duration = 1,
    maxDuration = 10,
    actions = [],
    selectedActionIndex,
    onSelectAction,
    onUpdateOffset
}) {
    const containerRef = useRef(null);
    const [dragging, setDragging] = useState(null); // { index, startX, startOffset }
    const [timelineMaxDuration, setTimelineMaxDuration] = useState(Math.max(maxDuration, duration + 1));

    // 更新时间轴最大长度
    useEffect(() => {
        const maxActionOffset = Math.max(...actions.map(a => a.offset || 0), 0);
        const needed = Math.max(duration, maxActionOffset) + 1;
        setTimelineMaxDuration(Math.max(maxDuration, Math.ceil(needed)));
    }, [duration, actions, maxDuration]);

    // 计算时间轴宽度
    const timelineWidth = timelineMaxDuration * PX_PER_SEC;

    // 按 offset 排序的 actions，用于计算标签位置
    const sortedActions = useMemo(() => {
        return actions
            .map((action, index) => ({ ...action, originalIndex: index }))
            .sort((a, b) => (a.offset || 0) - (b.offset || 0));
    }, [actions]);

    // 估算标签宽度的辅助函数
    const estimateLabelWidth = useCallback((action, index) => {
        const config = ACTION_TYPES[action.type] || { label: action.type };
        const labelText = config.label || action.type;
        const offset = action.offset || 0;
        const timeText = `@${offset.toFixed(2)}s`;
        const indexText = `#${index + 1}`;
        
        // 估算宽度：padding(16) + 颜色点(8) + gaps(12) + 文字
        // 中文字符约 12px，英文/数字约 7px
        const labelWidth = labelText.length * 12; // 假设都是中文
        const indexWidth = indexText.length * 7;
        const timeWidth = timeText.length * 7;
        
        return 16 + 8 + 12 + labelWidth + indexWidth + timeWidth + 8; // 额外 8px 余量
    }, []);

    // 计算标签的纵向位置（避免重叠）
    const labelPositions = useMemo(() => {
        const positions = new Map();
        const occupiedRanges = []; // { left, right, row }

        sortedActions.forEach(action => {
            const offset = action.offset || 0;
            const left = offset * PX_PER_SEC;
            // 动态计算标签宽度
            const labelWidth = estimateLabelWidth(action, action.originalIndex);
            const right = left + labelWidth;

            // 找到不重叠的行
            let row = 0;
            while (true) {
                const conflict = occupiedRanges.find(
                    r => r.row === row && !(right < r.left || left > r.right)
                );
                if (!conflict) break;
                row++;
            }

            occupiedRanges.push({ left, right, row });
            positions.set(action.originalIndex, row);
        });

        return positions;
    }, [sortedActions, estimateLabelWidth]);

    // 最大行数（用于计算高度）
    const maxRow = useMemo(() => {
        return Math.max(...Array.from(labelPositions.values()), 0);
    }, [labelPositions]);

    // 标签区域高度
    const labelsHeight = (maxRow + 1) * (LABEL_HEIGHT + LABEL_GAP);

    // 拖拽开始
    const handleDragStart = useCallback((e, index) => {
        e.preventDefault();
        e.stopPropagation();
        
        const action = actions[index];
        setDragging({
            index,
            startX: e.clientX,
            startOffset: action.offset || 0
        });
    }, [actions]);

    // 拖拽移动
    const handleDragMove = useCallback((e) => {
        if (!dragging) return;

        const deltaX = e.clientX - dragging.startX;
        const deltaTime = deltaX / PX_PER_SEC;
        const newOffset = Math.max(0, dragging.startOffset + deltaTime);
        
        // 对齐到 0.01 秒
        const alignedOffset = Math.round(newOffset * 100) / 100;
        
        if (onUpdateOffset) {
            onUpdateOffset(dragging.index, alignedOffset);
        }
    }, [dragging, onUpdateOffset]);

    // 拖拽结束
    const handleDragEnd = useCallback(() => {
        setDragging(null);
    }, []);

    // 添加全局鼠标事件监听
    useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', handleDragMove);
            window.addEventListener('mouseup', handleDragEnd);
            return () => {
                window.removeEventListener('mousemove', handleDragMove);
                window.removeEventListener('mouseup', handleDragEnd);
            };
        }
    }, [dragging, handleDragMove, handleDragEnd]);

    // 点击标签选中行为
    const handleLabelClick = useCallback((e, index) => {
        e.stopPropagation();
        if (onSelectAction) {
            onSelectAction(index);
        }
    }, [onSelectAction]);

    return (
        <div className="flex flex-col">
            {/* 时间轴长度控制 */}
            <div className="flex items-center gap-2 mb-2 text-xs text-neutral-400">
                <span>时间轴长度:</span>
                <input
                    type="number"
                    min="1"
                    max="30"
                    step="1"
                    value={timelineMaxDuration}
                    onChange={(e) => setTimelineMaxDuration(Math.max(1, parseInt(e.target.value) || 10))}
                    className="w-16 bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white"
                />
                <span>秒</span>
            </div>

            {/* 时间轴区域 */}
            <div 
                ref={containerRef}
                className="relative overflow-x-auto border border-neutral-700 rounded bg-neutral-900/50"
                style={{ minHeight: `${TIMELINE_HEIGHT + labelsHeight + 16}px` }}
            >
                <div style={{ width: `${timelineWidth}px`, position: 'relative' }}>
                    {/* 时间刻度 */}
                    <div className="h-5 border-b border-neutral-700/50 relative">
                        {Array.from({ length: timelineMaxDuration + 1 }).map((_, i) => (
                            <div
                                key={i}
                                className="absolute top-0 bottom-0 border-l border-neutral-700/50 text-[10px] text-neutral-500 pl-1"
                                style={{ left: `${i * PX_PER_SEC}px` }}
                            >
                                {i}s
                            </div>
                        ))}
                    </div>

                    {/* 技能持续时间背景 */}
                    <div 
                        className="absolute bg-neutral-700/30 border-r-2 border-[#ffff21]/50"
                        style={{
                            top: '20px',
                            left: 0,
                            width: `${duration * PX_PER_SEC}px`,
                            height: `${TIMELINE_HEIGHT}px`
                        }}
                    />

                    {/* 时间轴主体 */}
                    <div 
                        className="relative"
                        style={{ height: `${TIMELINE_HEIGHT}px` }}
                    >
                        {/* 行为标记 */}
                        {actions.map((action, index) => {
                            const offset = action.offset || 0;
                            const left = offset * PX_PER_SEC;
                            const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };
                            const isSelected = selectedActionIndex === index;

                            return (
                                <div
                                    key={index}
                                    className="absolute"
                                    style={{ left: `${left}px`, top: 0 }}
                                >
                                    {/* 标记竖线 */}
                                    <div 
                                        className={`w-0.5 ${isSelected ? 'bg-[#ffff21]' : 'bg-white/60'}`}
                                        style={{ height: `${MARKER_HEIGHT}px` }}
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {/* 标签区域 */}
                    <div 
                        className="relative"
                        style={{ height: `${labelsHeight}px`, marginTop: '4px' }}
                    >
                        {actions.map((action, index) => {
                            const offset = action.offset || 0;
                            const left = offset * PX_PER_SEC;
                            const row = labelPositions.get(index) || 0;
                            const top = row * (LABEL_HEIGHT + LABEL_GAP);
                            const config = ACTION_TYPES[action.type] || { label: action.type, color: 'bg-slate-500' };
                            const isSelected = selectedActionIndex === index;
                            const isDraggingThis = dragging?.index === index;

                            return (
                                <div
                                    key={index}
                                    className={`absolute flex items-center gap-1 px-2 py-1 rounded text-xs cursor-move select-none transition-colors
                                        ${isSelected 
                                            ? 'bg-[#ffff21]/20 border border-[#ffff21] text-[#ffff21]' 
                                            : 'bg-neutral-800 border border-neutral-600 text-neutral-300 hover:border-neutral-500'
                                        }
                                        ${isDraggingThis ? 'opacity-70' : ''}
                                    `}
                                    style={{ 
                                        left: `${left}px`, 
                                        top: `${top}px`,
                                        height: `${LABEL_HEIGHT}px`
                                    }}
                                    onMouseDown={(e) => handleDragStart(e, index)}
                                    onClick={(e) => handleLabelClick(e, index)}
                                >
                                    {/* 连接线 */}
                                    <div 
                                        className={`absolute w-px ${isSelected ? 'bg-[#ffff21]/50' : 'bg-neutral-600'}`}
                                        style={{
                                            left: '0px',
                                            bottom: '100%',
                                            height: `${top + MARKER_HEIGHT + 4}px`
                                        }}
                                    />
                                    
                                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                                    <span className="whitespace-nowrap">
                                        {config.label} #{index + 1}
                                    </span>
                                    <span className="text-neutral-500 ml-1">
                                        @{offset.toFixed(2)}s
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* 提示 */}
            <div className="text-xs text-neutral-500 mt-2">
                拖拽标签可调整行为时间（最小单位: 0.01秒）
            </div>
        </div>
    );
}
