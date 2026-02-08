import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AlertCounts {
    critical: number;
    high: number;
    medium: number;
    low: number;
}

interface AlertSummaryStripProps {
    counts?: AlertCounts;
}

const AlertSummaryStrip: React.FC<AlertSummaryStripProps> = ({
    counts = { critical: 0, high: 2, medium: 5, low: 12 }
}) => {
    const total = counts.critical + counts.high + counts.medium + counts.low;

    const items = [
        {
            label: 'CRITICAL',
            count: counts.critical,
            icon: AlertTriangle,
            color: 'text-red-400',
            bg: 'bg-red-500/20',
            border: 'border-red-500/40',
            glow: counts.critical > 0 ? 'shadow-[0_0_15px_rgba(239,68,68,0.4)]' : '',
            pulse: counts.critical > 0,
        },
        {
            label: 'HIGH',
            count: counts.high,
            icon: AlertCircle,
            color: 'text-orange-400',
            bg: 'bg-orange-500/20',
            border: 'border-orange-500/30',
            glow: '',
            pulse: false,
        },
        {
            label: 'MEDIUM',
            count: counts.medium,
            icon: Info,
            color: 'text-amber-400',
            bg: 'bg-amber-500/20',
            border: 'border-amber-500/30',
            glow: '',
            pulse: false,
        },
        {
            label: 'LOW',
            count: counts.low,
            icon: CheckCircle,
            color: 'text-slate-400',
            bg: 'bg-slate-500/20',
            border: 'border-slate-500/30',
            glow: '',
            pulse: false,
        },
    ];

    return (
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5">
            {/* Total */}
            <div className="flex items-center gap-2 pr-4 border-r border-white/10">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    Active Alerts
                </span>
                <span className="text-lg font-bold text-white tabular-nums">
                    {total}
                </span>
            </div>

            {/* Severity Breakdown */}
            <div className="flex items-center gap-2 flex-1">
                {items.map((item) => (
                    <div
                        key={item.label}
                        className={`
                            flex items-center gap-2 px-3 py-1.5 rounded-lg
                            ${item.bg} border ${item.border} ${item.glow}
                            transition-all hover:scale-105
                        `}
                    >
                        <item.icon
                            className={`h-3.5 w-3.5 ${item.color} ${item.pulse ? 'animate-pulse' : ''}`}
                        />
                        <span className={`text-xs font-bold ${item.color} tabular-nums`}>
                            {item.count}
                        </span>
                        <span className="text-[9px] text-slate-500 uppercase tracking-wider hidden lg:inline">
                            {item.label}
                        </span>
                    </div>
                ))}
            </div>

            {/* View All Button */}
            <button className="px-3 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cyan-400 hover:text-cyan-300 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/10 transition-all">
                View All →
            </button>
        </div>
    );
};

export default AlertSummaryStrip;
