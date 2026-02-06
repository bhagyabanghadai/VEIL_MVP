import { motion } from 'framer-motion';
import { ContainerScroll } from '@/components/ui/container-scroll-animation';
import React, { useState, useEffect } from 'react';

// Real-looking system metrics
const SYSTEMS = [
    {
        title: "NEURAL FIREWALL",
        id: "FW-01",
        value: "99.97%",
        label: "BLOCK RATE",
        sublabel: "Last 24h",
        status: "NOMINAL",
        color: "text-green-400",
        bgColor: "bg-green-500",
        trend: "+0.02%",
        requests: "2.4M",
        blocked: "847"
    },
    {
        title: "IDENTITY BRIDGE",
        id: "ID-02",
        value: "ACTIVE",
        label: "ZK PROOFS",
        sublabel: "Verification",
        status: "ONLINE",
        color: "text-blue-400",
        bgColor: "bg-blue-500",
        trend: "153/s",
        requests: "1.2M",
        blocked: "N/A"
    },
    {
        title: "AUDIT LEDGER",
        id: "LG-03",
        value: "100%",
        label: "INTEGRITY",
        sublabel: "Chain Valid",
        status: "VERIFIED",
        color: "text-yellow-400",
        bgColor: "bg-yellow-500",
        trend: "12.4K blocks",
        requests: "892K",
        blocked: "0"
    },
    {
        title: "EDGE MESH",
        id: "EM-04",
        value: "3.2ms",
        label: "AVG LATENCY",
        sublabel: "P95: 8.1ms",
        status: "OPTIMAL",
        color: "text-purple-400",
        bgColor: "bg-purple-500",
        trend: "-0.4ms",
        requests: "4.1M",
        blocked: "12"
    }
];

