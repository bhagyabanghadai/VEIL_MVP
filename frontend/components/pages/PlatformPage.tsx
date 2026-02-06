import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Shield, Lock, FileJson, Activity, Network, Fingerprint, ArrowRight, Database, Key } from 'lucide-react';
import { SecurityBackground } from '@/components/landing/SecurityBackground';

const PlatformPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e30613] selection:text-white font-sans overflow-x-hidden">
            <SecurityBackground />

            <div className="relative z-10 container mx-auto px-6 pt-32 pb-40 space-y-32">
                {/* HERO */}
                <header className="text-center space-y-8 max-w-5xl mx-auto pt-20 perspective-1000">
                    <motion.div
                        initial={{ rotateX: 20, opacity: 0 }}
                        animate={{ rotateX: 0, opacity: 1 }}
                        transition={{ duration: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-sm border border-white/10 bg-black/60 backdrop-blur-md mb-8"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff] animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/60">System Architecture v2.4</span>
                    </motion.div>

                    <h1 className="text-6xl md:text-9xl font-black tracking-[-0.04em] uppercase leading-[0.85] mix-blend-screen">
                        VEIL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] via-cyan-400 to-[#00f0ff]">PROTOCOL</span>
                    </h1>

                    <div className="flex flex-col md:flex-row items-stretch justify-center gap-8 mt-16 max-w-4xl mx-auto">
                        <StatBlock label="Latency" value="< 5ms" />
                        <div className="w-px bg-white/10 hidden md:block" />
                        <StatBlock label="Encryption" value="AES-256" />
                        <div className="w-px bg-white/10 hidden md:block" />
                        <StatBlock label="Compliance" value="SOC2 Type I" />
                    </div>
                </header>

                {/* 1. NEURAL FIREWALL */}
                <ProductSection
                    id="neural-firewall"
                    title="Neural Firewall"
                    subtitle="Layer 7 Validation"
                    description="Intercepts every tool call and LLM output. Runs a deterministic semantic policy engine to prevent halogenation and Unauthorized actions before they affect the real world."
                    icon={<Shield className="w-12 h-12 text-[#00f0ff]" />}
                    features={[
                        { title: "Semantic Analysis", desc: "Real-time intent verification." },
                        { title: "Payload Inspection", desc: "Deep packet inspection for JSON/XML." },
                        { title: "PII Redaction", desc: "On-the-fly data masking." }
                    ]}
                    color="#00f0ff"
                    align="right"
                    index={0}
                />

                {/* 2. IDENTITY BRIDGE */}
                <ProductSection
                    id="identity-bridge"
                    title="Identity Bridge"
                    subtitle="Cryptographic Auth"
                    description="Issues ephemeral, verifiable credentials to autonomous agents. Every action is cryptographically signed, creating a verifiable chain of custody without exposing root secrets."
                    icon={<Key className="w-12 h-12 text-[#bd00ff]" />}
                    features={[
                        { title: "Key Rotation", desc: "Automated hourly key rolling." },
                        { title: "Zero Trust Mesh", desc: "mTLS between all agent nodes." },
                        { title: "Scoped RBAC", desc: "Action-specific permission grants." }
                    ]}
                    color="#bd00ff"
                    align="left"
                    index={1}
                />

                {/* 3. AUDIT LEDGER */}
                <ProductSection
                    id="audit-ledger"
                    title="Audit Ledger"
                    subtitle="Immutable Chain"
                    description="Records the full causal chain: Prompt -> Thought -> Action -> Result. Stored on a tamper-evident append-only log, providing perfect replayability for compliance teams."
                    icon={<Database className="w-12 h-12 text-emerald-500" />}
                    features={[
                        { title: "Time-Travel Debug", desc: "Step-by-step agent replay." },
                        { title: "Compliance Export", desc: "One-click audit reports." },
                        { title: "Anomaly Heuristics", desc: "Pattern-based threat detection." }
                    ]}
                    color="#10b981"
                    align="right"
                    index={2}
                />
            </div>
        </div>
    );
};

const StatBlock = ({ label, value }: { label: string, value: string }) => (
    <div className="px-8 text-center">
        <div className="text-3xl font-bold text-white tracking-tighter mb-1">{value}</div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-white/30">{label}</div>
    </div>
);

const ProductSection = ({ id, title, subtitle, description, icon, features, color, align, index }: any) => {
    return (
        <motion.section
            id={id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ margin: "-20%" }}
            transition={{ duration: 0.8 }}
            className={`flex flex-col ${align === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-20 items-center scroll-mt-32 relative py-20 border-t border-white/5`}
        >
            {/* Visual Side */}
            <div className="flex-1 w-full relative">
                <div className="relative aspect-square md:aspect-video bg-black/40 border border-white/10 overflow-hidden group">
                    {/* Decorative Grid */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px]" />

                    {/* Glow Accent */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/5 blur-[80px] group-hover:bg-[#00f0ff]/20 transition-colors duration-700" style={{ backgroundColor: `${color}20` }} />

                    {/* Center Icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="p-8 bg-black/80 border border-white/10 backdrop-blur-md relative">
                            {/* Corner brackets */}
                            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/50" />
                            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/50" />
                            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/50" />
                            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/50" />

                            {icon}
                        </div>
                    </div>

                    {/* Scanning Line */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-transparent h-1"
                        animate={{ top: ['0%', '100%'] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            </div>

            {/* Content Side */}
            <div className="flex-1 space-y-10">
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <span className="font-mono text-xs text-white/30">0{index + 1} //</span>
                        <h3 className="text-xs font-mono font-bold uppercase tracking-[0.3em]" style={{ color }}>{subtitle}</h3>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-[0.9] text-white my-6">
                        {title.split(' ')[0]} <br /> <span className="text-white/40">{title.split(' ')[1]}</span>
                    </h2>
                </div>

                <p className="text-lg text-white/60 leading-relaxed font-light pl-6 border-lborder-white/10" style={{ borderLeftColor: color }}>
                    {description}
                </p>

                <div className="space-y-4 pt-4">
                    {features.map((f: any, i: number) => (
                        <div key={i} className="group/item flex items-center justify-between border-b border-white/5 pb-4 hover:border-white/20 transition-colors">
                            <span className="text-sm font-bold text-white tracking-wide">{f.title}</span>
                            <span className="text-xs font-mono text-white/40 group-hover/item:text-white/70 transition-colors">{f.desc}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
};

export default PlatformPage;
