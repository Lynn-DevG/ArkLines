import React, { useMemo } from 'react';
import { FPS } from '../../config/simulation';

/**
 * 技力（ATB）显示轴组件
 * 纵向分成三层，每层表示100点技力
 * 最大技力为300点
 * 使用帧作为最小显示单位
 */
export const AtbTrack = ({ atbTimeline = [], pxPerSec }) => {
    const MAX_ATB = 300;
    const LAYER_VALUE = 100; // 每层100点
    const LAYER_COUNT = 3;
    
    const LAYER_HEIGHT = 28; // 每层内容高度（不含边框）
    const BORDER_WIDTH = 1; // 边框宽度
    const LAYER_TOTAL_HEIGHT = LAYER_HEIGHT + BORDER_WIDTH * 2; // 每层总高度（含边框）
    const LAYER_GAP = 2; // 层间距
    const ROW_HEIGHT = LAYER_TOTAL_HEIGHT * LAYER_COUNT + LAYER_GAP * (LAYER_COUNT - 1); // 总高度
    const HEADER_WIDTH = 100;
    const TOP_PADDING = 4;
    
    // 辅助函数：根据事件获取 x 坐标（优先使用帧数）
    const getX = (event) => {
        // 如果有帧数，使用帧数计算（更精确）
        if (event.frame !== undefined) {
            return (event.frame / FPS) * pxPerSec;
        }
        return event.time * pxPerSec;
    };
    
    // 为每一层生成填充路径
    // layer: 0 = 底层(0-100), 1 = 中层(100-200), 2 = 顶层(200-300)
    // 使用帧数进行精确定位
    const generateLayerPath = useMemo(() => {
        if (atbTimeline.length < 2) return [null, null, null];
        
        const paths = [];
        
        for (let layer = 0; layer < LAYER_COUNT; layer++) {
            const layerMin = layer * LAYER_VALUE; // 该层的最小值
            const layerMax = (layer + 1) * LAYER_VALUE; // 该层的最大值
            
            const points = [];
            const layerBottom = LAYER_HEIGHT; // 层内的底部 Y 坐标（内容区域高度）
            
            // 从左下角开始
            points.push(`0,${layerBottom}`);
            
            // 添加能量变化点（阶梯状）
            for (let i = 0; i < atbTimeline.length; i++) {
                const event = atbTimeline[i];
                const x = getX(event);
                
                // 计算该层的填充高度
                // 如果 ATB 低于该层最小值，填充为0
                // 如果 ATB 高于该层最大值，填充为100%
                // 否则按比例填充
                let layerFill = 0;
                if (event.atb > layerMin) {
                    layerFill = Math.min(1, (event.atb - layerMin) / LAYER_VALUE);
                }
                
                const y = layerBottom - (layerFill * LAYER_HEIGHT);
                
                // 阶梯状：先水平再垂直
                if (i > 0) {
                    const prevEvent = atbTimeline[i - 1];
                    let prevLayerFill = 0;
                    if (prevEvent.atb > layerMin) {
                        prevLayerFill = Math.min(1, (prevEvent.atb - layerMin) / LAYER_VALUE);
                    }
                    const prevY = layerBottom - (prevLayerFill * LAYER_HEIGHT);
                    points.push(`${x},${prevY}`);
                }
                
                points.push(`${x},${y}`);
            }
            
            // 回到右下角
            const lastEvent = atbTimeline[atbTimeline.length - 1];
            const lastX = getX(lastEvent);
            points.push(`${lastX},${layerBottom}`);
            
            paths.push(points.join(' '));
        }
        
        return paths;
    }, [atbTimeline, pxPerSec]);
    
    // 计算每层在每个时间点是否充满，用于动态显示亮度
    // 返回每层的"满状态"时间段列表（使用帧数进行精确定位）
    const layerFullSegments = useMemo(() => {
        if (atbTimeline.length < 2) return [[], [], []];
        
        const segments = [[], [], []]; // 三层
        
        // 辅助函数：获取事件的时间（秒），优先使用帧数计算
        const getEventTime = (event) => {
            if (event.frame !== undefined) {
                return event.frame / FPS;
            }
            return event.time;
        };
        
        for (let layer = 0; layer < LAYER_COUNT; layer++) {
            const layerMax = (layer + 1) * LAYER_VALUE;
            let segmentStart = null;
            
            for (let i = 0; i < atbTimeline.length; i++) {
                const event = atbTimeline[i];
                const eventTime = getEventTime(event);
                const isFull = event.atb >= layerMax;
                
                if (isFull && segmentStart === null) {
                    // 开始一个满状态段
                    segmentStart = eventTime;
                } else if (!isFull && segmentStart !== null) {
                    // 结束一个满状态段
                    segments[layer].push({ start: segmentStart, end: eventTime });
                    segmentStart = null;
                }
            }
            
            // 如果最后还在满状态，延续到时间轴结束
            if (segmentStart !== null) {
                const lastEvent = atbTimeline[atbTimeline.length - 1];
                const lastTime = getEventTime(lastEvent);
                segments[layer].push({ start: segmentStart, end: lastTime });
            }
        }
        
        return segments;
    }, [atbTimeline]);
    
    // 获取最终状态用于左侧指示条
    const finalLayerState = useMemo(() => {
        if (atbTimeline.length === 0) return [false, false, false];
        
        const lastAtb = atbTimeline[atbTimeline.length - 1]?.atb || 0;
        
        return [
            lastAtb >= LAYER_VALUE,      // 第一层满（>=100）
            lastAtb >= LAYER_VALUE * 2,  // 第二层满（>=200）
            lastAtb >= LAYER_VALUE * 3   // 第三层满（>=300）
        ];
    }, [atbTimeline]);

    return (
        <div 
            className="flex border-b border-neutral-700/50 relative"
            style={{ minHeight: `${ROW_HEIGHT + TOP_PADDING * 2}px`, height: `${ROW_HEIGHT + TOP_PADDING * 2}px` }}
        >
            {/* 左侧标签 */}
            <div 
                className="absolute left-0 top-0 bottom-0 bg-neutral-900/80 z-20 border-r border-neutral-700"
                style={{ width: `${HEADER_WIDTH}px` }}
            >
                {/* 技力文字 */}
                <div className="absolute left-0 top-0 bottom-0 flex items-center px-2">
                    <span className="text-[10px] font-bold uppercase tracking-tighter" style={{ color: '#ede93e' }}>
                        技力
                    </span>
                </div>
                {/* 右侧颜色指示条 - 绝对定位确保与右侧对齐 */}
                <div 
                    className="absolute right-0 flex flex-col-reverse"
                    style={{ 
                        width: '4px', 
                        top: `${TOP_PADDING}px`,
                        gap: `${LAYER_GAP}px` 
                    }}
                >
                    {/* 三层颜色指示（从下到上） */}
                    {[0, 1, 2].map(layer => (
                        <div 
                            key={layer}
                            className="transition-colors duration-200"
                            style={{ 
                                height: `${LAYER_HEIGHT}px`,
                                backgroundColor: finalLayerState[layer] 
                                    ? '#ede93e' 
                                    : 'rgba(255, 255, 255, 0.25)',
                                border: `${BORDER_WIDTH}px solid rgba(0, 0, 0, 0.8)`,
                                borderRadius: '1px',
                                boxSizing: 'content-box'
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* 时间轴区域 */}
            <div 
                className="absolute right-0 top-0 bottom-0"
                style={{ left: `${HEADER_WIDTH}px`, paddingTop: `${TOP_PADDING}px`, paddingBottom: `${TOP_PADDING}px` }}
            >
                {/* 三层背景和填充（从下到上渲染，layer 0 在底部） */}
                <div className="relative w-full flex flex-col-reverse" style={{ gap: `${LAYER_GAP}px` }}>
                    {[0, 1, 2].map(layer => {
                        const layerPath = generateLayerPath[layer];
                        const fullSegments = layerFullSegments[layer];
                        
                        return (
                            <div 
                                key={layer}
                                className="relative"
                                style={{ 
                                    height: `${LAYER_HEIGHT}px`,
                                    border: `${BORDER_WIDTH}px solid rgba(0, 0, 0, 0.8)`,
                                    borderRadius: '2px',
                                    boxSizing: 'content-box',
                                    backgroundColor: 'rgba(0, 0, 0, 0.6)'
                                }}
                            >
                                {/* 未充满时的进度填充（白色半透明） */}
                                {layerPath && (
                                    <svg 
                                        className="absolute"
                                        style={{ top: 0, left: 0, width: '100%', height: '100%' }}
                                        viewBox={`0 0 ${30 * pxPerSec} ${LAYER_HEIGHT}`}
                                        preserveAspectRatio="none"
                                    >
                                        <polygon
                                            points={layerPath}
                                            fill="rgba(255, 255, 255, 0.5)"
                                            stroke="none"
                                        />
                                    </svg>
                                )}
                                {/* 充满时的高亮填充（纯黄色） */}
                                {fullSegments.map((seg, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute"
                                        style={{
                                            top: 0,
                                            bottom: 0,
                                            left: `${seg.start * pxPerSec}px`,
                                            width: `${(seg.end - seg.start) * pxPerSec}px`,
                                            backgroundColor: '#ede93e'
                                        }}
                                    />
                                ))}
                                
                                {/* 层级标签（仅在右侧显示） */}
                                <div className="absolute right-3 top-0 bottom-0 flex items-center pointer-events-none">
                                    <span className="text-[8px]" style={{ color: 'rgba(237, 233, 62, 0.6)' }}>
                                        {(layer + 1) * LAYER_VALUE}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default AtbTrack;