export const HolographicDeck = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="bg-[#0a0a0c] relative z-20 border-t border-white/5 overflow-hidden">
            {/* Connection Line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-green-500/50 to-transparent z-0" />

            <div className="relative z-10">
                <ContainerScroll
                    titleComponent={
                        <div className="flex flex-col items-center mb-12">
                            <div className="flex items-center gap-3 mb-4">
                                <motion.div
                                    className="w-2 h-2 rounded-full bg-green-500"
                                    animate={{ opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 1.5, repeat: Infinity }}
                                />
                                <span className="font-mono text-xs text-green-400 tracking-widest">MONITORING ACTIVE</span>
                            </div>
                            <h2 className="text-[8vw] md:text-7xl font-black text-white tracking-tighter leading-none mb-4">
                                SYSTEM INTEGRITY
                            </h2>
                            <p className="text-white/40 font-mono tracking-[0.2em] uppercase text-xs">
                                Version 2.4.1 • Uptime 99.99% • {currentTime.toLocaleTimeString('en-US', { hour12: false })} UTC
                            </p>
                        </div>
                    }
                >
                    {/* Dashboard Container */}
                    <div className="w-full h-full bg-[#0a0a0c] relative border border-white/10 overflow-hidden">

                        {/* Top Status Bar */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-[#0d0d10] border-b border-white/5 flex items-center justify-between px-4 z-20">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="font-mono text-[10px] text-green-400">ALL SYSTEMS NOMINAL</span>
                                </div>
                                <div className="h-3 w-px bg-white/10" />
                                <span className="font-mono text-[10px] text-white/30">VEIL SECURITY DASHBOARD</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="font-mono text-[10px] text-white/30">REGION: GLOBAL</span>
                                <span className="font-mono text-[10px] text-white/30">NODE: PRIMARY</span>
                            </div>
                        </div>

                        {/* CRT Scanline Effect */}
                        <div className="absolute inset-0 z-10 pointer-events-none opacity-20">
                            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_2px]" />
                            <motion.div
                                className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-32"
                                animate={{ y: ["-100%", "400%"] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                            />
                        </div>

                        {/* Main Grid - 2x2 System Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/5 pt-8 h-full">
                            {SYSTEMS.map((sys, i) => (
                                <SystemCard key={sys.id} system={sys} index={i} />
                            ))}
                        </div>

                        {/* Bottom Status Bar */}
                        <div className="absolute bottom-0 left-0 right-0 h-6 bg-[#0d0d10] border-t border-white/5 flex items-center justify-between px-4 z-20">
                            <div className="flex items-center gap-6">
                                <span className="font-mono text-[9px] text-white/30">CPU: 23%</span>
                                <span className="font-mono text-[9px] text-white/30">MEM: 4.2GB</span>
                                <span className="font-mono text-[9px] text-white/30">NET: 125Mb/s</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[9px] text-white/30">ENCRYPTED CONNECTION</span>
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            </div>
                        </div>
                    </div>
                </ContainerScroll>
            </div>
        </section>
    );
};

interface SystemCardProps {
    system: typeof SYSTEMS[0];
    index: number;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, index }) => {
    const [displayValue, setDisplayValue] = useState(system.value);
    const [requests, setRequests] = useState(system.requests);

    // Live updating effect
    useEffect(() => {
        const interval = setInterval(() => {
            // Slight value fluctuation for realism
            if (system.value.includes('%') && system.value !== '100%') {
                const base = parseFloat(system.value);
                const variance = (Math.random() - 0.5) * 0.02;
                setDisplayValue(`${(base + variance).toFixed(2)}%`);
            } else if (system.value.includes('ms')) {
                const base = parseFloat(system.value);
                const variance = (Math.random() - 0.5) * 0.4;
                setDisplayValue(`${(base + variance).toFixed(1)}ms`);
            }

            // Update requests count
            const currentRequests = parseFloat(system.requests.replace(/[^0-9.]/g, ''));
            const increment = Math.random() * 0.01;
            const suffix = system.requests.includes('M') ? 'M' : 'K';
            setRequests(`${(currentRequests + increment).toFixed(1)}${suffix}`);
        }, 2000);

        return () => clearInterval(interval);
    }, [system]);

    return (
        <motion.div
            className="bg-[#0c0c0f] p-6 flex flex-col justify-between relative group h-48 hover:bg-[#101014] transition-all duration-300 overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            {/* Top Row: ID + Status */}
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] text-white/30 bg-white/5 px-2 py-0.5 rounded">
                        {system.id}
                    </span>
                    <span className={`font-mono text-[10px] ${system.color} tracking-wider`}>
                        {system.status}
                    </span>
                </div>
                <motion.div
                    className={`w-2 h-2 rounded-full ${system.bgColor}`}
                    animate={{
                        opacity: [0.5, 1, 0.5],
                        boxShadow: [
                            `0 0 0px ${system.bgColor.replace('bg-', 'rgba(').replace('-500', ', 0)')}`,
                            `0 0 8px ${system.bgColor.replace('bg-', 'rgba(').replace('-500', ', 0.5)')}`,
                            `0 0 0px ${system.bgColor.replace('bg-', 'rgba(').replace('-500', ', 0)')}`
                        ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            </div>

            {/* Middle: Main Value */}
            <div className="my-4">
                <h3 className="text-sm font-medium text-white/70 tracking-wide mb-1">{system.title}</h3>
                <div className="flex items-baseline gap-3">
                    <motion.span
                        className="text-4xl font-mono font-bold text-white tracking-tight"
                        key={displayValue}
                        initial={{ opacity: 0.7 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {displayValue}
                    </motion.span>
                    <span className={`text-xs font-mono ${system.color}`}>{system.trend}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-mono text-white/40 uppercase">{system.label}</span>
                    <span className="text-[10px] font-mono text-white/20">• {system.sublabel}</span>
                </div>
            </div>

            {/* Bottom: Stats Row */}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                    <div>
                        <span className="text-[9px] font-mono text-white/30 uppercase block">Requests</span>
                        <span className="text-xs font-mono text-white/60">{requests}</span>
                    </div>
                    <div>
                        <span className="text-[9px] font-mono text-white/30 uppercase block">Blocked</span>
                        <span className="text-xs font-mono text-white/60">{system.blocked}</span>
                    </div>
                </div>

                {/* Mini chart indicator */}
                <div className="flex items-end gap-px h-4">
                    {[40, 60, 45, 80, 70, 90, 85].map((h, i) => (
                        <motion.div
                            key={i}
                            className={`w-1 ${system.bgColor} opacity-40`}
                            style={{ height: `${h}%` }}
                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 1, delay: i * 0.1, repeat: Infinity }}
                        />
                    ))}
                </div>
            </div>

            {/* Data pulse line */}
            <motion.div
                className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent ${system.bgColor.replace('bg-', 'via-')}/30 to-transparent`}
                animate={{ scaleX: [0, 1, 0], opacity: [0, 1, 0] }}
                transition={{ duration: 3, delay: index * 0.5, repeat: Infinity }}
            />
        </motion.div>
    );
};
