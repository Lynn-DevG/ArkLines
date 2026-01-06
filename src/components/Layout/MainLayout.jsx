import React from 'react';

export const MainLayout = ({ left, center, right }) => {
    return (
        <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans selection:bg-indigo-500/30">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0 border-r border-slate-800 bg-slate-900/50 flex flex-col">
                {left}
            </div>

            {/* Center Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
                {center}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 flex-shrink-0 border-l border-slate-800 bg-slate-900/90 flex flex-col">
                {right}
            </div>
        </div>
    );
};
