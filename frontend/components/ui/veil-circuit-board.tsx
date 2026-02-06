"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * VeilCircuitBoard - A stunning animated cyberpunk motherboard visualization
 * Features pulsating CPU, data flowing through traces, and active security nodes
 */
export const VeilCircuitBoard: React.FC = () => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div className="relative w-full h-full overflow-hidden bg-[#050608]">
            {/* Animated styles for raw CSS performance */}
            <style>{`
        @keyframes pulse-core {
          0%, 100% { opacity: 0.8; filter: drop-shadow(0 0 10px rgba(59, 130, 246, 0.4)); }
          50% { opacity: 1; filter: drop-shadow(0 0 25px rgba(59, 130, 246, 0.6)); }
        }
        @keyframes flow-h {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes flow-v {
          0% { stroke-dashoffset: 100; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes blink-random {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; box-shadow: 0 0 5px currentColor; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes scan-line {
          0% { top: -10%; opacity: 0; }
          50% { opacity: 0.5; }
          100% { top: 110%; opacity: 0; }
        }
      `}</style>

            {/* Base texture overlay */}
            <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: `
            linear-gradient(rgba(15, 23, 42, 0.5) 2px, transparent 2px),
            linear-gradient(90deg, rgba(15, 23, 42, 0.5) 2px, transparent 2px)
          `,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '-1px -1px'
                }}
            />

            <div className="absolute inset-0 flex items-center justify-center">
                <svg
                    viewBox="0 0 800 600"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                >
                    <defs>
                        <linearGradient id="traceGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#1e3a8a" stopOpacity="0.2" />
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.2" />
                        </linearGradient>

                        <linearGradient id="coreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#1e293b" />
                            <stop offset="100%" stopColor="#0f172a" />
                        </linearGradient>

                        <filter id="glow">
                            <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
                            <feMerge>
                                <feMergeNode in="coloredBlur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        <pattern id="pcbPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                            <path d="M 0 10 L 10 0 M 10 20 L 20 10" stroke="#1e293b" strokeWidth="0.5" fill="none" />
                        </pattern>
                    </defs>

                    {/* ===== BACKGROUND PCB TEXTURE ===== */}
                    <rect width="100%" height="100%" fill="#050608" />
                    <rect width="100%" height="100%" fill="url(#pcbPattern)" opacity="0.3" />

                    {/* ===== CIRCUIT TRACES (STATIC & ANIMATED) ===== */}
                    <g strokeWidth="2" strokeLinecap="square" fill="none">
                        {/* Top Left Traces */}
                        <path d="M-50,100 L200,100 L250,150 L350,150" stroke="#1e293b" strokeWidth="4" />
                        <path d="M-50,120 L190,120 L240,170 L350,170" stroke="#1e293b" strokeWidth="4" />
                        <path d="M-50,100 L200,100 L250,150 L350,150" stroke="url(#traceGrad)" strokeDasharray="200 600" style={{ animation: 'flow-h 3s linear infinite' }} />

                        {/* Bottom Right Traces */}
                        <path d="M850,500 L600,500 L550,450 L450,450" stroke="#1e293b" strokeWidth="4" />
                        <path d="M850,480 L610,480 L560,430 L450,430" stroke="#1e293b" strokeWidth="4" />
                        <path d="M850,500 L600,500 L550,450 L450,450" stroke="url(#traceGrad)" strokeDasharray="150 400" strokeDashoffset="400" style={{ animation: 'flow-h 4s linear infinite reverse' }} />

                        {/* Vertical Data Bus */}
                        <path d="M400,0 L400,200" stroke="#1e293b" strokeWidth="6" />
                        <path d="M400,400 L400,600" stroke="#1e293b" strokeWidth="6" />
                        <path d="M400,0 L400,200" stroke="#3b82f6" strokeWidth="2" strokeDasharray="50 150" style={{ animation: 'flow-v 2s linear infinite' }} opacity="0.6" />

                        {/* Complex Connection Nodes */}
                        <circle cx="200" cy="100" r="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                        <circle cx="600" cy="500" r="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1" />
                    </g>

                    {/* ===== MEMORY BANKS (RAM) ===== */}
                    <g transform="translate(100, 350)">
                        {[0, 1, 2, 3].map((i) => (
                            <g key={i} transform={`translate(${i * 40}, 0)`}>
                                {/* Slot */}
                                <rect x="0" y="0" width="30" height="120" rx="2" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                                {/* Contacts */}
                                <rect x="5" y="110" width="4" height="6" fill="#ca8a04" />
                                <rect x="13" y="110" width="4" height="6" fill="#ca8a04" />
                                <rect x="21" y="110" width="4" height="6" fill="#ca8a04" />
                                {/* Active Status Light */}
                                <circle cx="15" cy="15" r="3" fill="#3b82f6" style={{ animation: `blink-random ${2 + i * 0.5}s infinite` }} className="drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]" />
                            </g>
                        ))}
                    </g>

                    {/* ===== SECURITY NODES (SHIELDS) ===== */}
                    <g transform="translate(600, 150)">
                        <path d="M30,0 L60,15 L60,45 L30,60 L0,45 L0,15 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                        <path d="M30,15 L45,22.5 L45,37.5 L30,45 L15,37.5 L15,22.5 Z" fill="#1e293b" />
                        <circle cx="30" cy="30" r="5" fill="#22c55e" style={{ animation: 'blink-random 3s infinite' }} filter="url(#glow)" />
                    </g>

                    <g transform="translate(680, 250)">
                        <path d="M25,0 L50,12.5 L50,37.5 L25,50 L0,37.5 L0,12.5 Z" fill="#0f172a" stroke="#334155" strokeWidth="2" />
                        <circle cx="25" cy="25" r="4" fill="#3b82f6" style={{ animation: 'blink-random 4s infinite 1s' }} filter="url(#glow)" />
                    </g>

                    {/* ===== CENTRAL PROCESSING UNIT (VEIL CORE) ===== */}
                    <g transform="translate(400, 300)">
                        <motion.g
                            initial={{ scale: 0.95 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                        >
                            {/* Outer Housing */}
                            <rect x="-100" y="-100" width="200" height="200" rx="10" fill="url(#coreGrad)" stroke="#334155" strokeWidth="3" />

                            {/* Corner screws */}
                            <circle cx="-90" cy="-90" r="5" fill="#475569" />
                            <circle cx="90" cy="-90" r="5" fill="#475569" />
                            <circle cx="-90" cy="90" r="5" fill="#475569" />
                            <circle cx="90" cy="90" r="5" fill="#475569" />

                            {/* Inner Heatsink Detail */}
                            <rect x="-80" y="-80" width="160" height="160" rx="4" fill="#020617" stroke="#334155" strokeDasharray="4 4" />

                            {/* Central Core Glow */}
                            <circle cx="0" cy="0" r="50" fill="none" stroke="#3b82f6" strokeWidth="2" opacity="0.3" />
                            <circle cx="0" cy="0" r="40" fill="none" stroke="#3b82f6" strokeWidth="1" opacity="0.5" strokeDasharray="20 10" style={{ animation: 'spin-slow 10s linear infinite' }} />

                            {/* Logo / Text */}
                            <text x="0" y="-10" textAnchor="middle" fill="#fff" fontFamily="monospace" fontSize="24" fontWeight="bold" letterSpacing="4">VEIL</text>
                            <text x="0" y="20" textAnchor="middle" fill="#3b82f6" fontFamily="monospace" fontSize="12" letterSpacing="2">SECURITY CORE</text>
                            <text x="0" y="40" textAnchor="middle" fill="#64748b" fontFamily="monospace" fontSize="10">v9.2.0 • ACTIVE</text>

                            {/* Pulse Effect Overlay */}
                            <circle cx="0" cy="0" r="60" fill="transparent" stroke="#3b82f6" strokeWidth="2" style={{ animation: 'pulse-core 3s ease-in-out infinite' }} />
                        </motion.g>
                    </g>

                    {/* ===== DATA PACKETS (particles) ===== */}
                    {[...Array(6)].map((_, i) => (
                        <circle key={i} r="2" fill="#fff">
                            <animateMotion
                                dur={`${2 + i}s`}
                                repeatCount="indefinite"
                                path={`M ${Math.random() * 800} ${Math.random() * 600} L 400 300`}
                            />
                        </circle>
                    ))}

                    {/* ===== COOLING FAN (Stylized) ===== */}
                    <g transform="translate(150, 500)" opacity="0.8">
                        <circle cx="0" cy="0" r="45" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
                        <g style={{ animation: 'spin-slow 2s linear infinite' }}>
                            <path d="M0,-40 L10,-10 L40,0 L10,10 L0,40 L-10,10 L-40,0 L-10,-10 Z" fill="#1e293b" />
                            <circle cx="0" cy="0" r="10" fill="#334155" />
                        </g>
                    </g>

                </svg>
            </div>

            {/* CRT Scanline Overlay for retro-tech feel */}
            <div
                className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent h-[20%] pointer-events-none"
                style={{ animation: 'scan-line 4s linear infinite' }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,6,8,0.8)_80%)] pointer-events-none" />
        </div>
    );
};

export default VeilCircuitBoard;
