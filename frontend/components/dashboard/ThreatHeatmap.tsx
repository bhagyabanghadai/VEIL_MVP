import React from 'react';

interface HeatmapCell {
    hour: number;
    count: number;
}

interface ThreatHeatmapProps {
    data?: HeatmapCell[];
}

// Generate sample 24h data
const generateDefaultData = (): HeatmapCell[] => {
    return Array.from({ length: 24 }, (_, hour) => ({
        hour,
        count: Math.random() < 0.2 ? Math.floor(Math.random() * 5) + 1 : 0,
    }));
};

const ThreatHeatmap: React.FC<ThreatHeatmapProps> = ({ data = generateDefaultData() }) => {
    const getIntensity = (count: number) => {
        if (count === 0) return 'bg-slate-800/50';
        if (count === 1) return 'bg-amber-500/30';
        if (count <= 3) return 'bg-orange-500/50';
        return 'bg-red-500/70';
    };

    const maxCount = Math.max(...data.map(d => d.count), 1);

    return (
        <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 overflow-hidden">
            <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Threat Heatmap (24H)
                </h3>
            </div>

            <div className="p-4">
                {/* Hour labels */}
                <div className="flex justify-between text-[9px] text-slate-500 font-mono mb-2 px-1">
                    <span>00</span>
                    <span>06</span>
                    <span>12</span>
                    <span>18</span>
                    <span>24</span>
                </div>

                {/* Heatmap grid */}
                <div className="grid grid-cols-24 gap-0.5">
                    {data.map((cell, i) => (
                        <div
                            key={i}
                            className={`aspect-square rounded-sm ${getIntensity(cell.count)} transition-colors hover:ring-1 hover:ring-white/20 cursor-pointer`}
                            title={`${cell.hour}:00 - ${cell.count} attack${cell.count !== 1 ? 's' : ''}`}
                        />
                    ))}
                </div>

                {/* Legend */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3 text-[10px] text-slate-500">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-slate-800/50" />
                            <span>None</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-amber-500/30" />
                            <span>Low</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-orange-500/50" />
                            <span>Med</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-sm bg-red-500/70" />
                            <span>High</span>
                        </div>
                    </div>

                    <span className="text-[10px] text-slate-400">
                        Total: <span className="text-white font-bold">{data.reduce((a, b) => a + b.count, 0)}</span> attacks
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ThreatHeatmap;
