import React from 'react';
import { Agent } from '../../types';
import { createAvatar } from '@dicebear/core';
import { lorelei } from '@dicebear/collection';

// Generate avatar URL helper (reused logic)
const getAvatarUrl = (seed: string) => {
    return createAvatar(lorelei, {
        seed,
        backgroundColor: ["transparent"],
    }).toDataUri();
};

interface AgentHologramProps {
    agent: Agent;
    trustStatus: string;
    onUpdate?: (agent: Agent) => void;
    onDelete?: (id: string) => void;
}

const AgentHologram: React.FC<AgentHologramProps> = ({ agent, trustStatus }) => {
    const avatarUrl = getAvatarUrl(agent.name);

    // Calculate color based on trust
    const statusColor =
        trustStatus === 'Trusted' ? '#00f0ff' :
            trustStatus === 'Probation' ? '#fbbf24' : '#ef4444';

    return (
        <div className="relative w-full h-full group perspective-1000">
            {/* Holographic Container */}
            <div className="relative w-full bg-[#030712]/80 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all duration-500 hover:border-[#00f0ff]/30 hover:shadow-[0_0_30px_rgba(0,240,255,0.1)]">

                {/* Header Strip */}
                <div className="h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50" />

                <div className="p-8 flex items-start gap-8">
                    {/* Avatar / Identity Projection */}
                    <div className="relative shrink-0">
                        <div className="w-32 h-32 rounded-lg border border-white/10 bg-black/40 flex items-center justify-center relative overflow-hidden group-hover:border-[#00f0ff]/40 transition-colors">
                            <img src={avatarUrl} alt={agent.name} className="w-28 h-28 object-cover filter brightness-90 contrast-125 drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />

                            {/* Scanning Line Effect */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00f0ff]/10 to-transparent w-full h-[20%] animate-scan pointer-events-none" />
                        </div>

                        {/* Status Badge */}
                        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-black border border-white/20 px-3 py-1 rounded-sm flex items-center gap-2 shadow-lg whitespace-nowrap">
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: statusColor }} />
                            <span className="text-[10px] font-mono uppercase tracking-widest text-white">{trustStatus}</span>
                        </div>
                    </div>

                    {/* Agent Details */}
                    <div className="flex-1 space-y-6">
                        <div>
                            <h2 className="text-3xl font-black text-white italic tracking-tighter mb-1">{agent.name}</h2>
                            <div className="flex items-center gap-3 text-white/40 font-mono text-xs">
                                <span>ID: {agent.id.substring(0, 8)}...</span>
                                <span>•</span>
                                <span>v1.0.0</span>
                            </div>
                        </div>

                        {/* Capabilities Grid */}
                        <div className="grid grid-cols-2 gap-3">
                            {(agent.allowedCapabilities || []).map((cap, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 rounded px-3 py-2 text-xs text-white/70 font-mono flex items-center justify-between group/cap hover:bg-white/10 transition-colors">
                                    <span>{cap}</span>
                                    <div className="w-1 h-1 bg-white/20 rounded-full group-hover/cap:bg-[#00f0ff] transition-colors" />
                                </div>
                            ))}
                        </div>

                        {/* Metadata Footer */}
                        <div className="border-t border-white/5 pt-4 flex gap-8">
                            <div>
                                <span className="block text-[9px] text-white/30 uppercase tracking-widest font-mono mb-1">Created</span>
                                <span className="text-white/80 text-sm font-sans">
                                    {(agent.createdAt ? new Date(agent.createdAt) : new Date()).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className="block text-[9px] text-white/30 uppercase tracking-widest font-mono mb-1">Origin</span>
                                <span className="text-white/80 text-sm font-sans">
                                    Local
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Corners */}
                <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
                <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
                <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
                <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

                {/* Background Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
            </div>
        </div>
    );
};

export default AgentHologram;
