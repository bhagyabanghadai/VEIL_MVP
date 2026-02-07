import React from 'react';

interface Layer {
    id: string;
    name: string;
    health: number;
    status: 'active' | 'degraded' | 'offline';
    metric?: string;
}

interface LayerHealthProps {
    layers?: Layer[];
}

const defaultLayers: Layer[] = [
    { id: 'L0', name: 'Proxy', health: 100, status: 'active', metric: 'Intercepting' },
    { id: 'L1', name: 'Identity', health: 100, status: 'active', metric: '23 verified' },
    { id: 'L2', name: 'Intent', health: 100, status: 'active', metric: '0 replay' },
    { id: 'L3', name: 'Policy (OPA)', health: 98, status: 'active', metric: '4 rules' },
    { id: 'L4', name: 'Judge (LLM)', health: 95, status: 'active', metric: '8ms avg' },
    { id: 'L7', name: 'Ledger', health: 100, status: 'active', metric: '1,234 entries' },
];

const LayerHealth: React.FC<LayerHealthProps> = ({ layers = defaultLayers }) => {
    const getHealthColor = (health: number) => {
        if (health >= 95) return 'bg-emerald-500';
        if (health >= 80) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getStatusIcon = (status: string) => {
        if (status === 'active') return '✓';
        if (status === 'degraded') return '!';
        return '×';
    };

    const getStatusColor = (status: string) => {
        if (status === 'active') return 'text-emerald-400 bg-emerald-500/20';
        if (status === 'degraded') return 'text-amber-400 bg-amber-500/20';
        return 'text-red-400 bg-red-500/20';
    };

    return (
        <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Security Layer Health
                </h3>
            </div>

            <div className="p-4 space-y-3">
                {layers.map((layer) => (
                    <div key={layer.id} className="group">
                        <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                                <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold ${getStatusColor(layer.status)}`}>
                                    {getStatusIcon(layer.status)}
                                </span>
                                <span className="text-xs font-mono text-slate-300">
                                    <span className="text-slate-500">{layer.id}</span> {layer.name}
                                </span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-500 font-mono">
                                    {layer.metric}
                                </span>
                                <span className="text-xs font-bold text-white">
                                    {layer.health}%
                                </span>
                            </div>
                        </div>

                        {/* Health Bar */}
                        <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${getHealthColor(layer.health)} transition-all duration-500 rounded-full`}
                                style={{ width: `${layer.health}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LayerHealth;
