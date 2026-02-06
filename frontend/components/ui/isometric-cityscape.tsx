"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * IsometricCityscape - Refined Industrial & Cyberpunk Visualization
 * Incorporates "Landing Page" atmospheric effects (Neural Network, Noise, HUD)
 * Matches reference image: Dark, Blue/Cyan, Cooling Towers, Pipes.
 */
export const IsometricCityscape: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#050608]">
            {/* Styles & Animations */}
            <style>{`
        @keyframes flow-pipe {
          0% { stroke-dashoffset: 20; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes steam-rise {
          0% { transform: translateY(0) scale(1); opacity: 0.6; }
          100% { transform: translateY(-40px) scale(2); opacity: 0; }
        }
        @keyframes pulse-structure {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 5px rgba(59,130,246,0.5)); }
          50% { filter: brightness(1.3) drop-shadow(0 0 15px rgba(59,130,246,0.8)); }
        }
        @keyframes scan-vertical {
          0% { transform: translateY(-100%); opacity: 0; }
          20% { opacity: 0.5; }
          80% { opacity: 0.5; }
          100% { transform: translateY(100%); opacity: 0; }
        }
        .industrial-glow {
          filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4));
        }
      `}</style>

            {/* === LANDING PAGE EFFECT: Base Noise & Grid === */}
            <div className="absolute inset-0 z-0 bg-[#0a0c10]">
                {/* Noise Texture */}
                <div className="absolute inset-0 opacity-[0.03]" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }} />

                {/* Neural Network / Grid Overlay */}
                <div
                    className="absolute inset-0 opacity-[0.05]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(59, 130, 246, 0.3) 1px, transparent 1px), 
                            linear-gradient(90deg, rgba(59, 130, 246, 0.3) 1px, transparent 1px)
                        `,
                        backgroundSize: '60px 60px'
                    }}
                />
            </div>

            {/* === ISOMETRIC INDUSTRIAL SCENE === */}
            <div className="absolute inset-0 flex items-center justify-center -translate-y-10" style={{ perspective: '1200px' }}>
                <svg
                    viewBox="0 0 800 600"
                    className="w-full h-full max-w-[140%] max-h-[140%]"
                    style={{ transform: 'rotateX(20deg) rotateZ(-5deg) scale(1.1)' }}
                >
                    <defs>
                        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="50%" stopColor="#0f172a" />
                            <stop offset="100%" stopColor="#020617" />
                        </linearGradient>
                        <linearGradient id="pipeGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0ea5e9" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <filter id="glow-panel">
                            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* --- PLATFORM BASE --- */}
                    <g transform="translate(100, 300)">
                        <path d="M0,0 L600,-200 L700,100 L100,300 Z" fill="#050608" opacity="0.8" />

                        {/* Grid lines on platform */}
                        {[0, 1, 2, 3, 4, 5].map(i => (
                            <path key={`g-${i}`} d={`M${i * 100},-33 L${100 + i * 100},266`} stroke="#1e293b" strokeWidth="1" />
                        ))}
                    </g>

                    {/* --- INDUSTRIAL UNIT 1: COOLING TOWER CLUSTER (Left) --- */}
                    <g transform="translate(180, 280)">
                        {/* Large Cooling Tower */}
                        <ellipse cx="60" cy="120" rx="40" ry="15" fill="#1e293b" />
                        <path d="M20,120 L30,20 L90,20 L100,120 Z" fill="url(#metalGrad)" />
                        <ellipse cx="60" cy="20" rx="30" ry="8" fill="#0f172a" stroke="#334155" />

                        {/* Steam Effect */}
                        <g style={{ animation: 'steam-rise 3s ease-in-out infinite' }}>
                            <circle cx="50" cy="15" r="5" fill="#fff" opacity="0.2" filter="blur(4px)" />
                            <circle cx="70" cy="10" r="8" fill="#fff" opacity="0.1" filter="blur(6px)" />
                        </g>

                        {/* Piping */}
                        <path d="M100,100 L140,100 L140,40" fill="none" stroke="#1e293b" strokeWidth="6" />
                        <path d="M100,100 L140,100 L140,40" fill="none" stroke="url(#pipeGrad)" strokeWidth="2" strokeDasharray="10 10" style={{ animation: 'flow-pipe 1s linear infinite' }} />
                    </g>

                    {/* --- INDUSTRIAL UNIT 2: DATA REFINERY (Center) --- */}
                    <g transform="translate(380, 220)">
                        <rect x="0" y="0" width="120" height="140" fill="url(#metalGrad)" stroke="#334155" strokeWidth="1" />

                        {/* Glowing Blue Racks */}
                        {[0, 1, 2, 3].map(i => (
                            <rect key={`rack-${i}`} x="10" y={20 + i * 30} width="100" height="4" fill="#3b82f6" className="industrial-glow" style={{ animation: `pulse-structure 3s infinite ${i * 0.5}s` }} />
                        ))}

                        {/* Top Antenna */}
                        <path d="M60,0 L60,-40" stroke="#475569" strokeWidth="2" />
                        <circle cx="60" cy="-40" r="3" fill="#ef4444" style={{ animation: 'pulse-structure 1s infinite' }} />
                    </g>

                    {/* --- INDUSTRIAL UNIT 3: STORAGE TANKS (Right) --- */}
                    <g transform="translate(550, 250)">
                        {[0, 1, 2].map(i => (
                            <g key={`tank-${i}`} transform={`translate(${i * 50}, ${i * -20})`}>
                                <path d="M0,0 L0,-60" stroke="#334155" strokeWidth="40" strokeLinecap="round" />
                                <path d="M0,0 L0,-60" stroke="url(#metalGrad)" strokeWidth="38" strokeLinecap="round" />

                                {/* Ring Light */}
                                <ellipse cx="0" cy="-50" rx="19" ry="5" fill="none" stroke="#0ea5e9" strokeWidth="2" className="industrial-glow" />
                                <rect x="-5" y="-30" width="10" height="20" fill="#0f172a" />
                            </g>
                        ))}
                    </g>

                    {/* --- PIPELINE NETWORK (Connecting everything) --- */}
                    <g fill="none" stroke="#2563eb" strokeWidth="2" opacity="0.8">
                        <path d="M220,380 L380,300 L550,300" strokeDasharray="50 50" style={{ animation: 'flow-pipe 3s linear infinite' }} />
                        <path d="M440,360 L440,420 L600,340" strokeDasharray="30 30" style={{ animation: 'flow-pipe 4s linear infinite reverse' }} />
                    </g>

                    {/* --- FLOATING DRONES --- */}
                    <motion.circle
                        cx="300" cy="150" r="3" fill="#fff"
                        animate={{ x: [0, 100, 0], y: [0, 20, 0] }}
                        transition={{ duration: 10, repeat: Infinity }}
                        className="industrial-glow"
                    />
                    <motion.circle
                        cx="500" cy="100" r="2" fill="#22d3ee"
                        animate={{ x: [0, -50, 0], y: [0, 10, 0] }}
                        transition={{ duration: 8, repeat: Infinity, delay: 1 }}
                        className="industrial-glow"
                    />

                </svg>
            </div>

            {/* === LANDING PAGE EFFECT: HUD Overlay & Scanline === */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Vertical Scanline */}
                <div
                    className="absolute top-0 left-0 w-full h-[10%] bg-gradient-to-b from-blue-500/0 via-blue-500/10 to-blue-500/0"
                    style={{ animation: 'scan-vertical 6s linear infinite' }}
                />

                {/* HUD Corners */}
                <div className="absolute top-8 left-8 w-16 h-16 border-t border-l border-blue-500/30" />
                <div className="absolute bottom-8 right-8 w-16 h-16 border-b border-r border-blue-500/30" />

                {/* HUD Text elements */}
                <div className="absolute top-10 right-10 flex flex-col items-end gap-1 opacity-60">
                    <span className="text-[10px] font-mono text-blue-400 tracking-widest">SYSTEM_STATUS</span>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono text-gray-500">ONLINE</span>
                    </div>
                </div>

                {/* Vignette */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,12,16,0.8)_100%)]" />
            </div>
        </div>
    );
};

export default IsometricCityscape;

