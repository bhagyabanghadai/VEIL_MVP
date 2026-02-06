import React from 'react';
import { motion } from 'framer-motion';

const steps = [
    { id: 'identity', label: 'Agent Identity', icon: 'ID' },
    { id: 'intercept', label: 'Intercept', icon: '⚡' },
    { id: 'reasoning', label: 'Deep Reasoning', icon: '🧠' },
    { id: 'decision', label: 'Policy Check', icon: '🛡️' },
    { id: 'audit', label: 'Immutable Ledger', icon: '📜' },
];

const CheckpointFlow: React.FC = () => {
    return (
        <div className="w-full py-20 px-4 md:px-10 overflow-hidden">
            <div className="max-w-6xl mx-auto">
                <div className="mb-16 text-center">
                    <h3 className="text-[#00f0ff] font-mono text-xs tracking-[0.5em] uppercase mb-4">Live Execution Path</h3>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">Every Action Verified.</h2>
                </div>

                {/* Desktop Pipeline */}
                <div className="relative hidden md:flex items-center justify-between">
                    {/* Connecting Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[2px] bg-white/10 -translate-y-1/2"></div>

                    {/* Active Data Packet Animation */}
                    <motion.div
                        className="absolute top-1/2 left-0 w-full h-[2px] -translate-y-1/2 overflow-hidden"
                    >
                        <motion.div
                            animate={{ x: ['0%', '100%'] }}
                            transition={{ duration: 4, ease: "linear", repeat: Infinity }}
                            className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent"
                        />
                    </motion.div>

                    {steps.map((step, i) => (
                        <div key={step.id} className="relative z-10 flex flex-col items-center group">
                            <motion.div
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                transition={{ delay: i * 0.2 }}
                                className="w-16 h-16 rounded-full bg-black border border-white/20 flex items-center justify-center text-xl shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all duration-500"
                            >
                                {step.icon}
                            </motion.div>
                            <div className="absolute top-20 w-32 text-center">
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{`0${i + 1}`}</span>
                                <h4 className="text-sm font-bold text-white mt-1 group-hover:text-[#00f0ff] transition-colors">{step.label}</h4>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Mobile Vertical Pipeline */}
                <div className="flex md:hidden flex-col gap-10">
                    {steps.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-6">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                                    {step.icon}
                                </div>
                                {i !== steps.length - 1 && (
                                    <div className="absolute top-12 left-1/2 w-[2px] h-10 bg-white/10 -translate-x-1/2"></div>
                                )}
                            </div>
                            <div>
                                <span className="text-[10px] font-mono text-white/30 uppercase tracking-widest">{`0${i + 1}`}</span>
                                <h4 className="text-sm font-bold text-white">{step.label}</h4>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CheckpointFlow;
