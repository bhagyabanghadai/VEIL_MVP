import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, Clock, RefreshCw, Shield } from 'lucide-react';

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
    const [currentTime, setCurrentTime] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Update clock every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const statusColors = {
        operational: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', dot: 'bg-emerald-400', label: 'ALL SYSTEMS OPERATIONAL' },
        degraded: { bg: 'bg-amber-500/20', text: 'text-amber-400', dot: 'bg-amber-400', label: 'DEGRADED PERFORMANCE' },
        offline: { bg: 'bg-red-500/20', text: 'text-red-400', dot: 'bg-red-400', label: 'SYSTEMS OFFLINE' }
    };

    const colors = statusColors[status];

    const handleRefresh = async () => {
        setIsRefreshing(true);
        // Simulate refresh
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsRefreshing(false);
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="w-full">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-slate-900/80 backdrop-blur-xl border-b border-white/5">
                <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-white font-bold tracking-wide">VEIL</span>
                            <span className="text-slate-500 text-xs font-mono ml-2">v{version}</span>
                        </div>
                    </div>

                    <div className="h-6 w-px bg-white/10" />

                    {/* Connection Status */}
                    <div className="flex items-center gap-2">
                        <Wifi className="w-4 h-4 text-emerald-400" />
                        <span className="text-[10px] text-slate-400 font-mono">CONNECTED</span>
                    </div>
                </div>

                {/* Right Side - Clock & Stats */}
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-slate-400">
                        <span className="text-[10px] font-mono">UPTIME</span>
                        <span className="text-xs font-bold text-white tabular-nums">{uptime}</span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    {/* Live Clock */}
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-cyan-400" />
                        <div className="text-right">
                            <p className="text-xs font-bold text-white font-mono tabular-nums">
                                {formatTime(currentTime)}
                            </p>
                            <p className="text-[9px] text-slate-500 font-mono">
                                {formatDate(currentTime)}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Strip */}
            <div className={`flex items-center justify-between px-6 py-2 ${colors.bg} border-b border-white/5`}>
                <div className="flex items-center gap-6">
                    {/* Status Indicator */}
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
                            <div className={`absolute inset-0 w-2 h-2 rounded-full ${colors.dot} animate-ping`} />
                        </div>
                        <span className={`text-xs font-bold uppercase tracking-wider ${colors.text}`}>
                            {colors.label}
                        </span>
                    </div>

                    <div className="h-4 w-px bg-white/10" />

                    {/* Layer Count */}
                    <span className="text-xs text-slate-300">
                        <span className="text-white font-bold">{layersActive}/7</span> Security Layers Active
                    </span>

                    <div className="h-4 w-px bg-white/10" />

                    {/* Last Attack */}
                    <span className="text-xs text-slate-400">
                        Last Threat: <span className="text-slate-200 font-mono">{lastAttack}</span>
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 transition-colors text-xs disabled:opacity-50"
                    >
                        <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin' : ''}`} />
                        {isRefreshing ? 'Syncing...' : 'Refresh'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default StatusBar;

