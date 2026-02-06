import React from 'react';
import { motion } from 'framer-motion';

const ProtocolPage: React.FC = () => {
    return (
        <div className="min-h-screen text-white pt-32 pb-20 px-6 max-w-5xl mx-auto space-y-24">

            {/* Hero Section */}
            <section className="space-y-6 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-veil-audit/30 bg-veil-audit/5 text-veil-audit text-[10px] uppercase tracking-widest font-mono mb-4">
                    <div className="w-1.5 h-1.5 rounded-full bg-veil-audit animate-pulse"></div>
                    Core Methodology
                </div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tighter">
                    The <span className="text-[#00f0ff]">Veil</span> Protocol
                </h1>
                <p className="text-xl text-veil-text-secondary max-w-2xl mx-auto font-light leading-relaxed">
                    A decentralized verification layer for autonomous agent identity and behavior enforcement.
                </p>
            </section>

            {/* Core Pillars */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { title: "Identity", icon: "ID", desc: "Cryptographic passports for every agent instance.", color: "text-[#00f0ff]" },
                    { title: "Policy", icon: "PL", desc: "Natural language constraints compiled to determinstic rules.", color: "text-[#bd00ff]" },
                    { title: "Audit", icon: "AU", desc: "Immutable ledger of every decision and action.", color: "text-veil-audit" }
                ].map((item, i) => (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={i}
                        className="p-8 border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group relative overflow-hidden"
                    >
                        <div className={`text-4xl font-mono font-black opacity-20 mb-8 ${item.color}`}>{item.icon}</div>
                        <h3 className="text-xl font-bold mb-4">{item.title}</h3>
                        <p className="text-veil-text-secondary text-sm leading-relaxed">{item.desc}</p>
                        <div className={`absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity ${item.color}`}>
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                        </div>
                    </motion.div>
                ))}
            </section>

            {/* Deep Dive Text */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center border-t border-white/5 pt-24">
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold text-white">Deterministic Control in a Probabilistic World</h2>
                    <div className="space-y-4 text-veil-text-secondary leading-relaxed">
                        <p>
                            Large Language Models are probabilistic engines. They cannot be trusted to follow negative constraints ("Do not do X") with 100% reliability.
                        </p>
                        <p>
                            Veil inserts a deterministic control plane between the model and the world. By wrapping agent actions in a cryptographic envelope, we ensure that every tool call, API request, and database query is validated against a rigorous policy set before execution.
                        </p>
                    </div>
                </div>
                <div className="relative h-[400px] border border-white/10 bg-black/50 p-1">
                    {/* Diagram Placeholder - Abstract Representation */}
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_25%,rgba(255,255,255,0.02)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.02)_75%,rgba(255,255,255,0.02)_100%)] bg-[size:20px_20px]"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 border border-[#00f0ff] rounded-full flex items-center justify-center animate-pulse">
                            <div className="text-[#00f0ff] font-mono text-xs">KERNEL</div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default ProtocolPage;
