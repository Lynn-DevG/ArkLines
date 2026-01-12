import React from 'react';

export const MainLayout = ({ left, center, right }) => {
    return (
        <div className="flex h-screen w-full bg-neutral-950 text-neutral-100 overflow-hidden font-sans selection:bg-neutral-500/30">
            {/* Left Sidebar */}
            <div className="w-80 flex-shrink-0 border-r border-neutral-800 bg-neutral-900/50 flex flex-col">
                {left}
            </div>

            {/* Center Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-neutral-950 relative">
                {center}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 flex-shrink-0 border-l border-neutral-800 bg-neutral-900/90 flex flex-col">
                {right}
            </div>
        </div>
    );
};
