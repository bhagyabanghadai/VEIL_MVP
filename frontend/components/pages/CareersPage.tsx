import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Cpu, Shield, Brain, Server, Users, ArrowRight, Hash } from 'lucide-react';
import { SecurityBackground } from '@/components/landing/SecurityBackground';

const CareersPage = () => {
    const roles = [
        {
            title: "Frontend Architect",
            id: "REQ-2026-FE",
            dept: "INTERFACE",
            icon: <Cpu className="w-5 h-5 text-cyan-400" />,
            location: "SF / REMOTE",
            responsibilities: [
                "Architecting cinematic UI/UX.",
                "60fps Animation Optimization.",
                "WebGL / Shader Implementation."
            ]
        },
        {
            title: "Security Specialist",
            id: "REQ-2026-SEC",
            dept: "PROTOCOL",
            icon: <Shield className="w-5 h-5 text-red-500" />,
            location: "SAN FRANCISCO",
            responsibilities: [
                "Threat Modeling & Red Teaming.",
                "Zero-Trust Architecture.",
                "Packet Inspection Logic."
            ]
        },
        {
            title: "AI Engineer",
            id: "REQ-2026-AI",
            dept: "INTELLIGENCE",
            icon: <Brain className="w-5 h-5 text-purple-500" />,
            location: "REMOTE",
            responsibilities: [
                "Agent Behavior Modeling.",
                "LLM Context Optimization.",
                "Inference Pipeline Scaling."
            ]
        },
        {
            title: "Systems Engineer",
            id: "REQ-2026-SYS",
            dept: "INFRASTRUCTURE",
            icon: <Server className="w-5 h-5 text-green-500" />,
            location: "SAN FRANCISCO",
            responsibilities: [
                "Distributed Ledger Ops.",
                "High-Throughput Messaging.",
                "Database Sharding."
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#e30613] selection:text-white font-sans overflow-x-hidden">
            <SecurityBackground />

            <div className="relative z-10 container mx-auto px-6 pt-40 pb-20">
                {/* HEADLINES */}
                <header className="text-center max-w-5xl mx-auto mb-24 space-y-6">
                    <div className="flex justify-center mb-6">
                        <div className="flex items-center gap-3 px-4 py-1.5 border border-white/10 bg-black/50 backdrop-blur rounded-full">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase">Recruitment Uplink Open</span>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-[-0.04em] uppercase leading-[0.85]">
                        INITIATE <span className="text-[#00f0ff]">SEQUENCE</span>
                    </h1>
                    <p className="text-xl text-white/40 leading-relaxed max-w-2xl mx-auto font-light border-y border-white/5 py-6">
                        We are assembling the Unit. <br />
                        Builders of the Immune System for the Agentic Web.
                    </p>
                </header>

                {/* DOSSIER GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                    {roles.map((role, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="group relative bg-[#050505] border border-white/10 hover:border-[#00f0ff]/50 transition-colors duration-500 overflow-hidden"
                        >
                            {/* Hover Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#00f0ff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Header Strip */}
                            <div className="flex justify-between items-center px-6 py-3 border-b border-white/10 bg-white/[0.02]">
                                <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">{role.id}</span>
                                <span className="font-mono text-[10px] text-[#00f0ff] tracking-widest uppercase">{role.dept}</span>
                            </div>

                            <div className="p-8 relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 bg-white/5 border border-white/10 rounded-sm">
                                        {role.icon}
                                    </div>
                                    <div className="text-right">
                                        <h3 className="text-2xl font-bold tracking-tight text-white group-hover:text-[#00f0ff] transition-colors">{role.title}</h3>
                                        <p className="text-[10px] font-mono text-white/40 tracking-widest mt-1 uppercase">{role.location}</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="h-px w-full bg-white/5" />
                                    {role.responsibilities.map((r, i) => (
                                        <div key={i} className="flex gap-3 text-sm text-white/60 group-hover:text-white/80 transition-colors">
                                            <span className="font-mono text-[#00f0ff]/50">0{i + 1}</span>
                                            <span>{r}</span>
                                        </div>
                                    ))}
                                </div>

                                <button className="w-full py-3 border border-white/10 hover:bg-[#00f0ff] hover:text-black hover:border-[#00f0ff] text-xs font-bold tracking-[0.2em] uppercase transition-all flex justify-between items-center px-6 group/btn">
                                    <span>Apply Protocol</span>
                                    <ArrowUpRight className="w-4 h-4 group-hover/btn:rotate-45 transition-transform" />
                                </button>
                            </div>

                            {/* Corner Decals */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white/10 group-hover:border-[#00f0ff]/50 transition-colors" />
                        </motion.div>
                    ))}
                </div>

                <div className="mt-24 text-center">
                    <a href="mailto:careers@veil.systems" className="inline-flex flex-col items-center gap-2 group opacity-50 hover:opacity-100 transition-opacity">
                        <Hash className="w-8 h-8 text-white/20 group-hover:text-[#00f0ff]" />
                        <span className="text-[10px] font-mono tracking-[0.3em] uppercase">Open General Uplink</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default CareersPage;
