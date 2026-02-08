import React, { useState, useEffect } from 'react';
import { Globe, AlertTriangle } from 'lucide-react';
import { cn } from '../../lib/utils';

interface Threat {
    id: string;
    x: number;
    y: number;
    severity: 'low' | 'medium' | 'high';
    timestamp: number;
}

const ThreatMap: React.FC = () => {
    const [threats, setThreats] = useState<Threat[]>([]);

    useEffect(() => {
        const generateThreat = (): Threat => ({
            id: Math.random().toString(36).substring(7),
            x: 10 + Math.random() * 80,
            y: 15 + Math.random() * 70,
            severity: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as any,
            timestamp: Date.now(),
        });

        // Initial threats
        setThreats(Array.from({ length: 8 }, generateThreat));

        // Add new threats periodically
        const interval = setInterval(() => {
            setThreats(prev => {
                const newThreats = [...prev, generateThreat()];
                // Remove old threats (older than 10 seconds)
                return newThreats.filter(t => Date.now() - t.timestamp < 10000).slice(-15);
            });
        }, 2500);

        return () => clearInterval(interval);
    }, []);

    const severityColors = {
        low: { dot: 'bg-cyan-400', ring: 'ring-cyan-400/30', shadow: 'shadow-cyan-500/50' },
        medium: { dot: 'bg-amber-400', ring: 'ring-amber-400/30', shadow: 'shadow-amber-500/50' },
        high: { dot: 'bg-rose-400', ring: 'ring-rose-400/30', shadow: 'shadow-rose-500/50' },
    };

    return (
        <div className="h-full flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-slate-900/80 to-transparent z-10">
                <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-cyan-400" />
                    <span className="text-sm font-semibold text-white">Global Threat Activity</span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        <span>Low</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Medium</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-rose-400" />
                        <span>High</span>
                    </div>
                </div>
            </div>

            {/* Map Background */}
            <div className="flex-1 relative bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950">
                {/* Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '40px 40px'
                    }}
                />

                {/* Simplified World Map (SVG paths) */}
                <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
                    {/* North America */}
                    <path d="M150 100 L280 80 L320 120 L290 200 L200 220 L120 180 Z" fill="currentColor" className="text-cyan-400/30" />
                    {/* Europe */}
                    <path d="M450 90 L550 80 L560 140 L480 150 Z" fill="currentColor" className="text-cyan-400/30" />
                    {/* Asia */}
                    <path d="M560 80 L800 100 L820 200 L700 250 L580 200 L550 120 Z" fill="currentColor" className="text-cyan-400/30" />
                    {/* South America */}
                    <path d="M200 250 L280 280 L260 400 L180 380 Z" fill="currentColor" className="text-cyan-400/30" />
                    {/* Africa */}
                    <path d="M450 180 L550 190 L540 340 L460 350 L430 280 Z" fill="currentColor" className="text-cyan-400/30" />
                    {/* Australia */}
                    <path d="M780 320 L880 300 L900 380 L800 400 Z" fill="currentColor" className="text-cyan-400/30" />
                </svg>

                {/* Threat Dots */}
                {threats.map(threat => {
                    const colors = severityColors[threat.severity];
                    return (
                        <div
                            key={threat.id}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-fade-in"
                            style={{ left: `${threat.x}%`, top: `${threat.y}%` }}
                        >
                            {/* Pulse Ring */}
                            <div className={cn(
                                "absolute inset-0 w-6 h-6 -m-2 rounded-full animate-ping opacity-30",
                                colors.dot
                            )} />
                            {/* Core Dot */}
                            <div className={cn(
                                "relative w-2 h-2 rounded-full ring-2 shadow-lg",
                                colors.dot,
                                colors.ring,
                                colors.shadow
                            )} />
                        </div>
                    );
                })}

                {/* Stats Overlay */}
                <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-t from-slate-900/80 to-transparent">
                    <div className="flex items-center gap-4">
                        <div className="glass-button flex items-center gap-2 py-1.5 px-3">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                            <span className="text-xs text-white/70">
                                <span className="font-bold text-white">{threats.length}</span> active
                            </span>
                        </div>
                    </div>
                    <div className="text-[10px] font-mono text-white/30">
                        Last updated: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ThreatMap;
