import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
    Brain,
    ShieldCheck,
    Server,
    Zap,
    Activity,
    Lock,
    Globe,
    Cpu
} from 'lucide-react';

const BentoCard = ({
    children,
    className,
    title,
    subtitle,
    delay = 0
}: {
    children: React.ReactNode,
    className?: string,
    title?: string,
    subtitle?: string,
    delay?: number
}) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay }}
        viewport={{ once: true }}
        className={cn(
            "relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-xl border border-white/5 group",
            "hover:border-veil-trust/20 transition-colors duration-500",
            className
        )}
    >
        {/* Holographic Gradient Blob */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-veil-trust/5 rounded-full blur-3xl group-hover:bg-veil-trust/10 transition-colors duration-700 pointer-events-none" />

        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none" />

        <div className="relative z-10 p-6 flex flex-col h-full">
            {title && (
                <div className="mb-4">
                    <h3 className="text-white font-bold text-lg tracking-wide flex items-center gap-2">
                        {title}
                    </h3>
                    {subtitle && <p className="text-veil-text-muted text-xs font-mono tracking-wider uppercase mt-1">{subtitle}</p>}
                </div>
            )}
            <div className="flex-grow">
                {children}
            </div>
        </div>
    </motion.div>
);

const StatRow = ({ label, value }: { label: string, value: string }) => (
    <div className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
        <span className="text-veil-text-muted text-xs font-mono uppercase">{label}</span>
        <span className="text-white font-mono text-xs">{value}</span>
    </div>
);

export default function SystemCore() {
    return (
        <section className="relative w-full py-20 px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-6 lg:grid-cols-12 gap-4 h-full auto-rows-[minmax(180px,auto)]">

                {/* 1. CENTRAL INTELLIGENCE (Large Block) */}
                <BentoCard
                    className="md:col-span-6 lg:col-span-8 lg:row-span-2 bg-gradient-to-br from-black/60 to-black/20"
                    title="CORTEX KERNEL"
                    subtitle="Primary Intelligence Engine"
                    delay={0}
                >
                    <div className="flex flex-col justify-between h-full">
                        <div className="space-y-4 max-w-lg mt-4">
                            <p className="text-veil-text-secondary font-light leading-relaxed">
                                The central processing unit of the VEIL network. Orchestrates autonomous agents with metamorphic security policies and real-time threat adaptation.
                            </p>
                            <div className="flex gap-2">
                                <span className="px-3 py-1 rounded-full bg-veil-trust/10 border border-veil-trust/20 text-veil-trust text-xs font-mono">LLM Orchestration</span>
                                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/50 text-xs font-mono">RAG Pipeline</span>
                            </div>
                        </div>

                        {/* Fake Visualizer Area */}
                        <div className="mt-8 h-32 w-full rounded-xl bg-black/50 border border-white/5 relative overflow-hidden flex items-center justify-center">
                            <div className="absolute inset-0 bg-[url('/img/grid.svg')] opacity-20" />
                            <div className="flex items-center gap-4">
                                <div className="h-2 w-2 bg-veil-trust rounded-full animate-pulse" />
                                <span className="text-veil-trust font-mono text-xs animate-pulse">NEURAL_LINK_ESTABLISHED</span>
                            </div>
                        </div>
                    </div>
                </BentoCard>

                {/* 2. SECURITY STATUS (Medium Vertical) */}
                <BentoCard
                    className="md:col-span-3 lg:col-span-4 lg:row-span-2"
                    title="SECURITY MATRIX"
                    subtitle="Zero-Trust Architecture"
                    delay={0.1}
                >
                    <div className="space-y-4 mt-2">
                        <div className="relative h-32 w-full flex items-center justify-center">
                            <ShieldCheck className="h-20 w-20 text-veil-trust/20 absolute" />
                            <Lock className="h-10 w-10 text-white relative z-10" />
                            <div className="absolute inset-0 border border-veil-trust/10 rounded-full animate-[spin_10s_linear_infinite]" />
                        </div>
                        <div className="mt-4">
                            <StatRow label="Encryption" value="AES-256-GCM" />
                            <StatRow label="Identity" value="mTLS / OIDC" />
                            <StatRow label="Threat Level" value="NOMINAL" />
                        </div>
                    </div>
                </BentoCard>

                {/* 3. GLOBAL INFRASTRUCTURE (Small Horizontal) */}
                <BentoCard
                    className="md:col-span-3 lg:col-span-4"
                    title="GLOBAL MESH"
                    delay={0.2}
                >
                    <div className="flex items-center gap-4 mt-2">
                        <Globe className="h-8 w-8 text-veil-text-muted" />
                        <div>
                            <div className="text-2xl font-bold text-white font-mono">14ms</div>
                            <div className="text-xs text-veil-text-muted font-mono uppercase">Global Latency</div>
                        </div>
                    </div>
                </BentoCard>

                {/* 4. COMPUTE POWER (Small Horizontal) */}
                <BentoCard
                    className="md:col-span-3 lg:col-span-4"
                    title="COMPUTE"
                    delay={0.3}
                >
                    <div className="flex items-center gap-4 mt-2">
                        <Cpu className="h-8 w-8 text-veil-text-muted" />
                        <div>
                            <div className="text-2xl font-bold text-white font-mono">84.2 PFLOPs</div>
                            <div className="text-xs text-veil-text-muted font-mono uppercase">Available Capacity</div>
                        </div>
                    </div>
                </BentoCard>

                {/* 5. LIVE ACTIVITY (Wide Bottom) */}
                <BentoCard
                    className="md:col-span-6 lg:col-span-4"
                    title="LIVE FEED"
                    subtitle="System Events"
                    delay={0.4}
                >
                    <div className="space-y-3 mt-2 font-mono text-xs">
                        <div className="flex gap-2 text-veil-text-muted">
                            <span className="text-veil-trust">14:02:44</span>
                            <span>Agent [7734] sanctioned</span>
                        </div>
                        <div className="flex gap-2 text-veil-text-muted">
                            <span className="text-veil-trust">14:02:41</span>
                            <span>Vector index optimization verified</span>
                        </div>
                        <div className="flex gap-2 text-veil-text-muted">
                            <span className="text-veil-trust">14:02:12</span>
                            <span>New node joined: eu-west-3</span>
                        </div>
                    </div>
                </BentoCard>

            </div>
        </section>
    );
}
