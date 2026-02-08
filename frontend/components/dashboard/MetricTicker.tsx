import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity, Shield, Clock, Zap, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface MetricItem {
    label: string;
    value: string | number;
    trend?: number;
    trendLabel?: string;
    status: 'neutral' | 'good' | 'warning' | 'critical';
    icon?: React.ElementType;
}

const MetricBox = ({ label, value, trend, trendLabel, status, icon: Icon }: MetricItem) => {
    const statusStyles = {
        neutral: {
            border: 'border-white/10',
            glow: '',
            iconBg: 'bg-white/5',
            text: 'text-white/60'
        },
        good: {
            border: 'border-emerald-500/30',
            glow: 'shadow-lg shadow-emerald-500/10',
            iconBg: 'bg-emerald-500/10',
            text: 'text-emerald-400'
        },
        warning: {
            border: 'border-amber-500/30',
            glow: 'shadow-lg shadow-amber-500/10',
            iconBg: 'bg-amber-500/10',
            text: 'text-amber-400'
        },
        critical: {
            border: 'border-rose-500/30',
            glow: 'shadow-lg shadow-rose-500/10',
            iconBg: 'bg-rose-500/10',
            text: 'text-rose-400'
        },
    }[status];

    return (
        <div className={cn(
            "glass-card p-4 flex flex-col justify-between min-w-[160px] flex-1",
            statusStyles.border,
            statusStyles.glow
        )}>
            <div className="flex items-start justify-between">
                <span className="text-[11px] font-medium uppercase tracking-wider text-white/40">{label}</span>
                {Icon && (
                    <div className={cn("p-1.5 rounded-lg", statusStyles.iconBg)}>
                        <Icon className={cn("w-3.5 h-3.5", statusStyles.text)} />
                    </div>
                )}
            </div>

            <div className="mt-3">
                <div className="text-3xl font-bold text-white tracking-tight tabular-nums">
                    {value}
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2">
                {trend !== undefined && (
                    <div className={cn("flex items-center text-xs font-medium", statusStyles.text)}>
                        {trend > 0 ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        <span>{Math.abs(trend)}%</span>
                    </div>
                )}
                {trendLabel && (
                    <span className="text-[10px] text-white/30">
                        {trendLabel}
                    </span>
                )}
            </div>
        </div>
    );
};

const MetricTicker: React.FC = () => {
    const metrics: MetricItem[] = [
        { label: 'Risk Score', value: '23', trend: -5, status: 'good', trendLabel: 'Low Risk', icon: Shield },
        { label: 'Active Threats', value: '0', status: 'good', icon: AlertTriangle },
        { label: 'Block Rate', value: '4.2%', trend: 1.2, status: 'warning', trendLabel: 'Elevated', icon: Activity },
        { label: 'MTTD', value: '14ms', trend: -2, status: 'good', trendLabel: 'Fast', icon: Clock },
        { label: 'Network Load', value: '1.2GB/s', trend: 12, status: 'neutral', icon: Zap },
    ];

    return (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
            {metrics.map((metric, index) => (
                <MetricBox key={index} {...metric} />
            ))}
        </div>
    );
};

export default MetricTicker;
