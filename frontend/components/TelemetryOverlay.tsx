
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const generateHash = () => Math.random().toString(36).substring(7).toUpperCase();
const generateAction = () => {
    const actions = ['INTERCEPT', 'SCAN', 'VERIFY', 'BLOCK', 'AUDIT', 'ENCRYPT', 'DECRYPT'];
    return actions[Math.floor(Math.random() * actions.length)];
};
const generateStatus = () => {
    const statuses = ['OK', 'PENDING', 'DENIED', 'FLAGGED'];
    return statuses[Math.floor(Math.random() * statuses.length)];
};
const generateAlert = () => {
    const alerts = ['INJECTION_ATTEMPT', 'UNAUTHORIZED_ACCESS', 'RATE_LIMIT_EXCEEDED', 'MALICIOUS_PAYLOAD'];
    return alerts[Math.floor(Math.random() * alerts.length)];
};

const TelemetryOverlay: React.FC = () => {
    const [logs, setLogs] = useState<string[]>([]);
    const [threatCount, setThreatCount] = useState(843);
    const [verifiedCount, setVerifiedCount] = useState(12094);

    // Initial fill
    useEffect(() => {
        const initialLogs = Array.from({ length: 15 }).map(() =>
            `> [${new Date().toISOString().split('T')[1].slice(0, 8)}] ${generateAction()}::${generateHash()} [${generateStatus()}]`
        );
        setLogs(initialLogs);
    }, []);

    // Live log stream
    useEffect(() => {
        const interval = setInterval(() => {
            let newLog;
            if (Math.random() > 0.95) {
                // Component: Alert Event
                newLog = `> [${new Date().toISOString().split('T')[1].slice(0, 8)}] CRITICAL_ALERT::${generateAlert()} [BLOCK]`;
            } else {
                newLog = `> [${new Date().toISOString().split('T')[1].slice(0, 8)}] ${generateAction()}::${generateHash()} [${generateStatus()}]`;
            }

            setLogs(prev => [...prev.slice(1), newLog]);

            // Randomly update counters
            if (Math.random() > 0.5) setVerifiedCount(c => c + Math.floor(Math.random() * 5));
            if (Math.random() > 0.8) setThreatCount(c => c + 1);
        }, 120); // Faster updates for "High Load" feel

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[40] overflow-hidden font-mono text-[10px] md:text-[11px] select-none">
            {/* Corner Stats - Top Right */}
            <div className="absolute top-24 right-6 md:right-10 flex flex-col items-end gap-1 opacity-60">
                <div className="flex items-center gap-4 bg-black/80 backdrop-blur px-4 py-2 border-r-2 border-[#00f0ff]">
                    <span className="text-white/40">VERIFIED_AGENTS</span>
                    <span className="text-[#00f0ff] font-bold text-lg tabular-nums">{verifiedCount.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-4 bg-black/80 backdrop-blur px-4 py-2 border-r-2 border-red-500 mt-2">
                    <span className="text-white/40">THREATS_BLOCKED</span>
                    <span className="text-red-500 font-bold text-lg tabular-nums">{threatCount.toLocaleString()}</span>
                </div>
            </div>

            {/* Rolling Logs - Bottom Left */}
            <div className="absolute bottom-6 left-6 md:left-10 md:bottom-10 max-w-sm w-full opacity-50">
                <div className="h-[2px] w-full bg-gradient-to-r from-emerald-500 to-transparent mb-4"></div>
                <div className="flex flex-col-reverse gap-1 text-[10px] tracking-tight shadow-black drop-shadow-md font-bold">
                    {logs.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1 - (logs.length - 1 - i) * 0.1, x: 0 }}
                            className={`truncate ${log.includes('CRITICAL') ? 'text-red-500 animate-pulse' : 'text-emerald-500/80'}`}
                        >
                            {log}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Static Grid Lines for "Overlay" feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:200px_200px]"></div>

            {/* Corner Brackets */}
            <svg className="absolute top-6 left-6 w-16 h-16 text-white/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M2 30 V 2 H 30" />
            </svg>
            <svg className="absolute bottom-6 right-6 w-16 h-16 text-white/20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M98 70 V 98 H 70" />
            </svg>
        </div>
    );
};

export default TelemetryOverlay;
