import React from 'react';
import { Activity, Cpu, Wifi } from 'lucide-react';

// Refined, professional sparkline
const Sparkline = ({ data, color }: { data: number[], color: string }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    // Normalize points
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((d - min) / range) * 100;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-full h-8 overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
            {/* Fill area for better visibility */}
            <polygon
                points={`0,100 ${points} 100,100`}
                fill={color}
                fillOpacity="0.1"
            />
            <polyline
                points={points}
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle
                cx="100"
                cy={100 - ((data[data.length - 1] - min) / range) * 100}
                r="3"
                fill={color}
            />
        </svg>
    );
};

const LiveMetrics = () => {
    const trustData = [65, 78, 75, 82, 88, 85, 92, 95, 90, 94];
    const latencyData = [20, 18, 22, 15, 12, 14, 18, 10, 8, 11];
    const cpuData = [45, 52, 48, 60, 55, 65, 70, 68, 75, 72];

    const MetricCard = ({ label, value, unit, icon: Icon, data, color, trend }: any) => (
        <div className="flex-1 bg-veil-card border border-veil-border/50 rounded-sm p-3 flex flex-col justify-between hover:border-veil-border transition-colors">
            <div className="flex justify-between items-start mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-veil-text-secondary mb-0.5 flex items-center gap-1.5">
                        <Icon size={12} className="opacity-70" /> {label}
                    </span>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-veil-text-primary tabular-nums tracking-tight">{value}</span>
                        <span className="text-[10px] text-veil-text-muted font-medium">{unit}</span>
                    </div>
                </div>
                <div className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${trend === 'up' ? 'text-veil-success bg-veil-success/10' : 'text-veil-accent bg-veil-accent/10'}`}>
                    {trend === 'up' ? '▲ 2.4%' : '▼ 1.1%'}
                </div>
            </div>

            <div className="w-full h-8 opacity-80">
                <Sparkline data={data} color={color} />
            </div>
        </div>
    );

    return (
        <div className="flex flex-col gap-2 w-full h-auto">
            <div className="text-[10px] uppercase font-mono tracking-widest text-veil-text-muted/40 pl-1">
                LAYER 1-3: TRAFFIC & TRANSPORT
            </div>
            <div className="flex gap-4 w-full h-auto">
                <MetricCard
                    label="Trust Score"
                    value="98.2"
                    unit="%"
                    icon={ShieldCheck}
                    data={trustData}
                    color="#3B82F6"
                    trend="up"
                />
                <MetricCard
                    label="Latency"
                    value="11"
                    unit="ms"
                    icon={Wifi}
                    data={latencyData}
                    color="#10B981"
                    trend="down"
                />
                <MetricCard
                    label="Load Avg"
                    value="72"
                    unit="%"
                    icon={Cpu}
                    data={cpuData}
                    color="#F59E0B"
                    trend="up"
                />
            </div>
        </div>
    );
};

// Start icon helper wrapper
const ShieldCheck = ({ size, className }: any) => (
    <Activity size={size} className={className} />
);

export default LiveMetrics;
