import React, { useMemo } from 'react';

/**
 * 技力（ATB）显示轴组件
 * 纵向分成三层，每层表示100点技力
 * 最大技力为300点
 */
export const AtbTrack = ({ atbTimeline = [], pxPerSec }) => {
    const MAX_ATB = 300;
    const LAYER_VALUE = 100; // 每层100点
    const LAYER_COUNT = 3;
    
    const ROW_HEIGHT = 108; // 总高度 (原36 * 3)
    const LAYER_HEIGHT = ROW_HEIGHT / LAYER_COUNT; // 每层高度
    const HEADER_WIDTH = 100;
    const TOP_PADDING = 4;
    
    // 为每一层生成填充路径
    // layer: 0 = 底层(0-100), 1 = 中层(100-200), 2 = 顶层(200-300)
    const generateLayerPath = useMemo(() => {
        if (atbTimeline.length < 2) return [null, null, null];
        
        const paths = [];
        
        for (let layer = 0; layer < LAYER_COUNT; layer++) {
            const layerMin = layer * LAYER_VALUE; // 该层的最小值
            const layerMax = (layer + 1) * LAYER_VALUE; // 该层的最大值
            
            const points = [];
            const layerBottom = LAYER_HEIGHT; // 层内的底部 Y 坐标
            
            // 从左下角开始
            points.push(`0,${layerBottom}`);
            
            // 添加能量变化点（阶梯状）
            for (let i = 0; i < atbTimeline.length; i++) {
                const event = atbTimeline[i];
                const x = event.time * pxPerSec;
                
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
            const lastX = atbTimeline[atbTimeline.length - 1].time * pxPerSec;
            points.push(`${lastX},${layerBottom}`);
            
            paths.push(points.join(' '));
        }
        
        return paths;
    }, [atbTimeline, pxPerSec]);
    
    // 计算每层在每个时间点是否充满，用于动态显示亮度
    // 返回每层的"满状态"时间段列表
    const layerFullSegments = useMemo(() => {
        if (atbTimeline.length < 2) return [[], [], []];
        
        const segments = [[], [], []]; // 三层
        
        for (let layer = 0; layer < LAYER_COUNT; layer++) {
            const layerMax = (layer + 1) * LAYER_VALUE;
            let segmentStart = null;
            
            for (let i = 0; i < atbTimeline.length; i++) {
                const event = atbTimeline[i];
                const isFull = event.atb >= layerMax;
                
                if (isFull && segmentStart === null) {
                    // 开始一个满状态段
                    segmentStart = event.time;
                } else if (!isFull && segmentStart !== null) {
                    // 结束一个满状态段
                    segments[layer].push({ start: segmentStart, end: event.time });
                    segmentStart = null;
                }
            }
            
            // 如果最后还在满状态，延续到时间轴结束
            if (segmentStart !== null) {
                const lastTime = atbTimeline[atbTimeline.length - 1].time;
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
            className="flex border-b border-slate-700/50 relative"
            style={{ minHeight: `${ROW_HEIGHT + TOP_PADDING * 2}px`, height: `${ROW_HEIGHT + TOP_PADDING * 2}px` }}
        >
            {/* 左侧标签 */}
            <div 
                className="absolute left-0 top-0 bottom-0 bg-slate-900/80 z-20 flex items-center border-r border-slate-700"
                style={{ width: `${HEADER_WIDTH}px` }}
            >
                <div className="flex-1 flex items-center px-2">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-tighter">
                        技力
                    </span>
                </div>
                {/* 右侧颜色指示条 */}
                <div 
                    className="flex flex-col-reverse"
                    style={{ width: '4px', paddingTop: `${TOP_PADDING}px`, paddingBottom: `${TOP_PADDING}px` }}
                >
                    {/* 三层颜色指示（从下到上） */}
                    {[0, 1, 2].map(layer => (
                        <div 
                            key={layer}
                            className={`transition-colors duration-200 ${
                                finalLayerState[layer] 
                                    ? 'bg-cyan-400' 
                                    : 'bg-cyan-900/50'
                            }`}
                            style={{ height: `${LAYER_HEIGHT}px` }}
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
                <div className="relative w-full h-full flex flex-col-reverse">
                    {[0, 1, 2].map(layer => {
                        const layerPath = generateLayerPath[layer];
                        const fullSegments = layerFullSegments[layer];
                        
                        // 根据层级决定基础颜色深度
                        const bgOpacity = 0.05 + layer * 0.02;
                        
                        return (
                            <div 
                                key={layer}
                                className="relative border-b border-slate-700/20 last:border-b-0"
                                style={{ height: `${LAYER_HEIGHT}px`, backgroundColor: `rgba(6, 182, 212, ${bgOpacity})` }}
                            >
                                {/* 基础填充（较暗） */}
                                {layerPath && (
                                    <svg 
                                        className="absolute inset-0 w-full h-full overflow-visible"
                                        preserveAspectRatio="none"
                                    >
                                        <polygon
                                            points={layerPath}
                                            fill="rgba(6, 182, 212, 0.2)"
                                            stroke="rgba(6, 182, 212, 0.3)"
                                            strokeWidth="1"
                                        />
                                    </svg>
                                )}
                                
                                {/* 满状态高亮段（更亮） */}
                                {fullSegments.map((seg, idx) => (
                                    <div
                                        key={idx}
                                        className="absolute top-0 bottom-0 bg-cyan-400/40 border-l border-r border-cyan-400/60"
                                        style={{
                                            left: `${seg.start * pxPerSec}px`,
                                            width: `${(seg.end - seg.start) * pxPerSec}px`
                                        }}
                                    />
                                ))}
                                
                                {/* 层级标签（仅在右侧显示） */}
                                <div className="absolute right-1 top-0 bottom-0 flex items-center pointer-events-none">
                                    <span className="text-[8px] text-cyan-600/50">
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
