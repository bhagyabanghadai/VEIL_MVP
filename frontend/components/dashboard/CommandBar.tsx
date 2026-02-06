import React, { useState } from 'react';
import { Search, Bell, Activity, Zap } from 'lucide-react';
import { ProfileDropdown } from '../ui/profile-dropdown';

interface CommandBarProps {
    isDemoMode: boolean;
    toggleDemo: () => void;
    runSimulation: () => void;
    simulationStep: number | null;
    onLogout: () => void;
    systemRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

const CommandBar: React.FC<CommandBarProps> = ({
    isDemoMode,
    toggleDemo,
    runSimulation,
    simulationStep,
    onLogout,
    systemRisk = 'LOW'
}) => {
    const [searchQuery, setSearchQuery] = useState('');

    const getRiskColor = () => {
        switch (systemRisk) {
            case 'CRITICAL': return 'text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
            case 'HIGH': return 'text-orange-500';
            case 'MEDIUM': return 'text-yellow-500';
            default: return 'text-teal-400 shadow-[0_0_10px_rgba(45,212,191,0.3)]';
        }
    };

    return (
        <div className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 sticky top-0 z-40">
            {/* Left: Search / Command Input */}
            <div className="flex-1 max-w-2xl flex items-center gap-4">
                <div className="relative group w-full max-w-md">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/30 group-focus-within:text-[#00f0ff] transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search entities, logs, or execute commands..."
                        className="bg-white/5 border border-white/10 text-white text-sm rounded-sm focus:ring-1 focus:ring-[#00f0ff]/50 focus:border-[#00f0ff]/50 block w-full pl-10 p-2.5 placeholder-white/20 transition-all font-mono"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <kbd className="inline-flex items-center border border-white/10 rounded px-2 text-[10px] font-sans font-medium text-white/40">
                            ⌘K
                        </kbd>
                    </div>
                </div>
            </div>

            {/* Right: Status & Actions */}
            <div className="flex items-center gap-6">

                {/* System Status Indicator */}
                <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 border border-white/5 bg-white/5 rounded-sm">
                    <Activity className={`h-4 w-4 ${getRiskColor()}`} />
                    <div className="flex flex-col">
                        <span className="text-[9px] font-mono text-white/40 uppercase tracking-widest leading-none mb-0.5">System Status</span>
                        <span className={`text-[11px] font-bold tracking-wider leading-none ${getRiskColor()}`}>{systemRisk}</span>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10 mx-2" />

                {/* Demo Toggle */}
                <button
                    onClick={toggleDemo}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all text-[10px] font-mono uppercase tracking-widest ${isDemoMode
                        ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                        : 'bg-transparent border-white/10 text-white/40 hover:text-white hover:border-white/30'
                        }`}
                >
                    <Zap className="h-3 w-3" />
                    {isDemoMode ? 'SIMULATION ACTIVE' : 'SIMULATION MODE'}
                </button>

                {isDemoMode && (
                    <button
                        onClick={runSimulation}
                        disabled={simulationStep !== null}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all text-[10px] font-mono uppercase tracking-widest ${simulationStep !== null
                            ? 'bg-amber-500/10 border-amber-500 text-amber-500 cursor-wait'
                            : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                            }`}
                    >
                        {simulationStep !== null ? 'RUNNING...' : 'EXECUTE SCENARIO'}
                    </button>
                )}

                {/* Vertical Separator */}
                <div className="h-8 w-px bg-white/10" />

                {/* User Profile / Logout */}
                <div className="flex items-center gap-4">
                    <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors">
                        <Bell className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    </button>

                    <ProfileDropdown onLogout={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default CommandBar;
