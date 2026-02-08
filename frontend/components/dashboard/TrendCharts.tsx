import React, { useState, useEffect } from 'react';
import { BarChart2, TrendingUp } from 'lucide-react';
import { cn } from '../../lib/utils';

interface DataPoint {
    hour: string;
    requests: number;
    blocked: number;
}

const TrendCharts: React.FC = () => {
    const [data, setData] = useState<DataPoint[]>([]);
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    useEffect(() => {
        // Generate 24-hour data
        const generateData = (): DataPoint[] => {
            return Array.from({ length: 24 }, (_, i) => ({
                hour: `${i.toString().padStart(2, '0')}:00`,
                requests: Math.floor(Math.random() * 1000 + 200),
                blocked: Math.floor(Math.random() * 100 + 10),
            }));
        };

        setData(generateData());

        // Update data periodically
        const interval = setInterval(() => {
            setData(prev => {
                const newData = [...prev.slice(1)];
                newData.push({
                    hour: `${newData.length.toString().padStart(2, '0')}:00`,
                    requests: Math.floor(Math.random() * 1000 + 200),
                    blocked: Math.floor(Math.random() * 100 + 10),
                });
                return newData;
            });
        }, 30000);

        return () => clearInterval(interval);
    }, []);

    const maxRequests = Math.max(...data.map(d => d.requests), 1);

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <BarChart2 className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Traffic Trends</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-gradient-to-t from-cyan-500 to-blue-400" />
                        <span className="text-white/40">Requests</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-sm bg-gradient-to-t from-rose-500 to-orange-400" />
                        <span className="text-white/40">Blocked</span>
                    </div>
                </div>
            </div>

            {/* Chart Area */}
            <div className="flex-1 flex items-end px-4 py-4 gap-1 relative">
                {data.map((point, index) => {
                    const heightPercent = (point.requests / maxRequests) * 100;
                    const blockedPercent = (point.blocked / maxRequests) * 100;
                    const isHovered = hoveredIndex === index;

                    return (
                        <div
                            key={index}
                            className="flex-1 flex flex-col items-center gap-1 group cursor-pointer relative"
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                        >
                            {/* Tooltip */}
                            {isHovered && (
                                <div className="absolute bottom-full mb-2 z-20 glass-card px-3 py-2 text-[10px] whitespace-nowrap">
                                    <div className="font-bold text-white mb-1">{point.hour}</div>
                                    <div className="text-cyan-400">{point.requests.toLocaleString()} requests</div>
                                    <div className="text-rose-400">{point.blocked.toLocaleString()} blocked</div>
                                </div>
                            )}

                            {/* Request Bar */}
                            <div
                                className={cn(
                                    "w-full rounded-t transition-all duration-200",
                                    isHovered ? "bg-gradient-to-t from-cyan-500 to-blue-400" : "bg-gradient-to-t from-cyan-500/60 to-blue-400/60"
                                )}
                                style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                            />

                            {/* Blocked Bar (overlay) */}
                            <div
                                className={cn(
                                    "w-full rounded-t absolute bottom-0 transition-all duration-200",
                                    isHovered ? "bg-gradient-to-t from-rose-500 to-orange-400" : "bg-gradient-to-t from-rose-500/60 to-orange-400/60"
                                )}
                                style={{ height: `${blockedPercent}%`, minHeight: '2px' }}
                            />
                        </div>
                    );
                })}
            </div>

            {/* Summary Stats */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 text-xs">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="text-white/40">Total: </span>
                        <span className="font-bold text-white">{data.reduce((sum, d) => sum + d.requests, 0).toLocaleString()}</span>
                    </div>
                    <div>
                        <span className="text-white/40">Blocked: </span>
                        <span className="font-bold text-rose-400">{data.reduce((sum, d) => sum + d.blocked, 0).toLocaleString()}</span>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-400">
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-medium">+12% vs yesterday</span>
                </div>
            </div>
        </div>
    );
};

export default TrendCharts;
