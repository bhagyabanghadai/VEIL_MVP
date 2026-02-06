import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight, Terminal, Activity } from 'lucide-react';
import { SecurityBackground } from '@/components/landing/SecurityBackground';

const PricingPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e30613] selection:text-white font-sans overflow-x-hidden">
            <SecurityBackground />

            <div className="relative z-10 container mx-auto px-6 pt-40 pb-20">
                {/* TERMINAL HEADER */}
                <header className="text-center max-w-4xl mx-auto mb-24 space-y-8 relative">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 bg-gradient-to-b from-white/20 to-transparent -translate-y-24" />

                    <div className="inline-flex items-center gap-4 px-4 py-2 rounded-sm border-x border-white/10 bg-black/40 backdrop-blur-md">
                        <Activity className="w-4 h-4 text-[#e30613] animate-pulse" />
                        <span className="text-[10px] font-mono tracking-[0.3em] text-white/50 uppercase">Protocol Access Level</span>
                        <span className="text-[10px] font-mono text-[#e30613]">SELECT_MODE</span>
                    </div>

                    <h1 className="text-7xl md:text-9xl font-black tracking-[-0.04em] uppercase leading-[0.85] relative z-10 mix-blend-difference">
                        SECURE <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">THE FLEET</span>
                    </h1>

                    <p className="text-xl text-white/50 leading-relaxed max-w-2xl mx-auto font-light border-l border-r border-white/10 py-4">
                        Deterministic control for your autonomous agent fleet. <br />
                        <span className="text-[#00f0ff] font-mono text-sm tracking-widest uppercase">Encryption: AES-256 // Latency: &lt;5ms</span>
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto perspective-1000">
                    {/* TIER 1: INDIE */}
                    <PricingCard
                        tier="Inception"
                        price="$0"
                        period="/ MO"
                        description="Sandbox environment for individual researchers."
                        features={[
                            "3 Active Agents",
                            "Basic Policy Engine",
                            "7-Day Log Retention",
                            "Community Support"
                        ]}
                        buttonText="Initialize"
                        delay={0}
                        color="text-white"
                        borderColor="border-white/10"
                    />

                    {/* TIER 2: PRO */}
                    <PricingCard
                        tier="Scale"
                        price="$299"
                        period="/ MO"
                        description="Production-grade control for agent teams."
                        features={[
                            "20 Active Agents",
                            "Regex & Code Policy",
                            "30-Day Log Retention",
                            "Identity Bridge (OAuth)",
                            "SOC2 Compliance",
                            "Priority Uplink"
                        ]}
                        buttonText="Deploy Scale"
                        highlighted={true}
                        delay={0.1}
                        color="text-[#00f0ff]"
                        borderColor="border-[#00f0ff]/50"
                    />

                    {/* TIER 3: ENTERPRISE */}
                    <PricingCard
                        tier="Sovereign"
                        price="CUSTOM"
                        period=""
                        description="Full isolation and on-premise governance."
                        features={[
                            "Unlimited Fleet Size",
                            "Custom LLM Policy",
                            "Cold Storage Ledger",
                            "VPC / On-Premise",
                            "Dedicated Handler",
                            "24/7 Incident Ops"
                        ]}
                        buttonText="Contact Command"
                        delay={0.2}
                        color="text-[#e30613]"
                        borderColor="border-[#e30613]/50"
                    />
                </div>

                {/* SYSTEM STATS FOOTER */}
                <div className="mt-32 border-t border-white/10 pt-8 flex justify-between items-end opacity-50 font-mono text-[10px] uppercase tracking-widest">
                    <div>
                        <div>System Status: Nominal</div>
                        <div>Block Rate: 99.9%</div>
                    </div>
                    <div className="text-right">
                        <div>Secure Connection</div>
                        <div>Encrypted</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const PricingCard = ({ tier, price, period, description, features, buttonText, highlighted = false, delay, color, borderColor }: any) => {
    return (
        <motion.div
            initial={{ opacity: 0, rotateX: 10, y: 50 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ delay, duration: 0.8, ease: "easeOut" }}
            className={`
                relative flex flex-col h-full overflow-hidden group
                bg-[#050505] border ${highlighted ? borderColor : 'border-white/10'}
                hover:border-opacity-100 transition-all duration-500
            `}
        >
            {/* CRT Scanline Overlay */}
            <div className="absolute inset-0 pointer-events-none z-0 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px]" />
            <div className={`absolute inset-0 z-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-${color.split('-')[1]}-500`} />

            {/* Top Status Bar */}
            <div className="flex justify-between items-center px-6 py-3 border-b border-white/5 bg-white/[0.02]">
                <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${highlighted ? 'bg-[#00f0ff] animate-pulse' : 'bg-white/20'}`} />
                    <span className={`text-[9px] font-mono tracking-widest uppercase ${color}`}>{tier}_PROTOCOL</span>
                </div>
                <Terminal className="w-3 h-3 text-white/20" />
            </div>

            <div className="p-8 relative z-10 flex-1 flex flex-col">
                <div className="mb-8">
                    <div className="flex items-baseline gap-1">
                        <span className={`text-6xl font-black tracking-tighter ${color}`}>{price}</span>
                        <span className="text-sm text-white/40 font-mono">{period}</span>
                    </div>
                    <p className="mt-4 text-sm text-white/50 leading-relaxed font-mono border-l-2 border-white/10 pl-4 h-12">
                        {description}
                    </p>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                    {features.map((feature: string, i: number) => (
                        <div key={i} className="flex items-start gap-3 text-sm text-white/70 group/item">
                            <Check className={`w-4 h-4 mt-0.5 shrink-0 ${highlighted ? 'text-[#00f0ff]' : 'text-white/30'} group-hover/item:text-white transition-colors`} />
                            <span className="group-hover/item:text-white transition-colors tracking-wide">{feature}</span>
                        </div>
                    ))}
                </div>

                <button className={`
                    w-full py-4 text-xs font-black tracking-[0.2em] uppercase flex items-center justify-center gap-3 group/btn relative overflow-hidden
                    ${highlighted ? 'bg-[#00f0ff] text-black' : 'bg-white/5 text-white border border-white/10 hover:bg-white/10'}
                `}>
                    <span className="relative z-10 flex items-center gap-2">
                        {buttonText} <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    </span>
                    {highlighted && (
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                    )}
                </button>
            </div>

            {/* Bottom Data Line */}
            <div className={`h-1 w-full bg-gradient-to-r from-transparent via-${color.split('-')[1] || 'white'}-500/20 to-transparent`} />
        </motion.div>
    );
}

export default PricingPage;
