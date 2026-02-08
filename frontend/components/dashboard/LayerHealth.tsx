import React from 'react';
import { ShieldCheck, AlertTriangle, XOctagon, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Layer {
    id: string;
    name: string;
    status: 'active' | 'degraded' | 'offline';
    health: number;
    latency: string;
}

const LayerRow = ({ layer }: { layer: Layer }) => {
    const statusConfig = {
        active: {
            icon: ShieldCheck,
            color: 'text-emerald-400',
            bg: 'bg-emerald-500/10',
            border: 'border-emerald-500/20',
            barColor: 'bg-gradient-to-r from-emerald-500 to-cyan-400'
        },
        degraded: {
            icon: AlertTriangle,
            color: 'text-amber-400',
            bg: 'bg-amber-500/10',
            border: 'border-amber-500/20',
            barColor: 'bg-gradient-to-r from-amber-500 to-orange-400'
        },
        offline: {
            icon: XOctagon,
            color: 'text-rose-400',
            bg: 'bg-rose-500/10',
            border: 'border-rose-500/20',
            barColor: 'bg-gradient-to-r from-rose-500 to-red-400'
        },
    }[layer.status];

    const Icon = statusConfig.icon;

    return (
        <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 transition-all duration-200 border border-transparent hover:border-white/5">
            <div className="flex items-center gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center border", statusConfig.bg, statusConfig.border)}>
                    <Icon className={cn("w-4 h-4", statusConfig.color)} />
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/30">{layer.id}</span>
                        <span className="text-sm font-medium text-white">{layer.name}</span>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Health Bar */}
                <div className="hidden sm:block w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500", statusConfig.barColor)}
                        style={{ width: `${layer.health}%` }}
                    />
                </div>
                {/* Latency */}
                <div className="text-right min-w-[3.5rem]">
                    <div className="text-xs font-mono text-white/50">{layer.latency}</div>
                </div>
            </div>
        </div>
    );
};

const LayerHealth: React.FC = () => {
    const layers: Layer[] = [
        { id: 'L0', name: 'Smart Valve', status: 'active', health: 100, latency: '2ms' },
        { id: 'L1', name: 'Firewall', status: 'active', health: 98, latency: '5ms' },
        { id: 'L2', name: 'Rate Limiter', status: 'active', health: 95, latency: '3ms' },
        { id: 'L3', name: 'Anomaly Detector', status: 'degraded', health: 78, latency: '12ms' },
        { id: 'L4', name: 'AI Judge', status: 'active', health: 99, latency: '8ms' },
        { id: 'L5', name: 'Ledger', status: 'active', health: 100, latency: '4ms' },
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Layer Health</span>
                </div>
                <div className="text-[10px] font-mono text-white/30">6 LAYERS</div>
            </div>

            {/* Layer List */}
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {layers.map(layer => (
                    <LayerRow key={layer.id} layer={layer} />
                ))}
            </div>
        </div>
    );
};

export default LayerHealth;
