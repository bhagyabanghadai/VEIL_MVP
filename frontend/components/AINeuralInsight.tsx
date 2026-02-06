
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AINeuralInsightProps {
    insights: {
        summary: string;
        riskTrend: string;
        criticalAlerts: string[];
    };
    isLoading?: boolean;
}

const AINeuralInsight: React.FC<AINeuralInsightProps> = ({ insights, isLoading }) => {
    const getTrendColor = (trend: string) => {
        switch (trend.toUpperCase()) {
            case 'CRITICAL': return '#ff3b30';
            case 'RISING': return '#ff9500';
            case 'STABLE': return '#34d399';
            default: return '#00f0ff';
        }
    };

    const trendColor = getTrendColor(insights.riskTrend);

    return (
        <div className="glass-panel p-8 relative overflow-hidden group min-h-[220px]">
            {/* Neural Pulse Background Animation */}
            <div className="absolute inset-0 pointer-events-none opacity-20">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.1, 0.3, 0.1],
                    }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute -top-1/2 -left-1/2 w-full h-full rounded-full blur-[100px]"
                    style={{ background: trendColor }}
                />
            </div>

            <div className="relative z-10 flex flex-col h-full space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <div className="absolute inset-0 rounded-full border border-white/10 animate-spin-slow"></div>
                            <motion.div
                                animate={{ scale: [0.8, 1.1, 0.8] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="w-4 h-4 rounded-full shadow-[0_0_15px_currentcolor]"
                                style={{ backgroundColor: trendColor, color: trendColor }}
                            />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-mono font-bold text-white/40 tracking-[0.3em] uppercase">Neural Analysis Center</span>
                            <span className="text-[14px] font-black italic tracking-tight text-white/90">AI EXECUTIVE_SUMMARY</span>
                        </div>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-[8px] font-mono font-bold text-white/20 uppercase mb-1">Risk_Trend</span>
                        <span className="text-[12px] font-black tracking-widest uppercase px-3 py-1 border rounded"
                            style={{ borderColor: `${trendColor}40`, color: trendColor, textShadow: `0 0 10px ${trendColor}40` }}>
                            {insights.riskTrend}
                        </span>
                    </div>
                </div>

                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {isLoading ? (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 py-4"
                            >
                                <div className="flex gap-1">
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1 h-1 bg-cyan-400 rounded-full" />
                                </div>
                                <span className="text-[11px] font-mono text-cyan-400/60 uppercase tracking-widest">Processing Intelligence Stream...</span>
                            </motion.div>
                        ) : (
                            <motion.div
                                key={insights.summary}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-4"
                            >
                                <p className="text-[15px] font-medium leading-relaxed text-white/80 italic">
                                    "{insights.summary}"
                                </p>

                                {insights.criticalAlerts.length > 0 && (
                                    <div className="flex flex-wrap gap-3">
                                        {insights.criticalAlerts.map((alert, i) => (
                                            <span key={i} className="text-[9px] font-bold px-2 py-1 bg-[#ff3b30]/10 border border-[#ff3b30]/20 text-[#ff3b30] uppercase tracking-wider">
                                                ⚠️ {alert}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AINeuralInsight;
