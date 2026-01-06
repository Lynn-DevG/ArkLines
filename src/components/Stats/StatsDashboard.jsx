import React from 'react';
import { useSimulation } from '../../store/SimulationContext';
import { Activity, Terminal } from 'lucide-react';

export const StatsDashboard = () => {
    const { totalDamage, logs } = useSimulation();

    // Latest logs first
    const reversedLogs = [...logs].reverse();

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b border-slate-700 bg-slate-900/50">
                <h2 className="text-lg font-bold flex items-center gap-2 text-indigo-400">
                    <Activity size={20} />
                    Analysis
                </h2>
            </div>

            <div className="p-4 space-y-4 flex-shrink-0">
                <div className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                    <div className="text-xs text-slate-400 uppercase">Total Damage</div>
                    <div className="text-2xl font-bold text-white tracking-tight">{totalDamage.toLocaleString()}</div>
                </div>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col px-4 pb-4">
                <h3 className="text-xs font-bold text-slate-400 mb-2 flex items-center gap-2">
                    <Terminal size={12} /> COMBAT LOG
                </h3>
                <div className="flex-1 bg-black/50 rounded border border-slate-800 p-2 overflow-y-auto font-mono text-[10px] leading-relaxed custom-scrollbar">
                    {reversedLogs.length === 0 && <div className="text-slate-600 italic p-2">Ready to simulate...</div>}
                    {reversedLogs.map((log, i) => (
                        <div key={i} className="mb-1 border-b border-white/5 pb-1">
                            <span className="text-slate-500">[{log.time.toFixed(1)}s]</span>{' '}
                            {['DAMAGE', 'DOT', 'REACTION_DAMAGE'].includes(log.type) && (
                                <>
                                    <span className="text-indigo-400 font-bold">{log.source}</span>
                                    <span className="text-slate-400"> dealt </span>
                                    <span className={`font-bold ${log.type === 'REACTION_DAMAGE' ? 'text-amber-400 glow' : 'text-white'}`}>
                                        {log.value}
                                    </span>
                                    <span className="text-slate-500"> {log.detail && `(${log.detail})`}</span>
                                </>
                            )}
                            {log.type === 'STATUS' && (
                                <span className="text-yellow-500">{log.detail}</span>
                            )}
                            {log.type === 'REACTION' && (
                                <span className="text-red-400 font-bold glow">{log.detail}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
