import React, { useEffect, useState } from 'react';

interface SecurityEvent {
    id: string;
    timestamp: string;
    verdict: 'allow' | 'block';
    method: string;
    path: string;
    reason: string;
    layer: string;
    confidence?: number;
}

interface LiveFeedProps {
    events?: SecurityEvent[];
    maxItems?: number;
}

const LiveFeed: React.FC<LiveFeedProps> = ({ events: propEvents, maxItems = 10 }) => {
    const [events, setEvents] = useState<SecurityEvent[]>(propEvents || []);

    useEffect(() => {
        // Poll backend for live events
        const fetchEvents = async () => {
            try {
                const res = await fetch('/api/logs');
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.slice(0, maxItems).map((log: any, i: number) => ({
                        id: log.id || `event-${i}`,
                        timestamp: new Date(log.createdAt).toLocaleTimeString('en-US', { hour12: false }),
                        verdict: log.decision === 'allow' ? 'allow' : 'block',
                        method: log.actionType || 'GET',
                        path: log.actionContent || '/',
                        reason: log.reasons?.[0] || 'Standard check',
                        layer: 'L3',
                        confidence: log.riskScore ? (100 - log.riskScore) / 100 : undefined,
                    }));
                    setEvents(mapped);
                }
            } catch (err) {
                console.error('Failed to fetch events:', err);
            }
        };

        fetchEvents();
        const interval = setInterval(fetchEvents, 3000);
        return () => clearInterval(interval);
    }, [maxItems]);

    const getVerdictStyles = (verdict: string) => {
        if (verdict === 'allow') {
            return {
                bg: 'bg-emerald-500/10',
                border: 'border-emerald-500/20',
                dot: 'bg-emerald-400',
                text: 'text-emerald-400',
            };
        }
        return {
            bg: 'bg-red-500/10',
            border: 'border-red-500/20',
            dot: 'bg-red-400',
            text: 'text-red-400',
        };
    };

    return (
        <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Live Security Feed
                </h3>
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] text-slate-500">LIVE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
                {events.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-slate-500 text-xs">
                        Waiting for events...
                    </div>
                ) : (
                    events.map((event) => {
                        const styles = getVerdictStyles(event.verdict);
                        return (
                            <div
                                key={event.id}
                                className={`p-3 rounded-lg ${styles.bg} border ${styles.border} transition-all hover:scale-[1.01]`}
                            >
                                <div className="flex items-start justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${styles.dot}`} />
                                        <span className={`text-xs font-bold uppercase ${styles.text}`}>
                                            {event.verdict}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {event.method}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-slate-500 font-mono">
                                        {event.timestamp}
                                    </span>
                                </div>

                                <p className="text-xs text-slate-300 font-mono truncate mb-1">
                                    {event.path}
                                </p>

                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] text-slate-500">
                                        {event.reason}
                                    </span>
                                    {event.confidence !== undefined && (
                                        <span className="text-[10px] text-slate-400">
                                            Conf: <span className="text-white">{(event.confidence * 100).toFixed(0)}%</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LiveFeed;
