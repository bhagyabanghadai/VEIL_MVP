import React from 'react';

interface StatusBarProps {
    version?: string;
    uptime?: string;
    status?: 'operational' | 'degraded' | 'offline';
    layersActive?: number;
    lastAttack?: string;
}

const StatusBar: React.FC<StatusBarProps> = ({
    version = '9.0.0',
    uptime = '0h 0m',
    status = 'operational',
    layersActive = 7,
    lastAttack = 'N/A'
}) => {
    const statusColors = {
        operational: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400' },
        degraded: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400' },
        offline: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400' }
    };

    const colors = statusColors[status];

    return (
        <div className="w-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-black text-sm">V</span>
                    </div>
                    <span className="text-white font-semibold tracking-wide">VEIL</span>
                    <span className="text-slate-500 text-xs font-mono">v{version}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <span>Uptime: {uptime}</span>
                </div>
            </div>

            {/* Status Strip */}
            <div className={`flex items-center justify-between px-6 py-2 ${colors.bg} border-b border-white/5`}>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${colors.dot} animate-pulse`} />
                        <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                            {status}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    <span className="text-xs text-slate-300">
                        <span className="text-white font-bold">{layersActive}</span> Layers Active
                    </span>

                    <div className="h-4 w-px bg-white/10" />

                    <span className="text-xs text-slate-400">
                        Last Attack: <span className="text-slate-200">{lastAttack}</span>
                    </span>
                </div>

                <div className="flex items-center gap-4 text-xs">
                    <button className="px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors">
                        Refresh
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;
