
import React from 'react';
import { motion } from 'framer-motion';

const LogoShowcase = () => {
    return (
        <div className="flex flex-col items-center gap-16 p-20 bg-[#030712] rounded-[40px] border border-white/5 backdrop-blur-3xl">
            <div className="text-center space-y-4">
                <h2 className="text-4xl font-bold tracking-tight text-white">Select Your Brand Identity</h2>
                <p className="text-white/40 text-lg">Three premium concepts designed to match your glassy aesthetic.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 w-full max-w-5xl">
                {/* Concept 1: The Ethereal Node */}
                <div className="glass-card p-10 flex flex-col items-center gap-8 group hover:border-emerald-400/30 transition-all">
                    <div className="w-24 h-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center relative overflow-hidden">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 4, repeat: Infinity }}
                            className="absolute inset-0 bg-gradient-to-br from-emerald-400/20 to-violet-400/20 blur-xl"
                        />
                        <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.8)] z-10"></div>
                        <div className="absolute inset-4 border border-white/5 rounded-2xl rotate-45"></div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-xl mb-2">The Ethereal Node</h3>
                        <p className="text-white/30 text-sm">Focuses on connectivity and living intelligence.</p>
                    </div>
                </div>

                {/* Concept 2: The Prism Shield */}
                <div className="glass-card p-10 flex flex-col items-center gap-8 group hover:border-violet-400/30 transition-all">
                    <div className="w-24 h-24 flex items-center justify-center relative">
                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M40 10L15 25V55L40 70L65 55V25L40 10Z" className="fill-emerald-400/10 stroke-emerald-400/40" strokeWidth="1" />
                            <path d="M40 20L25 30V50L40 60L55 50V30L40 20Z" className="fill-violet-400/20 stroke-violet-400/50" strokeWidth="1" />
                            <circle cx="40" cy="40" r="4" className="fill-white shadow-lg" />
                        </svg>
                        <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-xl mb-2">The Prism Shield</h3>
                        <p className="text-white/30 text-sm">Emphasizes governance and multi-layered security.</p>
                    </div>
                </div>

                {/* Concept 3: The Signal Key */}
                <div className="glass-card p-10 flex flex-col items-center gap-8 group hover:border-white/20 transition-all">
                    <div className="w-24 h-24 flex items-center justify-center gap-2">
                        <motion.div animate={{ height: [20, 40, 20] }} transition={{ duration: 2, repeat: Infinity, delay: 0 }} className="w-2 bg-emerald-400/40 rounded-full" />
                        <motion.div animate={{ height: [30, 60, 30] }} transition={{ duration: 2, repeat: Infinity, delay: 0.2 }} className="w-2 bg-white/60 rounded-full" />
                        <motion.div animate={{ height: [20, 40, 20] }} transition={{ duration: 2, repeat: Infinity, delay: 0.4 }} className="w-2 bg-violet-400/40 rounded-full" />
                        <div className="absolute w-16 h-[2px] bg-white/10 top-1/2 -translate-y-1/2"></div>
                    </div>
                    <div className="text-center">
                        <h3 className="text-white font-bold text-xl mb-2">The Signal Key</h3>
                        <p className="text-white/30 text-sm">Minimalist representation of data verification.</p>
                    </div>
                </div>
            </div>

            <button className="glass-button primary px-10">Select This Identity</button>
        </div>
    );
};

export default LogoShowcase;
