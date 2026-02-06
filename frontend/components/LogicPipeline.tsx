
import React from 'react';
import { motion } from 'framer-motion';

const nodes = [
    { id: 'identity', label: 'IDENTITY_ISSUE', sub: 'DID:KEY:Z6M...', icon: 'ID' },
    { id: 'intercept', label: 'PACKET_INTERCEPT', sub: 'TCP/IP HOOK', icon: '⚡' },
    { id: 'reasoning', label: 'DEEP_REASONING', sub: 'GEMINI 1.5 PRO', icon: '🧠' },
    { id: 'decision', label: 'POLICY_ENGINE', sub: 'ALLOW / DENY', icon: '🛡️' },
    { id: 'ledger', label: 'IMMUTABLE_LOG', sub: 'MERKLE TREE', icon: '📜' },
];

const LogicPipeline: React.FC = () => {
    return (
        <div className="w-full py-32 px-4 relative overflow-hidden bg-[#030305]">

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-24 text-center">
                    <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">THE LOGIC PIPELINE</h2>
                    <p className="font-mono text-[#00f0ff] tracking-widest text-xs uppercase">Deterministic Execution Path</p>
                </div>

                {/* Circuit Graph Board */}
                <div className="relative border border-white/10 bg-white/5 p-10 md:p-20 rounded-xl backdrop-blur-sm">
                    {/* Background Circuit Lines */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none">
                        <svg className="w-full h-full" width="100%" height="100%">
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                            </pattern>
                            <rect width="100%" height="100%" fill="url(#grid)" />
                        </svg>
                    </div>

                    {/* Nodes Container */}
                    <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-10 md:gap-0">
                        {/* Main Connecting Line (Desktop) */}
                        <div className="absolute top-8 md:top-1/2 left-4 md:left-0 w-[2px] md:w-full h-full md:h-[2px] bg-white/10 md:-translate-y-1/2 -z-0"></div>

                        {/* Signal Pulse Animation */}
                        <motion.div
                            className="absolute top-8 md:top-1/2 left-4 md:left-0 w-[2px] md:w-full h-1/3 md:h-[2px] bg-gradient-to-b md:bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent z-0"
                            animate={{
                                left: ['-100%', '100%'],
                                top: ['0%', '0%'] // mostly for desktop horizontal
                            }}
                            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        />


                        {nodes.map((node, i) => (
                            <div key={node.id} className="relative z-10 group flex md:flex-col items-center gap-6 md:gap-4 w-full md:w-auto">
                                {/* Node Point */}
                                <div className="relative">
                                    <div className="w-16 h-16 bg-[#0a0a0a] border border-white/20 rounded-lg flex items-center justify-center text-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.2)] transition-all duration-300">
                                        {node.icon}
                                    </div>
                                    {/* Connector Dot */}
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#00f0ff] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </div>

                                {/* Labels */}
                                <div className="text-left md:text-center">
                                    <h4 className="font-bold text-white text-sm md:text-xs tracking-wider uppercase mb-1">{node.label}</h4>
                                    <span className="font-mono text-[10px] text-[#00f0ff] block bg-[#00f0ff]/10 px-2 py-1 rounded w-fit md:mx-auto border border-[#00f0ff]/20">
                                        {node.sub}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Footer */}
                <div className="mt-4 flex justify-between text-[10px] font-mono text-white/20 uppercase">
                    <span>Fig. 1.0 System Architecture</span>
                    <span>Sequence::Automated</span>
                </div>
            </div>
        </div>
    );
};

export default LogicPipeline;
