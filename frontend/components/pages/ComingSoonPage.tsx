
import React from 'react';
import { motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ArrowLeft, Cpu, Shield, Brain, Server } from 'lucide-react';
import { FallingPattern } from '@/components/ui/falling-pattern';
import VaporizeTextCycle from '@/components/ui/vapour-text-effect';

const ComingSoonPage = () => {
    const location = useLocation();

    // Determine context based on path, but fundamentally it's the same "Building the Team" message if it's careers
    const isCareers = location.pathname.includes('careers');
    const title = isCareers ? "JOIN THE UNIT" : "SYSTEM INITIALIZING";

    const roles = [
        {
            title: "Frontend Architect",
            icon: <Cpu className="w-6 h-6 text-cyan-400" />,
            responsibilities: [
                "Architecting high-performance, cinematic UIs.",
                "Ensuring pixel-perfect implementation of design systems.",
                "Optimizing for 60fps animations and zero-lag interactions."
            ]
        },
        {
            title: "Security Specialist",
            icon: <Shield className="w-6 h-6 text-red-500" />,
            responsibilities: [
                "Conducting rigorous threat modeling and vulnerability assessments.",
                "Implementing zero-trust architecture patterns.",
                "Securing all API endpoints and data pipelines."
            ]
        },
        {
            title: "AI Engineer",
            icon: <Brain className="w-6 h-6 text-purple-500" />,
            responsibilities: [
                "Developing autonomous agent behaviors.",
                "Integrating LLMs for predictive analysis.",
                "Optimizing neural network inference for real-time edge use."
            ]
        },
        {
            title: "Backend Engineer",
            icon: <Server className="w-6 h-6 text-green-500" />,
            responsibilities: [
                "Designing scalable, fault-tolerant distributed systems.",
                "Managing high-throughput event ledgers.",
                "Ensuring database integrity and ultra-low latency."
            ]
        }
    ];

    return (
        <div className="min-h-screen w-full bg-[#050505] text-white overflow-hidden relative font-sans selection:bg-cyan-500/30">
            {/* Background Effects */}
            <div className="absolute inset-0 z-0">
                <FallingPattern color="#ffffff" backgroundColor="transparent" duration={20} className="opacity-10" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black pointer-events-none z-0" />

            <div className="relative z-10 container mx-auto px-6 py-24 flex flex-col items-center justify-center min-h-screen">

                <Link to="/" className="absolute top-8 left-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors group">
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm tracking-widest font-mono">RETURN_HOME</span>
                </Link>

                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <div className="w-1 h-12 bg-gradient-to-b from-transparent via-cyan-500 to-transparent" />
                    </div>

                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter mb-6">
                        {title}
                    </h1>
                    <div className="h-8 mb-8">
                        <VaporizeTextCycle
                            texts={["AWAITING DEPLOYMENT", "BUILDING THE FUTURE", "SECURE THE FLEET"]}
                            font={{ fontSize: "14px", fontWeight: 500, fontFamily: "monospace" }}
                            color="rgba(255,255,255,0.5)"
                        />
                    </div>

                    <p className="max-w-xl mx-auto text-white/60 leading-relaxed">
                        This sector is currently under active development. <br />
                        We are assembling a precise, high-impact team to execute the vision.
                    </p>
                </div>

                {isCareers && (
                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6">
                        {roles.map((role, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 + 0.5 }}
                                className="bg-white/5 border border-white/10 p-8 rounded-lg hover:bg-white/10 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                                </div>

                                <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-black/50 rounded-md border border-white/10">
                                        {role.icon}
                                    </div>
                                    <h3 className="text-xl font-bold tracking-tight">{role.title}</h3>
                                </div>

                                <ul className="space-y-3">
                                    {role.responsibilities.map((resp, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                            <span className="mt-1.5 w-1 h-1 bg-white/30 rounded-full" />
                                            {resp}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ComingSoonPage;
