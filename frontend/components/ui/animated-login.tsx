"use client";
import React, { useState, useRef, useEffect } from "react";
import {
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
    useTransform,
    AnimatePresence,
} from "framer-motion";
import { Lock, User, ArrowRight, ShieldCheck, Cpu, Globe, ScanFace } from "lucide-react";
import { SecurityBackground } from "@/components/landing/SecurityBackground";
import { Spotlight } from "@/components/ui/spotlight";

// --- UTILS ---
const ROTATION_RANGE = 20;
const HALF_ROTATION_RANGE = ROTATION_RANGE / 2;

// --- CYBER INPUT ---
const CyberInput = ({
    icon: Icon,
    type,
    placeholder,
    value,
    onChange,
    delay,
}: {
    icon: any;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    delay: number;
}) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.5 }}
            classNawe="relative group" // Corrected typo in logic below
            className="relative group mb-4"
        >
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500/50 group-focus-within:text-cyan-400 transition-colors z-10">
                <Icon size={18} />
            </div>
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                className="w-full bg-black/40 border border-cyan-900/30 rounded-lg py-4 pl-12 pr-4 text-cyan-100 placeholder-cyan-900/50 backdrop-blur-md focus:outline-none transition-all relative z-0"
            />

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-lg pointer-events-none overflow-hidden">
                <motion.div
                    className="absolute inset-0 border border-cyan-400/50 rounded-lg"
                    initial={false}
                    animate={{ opacity: isFocused ? 1 : 0, scale: isFocused ? 1 : 0.98 }}
                    transition={{ duration: 0.2 }}
                />
                {/* Glow Effect */}
                <motion.div
                    className="absolute -inset-[1px] bg-cyan-500/20 blur-md rounded-lg"
                    initial={false}
                    animate={{ opacity: isFocused ? 1 : 0 }}
                />
            </div>
        </motion.div>
    );
};

// --- TILT CARD ---
const TiltCard = ({ children }: { children: React.ReactNode }) => {
    const ref = useRef<HTMLDivElement>(null);

    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

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
            style={{
                transformStyle: "preserve-3d",
                transform,
            }}
            className="relative w-full max-w-md p-1 rounded-2xl bg-gradient-to-b from-cyan-500/20 to-purple-500/20 backdrop-blur-3xl"
        >
            {/* Inner Border/Glow Container */}
            <div
                className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10 blur-xl"
                style={{ transform: "translateZ(-50px)" }}
            />

            <div className="relative rounded-xl bg-black/80 border border-white/10 p-8 shadow-2xl overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none" />

                {/* Scanline */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,240,255,0.05)_50%)] bg-[size:100%_4px] pointer-events-none" />

                <div className="relative z-10 text-center" style={{ transform: "translateZ(20px)" }}>
                    {children}
                </div>
            </div>
        </motion.div>
    );
};

// --- MAIN COMPONENT ---
export const AnimatedLogin = ({ onLoginSuccess, onBack }: { onLoginSuccess: (token: string) => void; onBack?: () => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await new Promise((r) => setTimeout(r, 2000));
        setLoading(false);
        onLoginSuccess("holo-token");
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#030712] text-white perspective-[1000px]">

            {/* Background Layers */}
            <div className="fixed inset-0 z-0">
                <SecurityBackground />
                <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]" />
                <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" fill="cyan" />
            </div>

            {onBack && (
                <motion.button
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    onClick={onBack}
                    className="fixed top-8 left-8 z-50 flex items-center gap-2 text-xs font-mono text-cyan-500/60 hover:text-cyan-400 uppercase tracking-widest group"
                >
                    <ArrowRight className="rotate-180 group-hover:-translate-x-1 transition-transform" size={16} />
                    Abort Uplink
                </motion.button>
            )}

            {/* Main Content */}
            <div className="z-10 w-full flex justify-center p-4">
                <TiltCard>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: "circOut" }}
                        className="space-y-8"
                    >
                        {/* Header */}
                        <div className="space-y-2">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                                className="w-16 h-16 mx-auto rounded-2xl bg-cyan-900/20 border border-cyan-500/30 flex items-center justify-center relative overflow-hidden"
                            >
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-0 bg-gradient-to-tr from-cyan-500/20 to-transparent"
                                />
                                <ShieldCheck className="text-cyan-400" size={32} />
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-100 to-cyan-600"
                            >
                                SYSTEM BREACH
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="text-xs font-mono text-cyan-500/50 uppercase tracking-[0.2em]"
                            >
                                Authenticate Identity
                            </motion.p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <CyberInput
                                icon={User}
                                type="email"
                                placeholder="Neural Link ID"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                delay={0.6}
                            />
                            <CyberInput
                                icon={Lock}
                                type="password"
                                placeholder="Encryption Key"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                delay={0.7}
                            />

                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                disabled={loading}
                                className="w-full relative group overflow-hidden rounded-lg p-[1px] focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-black"
                            >
                                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00f0ff_0%,#000000_50%,#00f0ff_100%)] opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg bg-black px-8 py-3 text-sm font-medium text-cyan-100 backdrop-blur-3xl transition-colors group-hover:bg-cyan-900/20">
                                    {loading ? (
                                        <span className="flex items-center gap-2">
                                            <Cpu className="animate-spin" size={16} /> PROCESSING...
                                        </span>
                                    ) : (
                                        "INITIALIZE INTERFACE"
                                    )}
                                </span>
                            </motion.button>
                        </form>

                        {/* Footer Links */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="flex justify-center gap-6 pt-4 border-t border-white/5"
                        >
                            <button className="p-2 rounded-full hover:bg-white/5 text-cyan-500/40 hover:text-cyan-400 transition-colors">
                                <Globe size={18} />
                            </button>
                            <button className="p-2 rounded-full hover:bg-white/5 text-cyan-500/40 hover:text-cyan-400 transition-colors">
                                <ScanFace size={18} />
                            </button>
                        </motion.div>
                    </motion.div>
                </TiltCard>
            </div>

            <div className="fixed bottom-4 right-6 text-right z-50">
                <p className="text-[10px] font-mono text-cyan-900 uppercase">Secure Connection v9.0</p>
                <div className="flex gap-1 justify-end mt-1">
                    {[1, 2, 3].map(i => (
                        <motion.div
                            key={i}
                            animate={{ opacity: [0.2, 1, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                            className="w-1 h-1 rounded-full bg-cyan-500"
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
