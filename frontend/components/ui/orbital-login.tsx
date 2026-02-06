"use client";
import React, { useState, useEffect, useRef } from "react";
import {
    motion,
    useSpring,
    useMotionValue,
    useTransform,
    useMotionTemplate,
} from "framer-motion";
import { User, Lock, Command, ShieldAlert, Cpu, ScanLine } from "lucide-react";
import { SecurityBackground } from "@/components/landing/SecurityBackground";

// --- UTILS ---
const ROTATION_RANGE = 15;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

// --- ORBITAL RINGS ---
const OrbitalRings = () => {
    return (
        <div className="absolute inset-0 pointer-events-none z-0 flex items-center justify-center preserve-3d">
            {/* Ring 1 - Outer */}
            <motion.div
                className="absolute w-[600px] h-[600px] rounded-full border border-cyan-500/20 shadow-[0_0_50px_rgba(0,240,255,0.05)]"
                animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                <div className="absolute top-0 left-1/2 w-2 h-2 bg-cyan-500/50 rounded-full" />
            </motion.div>

            {/* Ring 2 - Middle */}
            <motion.div
                className="absolute w-[500px] h-[500px] rounded-full border border-purple-500/20"
                animate={{ rotateX: [360, 0], rotateZ: [0, 360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            />

            {/* Ring 3 - Inner Details */}
            <motion.div
                className="absolute w-[450px] h-[450px] rounded-full border-t border-b border-cyan-500/30"
                animate={{ rotateZ: [0, -360] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            />
        </div>
    );
};

// --- SCANNER BEAM ---
const ScannerBeam = () => {
    return (
        <motion.div
            className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
        >
            <motion.div
                className="w-full h-[2px] bg-cyan-400/50 shadow-[0_0_20px_#00f0ff]"
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                style={{ position: "absolute", left: 0 }}
            />
        </motion.div>
    );
};

// --- 3D TILT CONTAINER ---
const TiltContainer = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 400, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 400, damping: 30 });

    const transform = useMotionTemplate`rotateX(${xSpring}deg) rotateY(${ySpring}deg)`;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = (e.clientX - rect.left) * ROTATION_RANGE;
        const mouseY = (e.clientY - rect.top) * ROTATION_RANGE;
        const rX = (mouseY / height - HALF_ROTATION_RANGE) * -1;
        const rY = mouseX / width - HALF_ROTATION_RANGE;
        x.set(rX);
        y.set(rY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: "preserve-3d", transform }}
            className="relative z-10 w-full max-w-md"
        >
            {children}
        </motion.div>
    );
};

// --- ORBITAL LOGIN ---
export const OrbitalLogin = ({ onLoginSuccess, onBack }: { onLoginSuccess: (token: string) => void; onBack?: () => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Auto-focus logic simulation
    useEffect(() => {
        // Sound effect trigger could go here
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000)); // Simulate sophisticated auth check
        setLoading(false);
        onLoginSuccess("orbital-auth-token");
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#020408] text-white perspective-[1200px] selection:bg-cyan-500/30">

            {/* ENVIRONMENT */}
            <div className="fixed inset-0 z-0">
                <SecurityBackground />
                <div className="absolute inset-0 bg-black/80" />

                {/* Ambient Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-900/10 blur-[100px] rounded-full pointer-events-none" />
            </div>

            {/* BACK BUTTON */}
            {onBack && (
                <motion.button
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 }}
                    onClick={onBack}
                    className="fixed top-8 left-8 z-50 flex items-center gap-2 text-[10px] font-mono text-cyan-500/60 hover:text-cyan-400 uppercase tracking-widest border border-transparent hover:border-cyan-500/20 px-3 py-1 rounded-full transition-all"
                >
                    <Command size={14} /> System Exit
                </motion.button>
            )}

            {/* 3D SCENE */}
            <div className="relative flex items-center justify-center" style={{ transformStyle: "preserve-3d" }}>

                <OrbitalRings />

                <TiltContainer>
                    {/* GLASS CONSOLE */}
                    <div className="relative rounded-2xl bg-black/60 shadow-2xl backdrop-blur-xl border border-white/10 overflow-hidden group">

                        {/* Console Texture */}
                        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay pointer-events-none" />
                        <ScannerBeam />

                        <div className="relative p-10 space-y-8 z-10">

                            {/* HEADER */}
                            <div className="text-center space-y-2">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                    className="w-12 h-12 mx-auto bg-cyan-500/10 rounded-lg flex items-center justify-center border border-cyan-500/30"
                                >
                                    <ShieldAlert className="text-cyan-400" size={24} />
                                </motion.div>

                                <div className="space-y-1">
                                    <motion.h1
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="text-2xl font-bold font-display tracking-tight text-white"
                                    >
                                        VEIL <span className="text-cyan-400">PROTOCOL</span>
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-[10px] uppercase tracking-[0.2em] text-cyan-500/50 font-mono"
                                    >
                                        Secure Uplink Active
                                    </motion.p>
                                </div>
                            </div>

                            {/* FORM */}
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <div className="relative group">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                        <input
                                            type="email"
                                            placeholder="IDENTITY STRING"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            autoComplete="email"
                                            className="w-full bg-black/40 border border-white/10 rounded-md py-3 pl-10 pr-3 text-xs font-mono text-cyan-100 placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                                        />
                                    </div>
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-500/40 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                        <input
                                            type="password"
                                            placeholder="ENCRYPTION KEY"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                            autoComplete="current-password"
                                            className="w-full bg-black/40 border border-white/10 rounded-md py-3 pl-10 pr-3 text-xs font-mono text-cyan-100 placeholder-white/20 focus:outline-none focus:border-cyan-500/50 focus:bg-cyan-500/5 transition-all"
                                        />
                                    </div>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={loading}
                                    className="w-full py-4 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest rounded-md hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                    {loading ? (
                                        <>
                                            <Cpu className="animate-spin" size={14} /> AUTHENTICATING
                                        </>
                                    ) : (
                                        <>
                                            INITIALIZE <ScanLine size={14} />
                                        </>
                                    )}
                                </motion.button>
                            </form>
                        </div>

                        {/* Footer Status */}
                        <div className="bg-black/80 p-3 border-t border-white/5 flex justify-between items-center text-[9px] font-mono text-white/30 uppercase">
                            <span>Status: <span className="text-emerald-500">Normal</span></span>
                            <span>Encrypted: <span className="text-cyan-500">AES-256</span></span>
                        </div>

                    </div>
                </TiltContainer>
            </div>
        </div>
    );
};
