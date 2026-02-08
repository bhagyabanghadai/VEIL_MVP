import React, { useState, useEffect } from 'react';
import { Play, Pause, Filter, ExternalLink } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogEvent {
    id: string;
    timestamp: string;
    verdict: 'allow' | 'block';
    method: string;
    path: string;
    source: string;
    size: string;
}

const LiveFeed: React.FC = () => {
    const [isPaused, setIsPaused] = useState(false);
    const [events, setEvents] = useState<LogEvent[]>([]);

    // Generate mock events
    useEffect(() => {
        const generateEvent = (): LogEvent => {
            const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'];
            const paths = ['/api/users', '/api/auth', '/api/data', '/api/webhook', '/api/config', '/api/health'];
            const verdicts: ('allow' | 'block')[] = ['allow', 'allow', 'allow', 'allow', 'block'];

            return {
                id: Math.random().toString(36).substring(7),
                timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
                verdict: verdicts[Math.floor(Math.random() * verdicts.length)],
                method: methods[Math.floor(Math.random() * methods.length)],
                path: paths[Math.floor(Math.random() * paths.length)],
                source: `${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}.${Math.floor(Math.random() * 256)}`,
                size: `${Math.floor(Math.random() * 500 + 100)}B`,
            };
        };

        // Initial events
        setEvents(Array.from({ length: 15 }, generateEvent));

        // Add new events periodically
        if (!isPaused) {
            const interval = setInterval(() => {
                setEvents(prev => [generateEvent(), ...prev.slice(0, 19)]);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [isPaused]);

    return (
        <div className="flex flex-col h-full font-mono text-xs">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-3">
                    <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60 border border-rose-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60 border border-amber-500/80" />
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 border border-emerald-500/80" />
                    </div>
                    <span className="text-white/60 font-semibold">security_audit.log</span>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-colors"
                    >
                        {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-colors">
                        <Filter className="w-3.5 h-3.5" />
                    </button>
                    <button className="p-1.5 hover:bg-white/10 rounded-md text-white/40 hover:text-white transition-colors">
                        <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                </div>
            </div>

            {/* Log Table */}
            <div className="flex-1 overflow-y-auto">
                <table className="w-full text-left">
                    <thead className="sticky top-0 bg-slate-900/80 backdrop-blur-sm border-b border-white/5">
                        <tr className="text-white/30 text-[10px] uppercase tracking-wider">
                            <th className="py-2 px-3 font-medium">Time</th>
                            <th className="py-2 px-2 font-medium">Status</th>
                            <th className="py-2 px-2 font-medium">Method</th>
                            <th className="py-2 px-2 font-medium">Path</th>
                            <th className="py-2 px-2 font-medium">Source</th>
                            <th className="py-2 px-3 font-medium text-right">Size</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.03]">
                        {events.map((e) => (
                            <tr key={e.id} className="group hover:bg-white/[0.03] transition-colors">
                                <td className="py-2 px-3 text-white/40">{e.timestamp}</td>
                                <td className="py-2 px-2">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] uppercase font-bold",
                                        e.verdict === 'block'
                                            ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                            : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    )}>
                                        {e.verdict}
                                    </span>
                                </td>
                                <td className="py-2 px-2 text-white/50">{e.method}</td>
                                <td className="py-2 px-2 text-white/70 group-hover:text-white">{e.path}</td>
                                <td className="py-2 px-2 text-cyan-400/70">{e.source}</td>
                                <td className="py-2 px-3 text-right text-white/30">{e.size}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {events.length === 0 && (
                    <div className="flex items-center justify-center h-32 text-white/20 italic">
                        // waiting for stream data...
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveFeed;
