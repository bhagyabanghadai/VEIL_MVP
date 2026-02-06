import React, { useState, useEffect } from 'react';
import { Agent, TrustStatus, Policy } from '../types';

interface VeilIdentityCardProps {
    agent: Agent;
    trustStatus: TrustStatus;
    policies?: Policy[];
    onUpdateAgent?: (agent: Agent) => void;
    onDeleteAgent?: (id: string) => void;
}

const VeilIdentityCard: React.FC<VeilIdentityCardProps> = ({ agent, trustStatus, policies, onUpdateAgent, onDeleteAgent }) => {
    const [isPolicyMenuOpen, setIsPolicyMenuOpen] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({ name: agent.name, purpose: agent.purpose });

    // Reset form when agent changes
    useEffect(() => {
        setEditForm({ name: agent.name, purpose: agent.purpose });
        setIsEditing(false);
    }, [agent]);


    const togglePolicy = (policyId: string) => {
        if (!onUpdateAgent) return;
        const currentIds = agent.policyIds || [];
        const newIds = currentIds.includes(policyId)
            ? currentIds.filter(id => id !== policyId)
            : [...currentIds, policyId];
        onUpdateAgent({ ...agent, policyIds: newIds });
    };

    const handleSave = () => {
        if (onUpdateAgent) {
            onUpdateAgent({ ...agent, name: editForm.name, purpose: editForm.purpose });
            setIsEditing(false);
        }
    }

    const handleDelete = () => {
        if (onDeleteAgent) {
            if (confirm(`Are you sure you want to dissolve entity ${agent.name}? This cannot be undone.`)) {
                onDeleteAgent(agent.id);
            }
        }
    }

    const boundPolicyCount = agent.policyIds ? agent.policyIds.length : 0;

    return (
        <div className="relative glass-card bg-transparent border-0 p-0 group overflow-hidden transition-all duration-700">

            {/* Liquid Glow Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-radial from-[#00f0ff]/10 to-transparent blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"></div>

            <div className="flex flex-col lg:flex-row relative z-10">

                {/* Avatar / Profile Section */}
                <div className="p-12 shrink-0 flex flex-col items-center justify-center relative border-r border-white/5">
                    {/* Profile Picture / Initial - Ethereal Orb Style */}
                    <div className="relative w-40 h-40 flex items-center justify-center">
                        {/* Spinning Rings */}
                        <div className="absolute inset-0 border border-white/10 rounded-full animate-[spin_10s_linear_infinite]"></div>
                        <div className="absolute inset-2 border border-[#00f0ff]/20 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>

                        {/* Inner Glossy Core */}
                        <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-white/10 to-transparent backdrop-blur-md flex items-center justify-center shadow-[inset_0_0_20px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_30px_#00f0ff50] transition-all duration-500">
                            <span className="text-5xl font-light text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                                {agent.name.substring(0, 1).toUpperCase()}
                            </span>
                        </div>

                        {/* Status Indicator Dot */}
                        <div className={`absolute bottom-4 right-4 w-4 h-4 rounded-full border-2 border-black flex items-center justify-center shadow-[0_0_15px_currentColor] transition-colors duration-500 ${agent.riskLevel === 'high' ? 'bg-red-500 text-red-500' :
                            agent.riskLevel === 'medium' ? 'bg-orange-400 text-orange-400' :
                                'bg-emerald-400 text-emerald-400'
                            }`}></div>
                    </div>

                    <div className="mt-8 text-[10px] tracking-[0.3em] uppercase text-white/30 font-medium">Neural ID</div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-12 flex flex-col justify-between">

                    {/* Header Area */}
                    <div className="flex justify-between items-start mb-8">
                        <div className="space-y-2 flex-1 mr-8">
                            {isEditing ? (
                                <div className="space-y-4 animate-[fadeIn_0.3s_ease-out]">
                                    <input
                                        type="text"
                                        value={editForm.name}
                                        onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg text-white text-3xl font-light p-3 outline-none focus:border-[#00f0ff]/50"
                                    />
                                    <textarea
                                        rows={2}
                                        value={editForm.purpose}
                                        onChange={(e) => setEditForm({ ...editForm, purpose: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg text-white/70 text-sm p-3 outline-none focus:border-[#00f0ff]/50"
                                    />
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-5xl font-light text-transparent bg-clip-text bg-gradient-to-r from-white via-white/90 to-white/50 tracking-tight">{agent.name}</h1>
                                    <p className="text-lg text-white/50 font-light leading-relaxed">{agent.purpose}</p>
                                </>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                            {isEditing ? (
                                <>
                                    <button onClick={handleSave} className="px-4 py-2 bg-[#00f0ff]/20 text-[#00f0ff] rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#00f0ff]/30 transition-colors">Save Changes</button>
                                    <button onClick={() => setIsEditing(false)} className="px-4 py-2 bg-white/5 text-white/50 rounded-lg text-xs font-bold uppercase tracking-wider hover:text-white transition-colors">Cancel</button>
                                </>
                            ) : (
                                <>
                                    <button onClick={() => setIsEditing(true)} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all">
                                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                    </button>
                                    {onDeleteAgent && (
                                        <button onClick={handleDelete} className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all">
                                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Metrics Grid - Glass Tiles */}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Trust Tile */}
                        <div className={`p-4 rounded-2xl border backdrop-blur-sm transition-colors ${trustStatus === 'Compromised' ? 'bg-red-500/5 border-red-500/20' :
                            trustStatus === 'Under Watch' ? 'bg-orange-500/5 border-orange-500/20' :
                                'bg-[#00f0ff]/5 border-[#00f0ff]/20'
                            }`}>
                            <div className="text-[10px] uppercase tracking-widest opacity-60 mb-1">Status</div>
                            <div className={`text-sm font-semibold flex items-center gap-2 ${trustStatus === 'Compromised' ? 'text-red-400' :
                                trustStatus === 'Under Watch' ? 'text-orange-400' :
                                    'text-[#00f0ff]'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${trustStatus === 'Compromised' ? 'bg-red-500 animate-ping' : 'bg-current'}`}></span>
                                {trustStatus}
                            </div>
                        </div>

                        {/* Integrity Tile */}
                        <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-2">Integrity</div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-emerald-400 to-[#00f0ff]" style={{ width: `${100 - (agent.veilMeta?.misusePotential || 0)}%` }}></div>
                            </div>
                            <div className="mt-1 text-right text-[10px] text-white/50">{100 - (agent.veilMeta?.misusePotential || 0)}% Stable</div>
                        </div>

                        {/* Policies Tile */}
                        <div
                            onClick={() => setIsPolicyMenuOpen(true)}
                            className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/20 transition-all cursor-pointer group/tile relative overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/5 opacity-0 group-hover/tile:opacity-100 transition-opacity"></div>
                            <div className="text-[10px] uppercase tracking-widest text-white/40 mb-1">Governance</div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-white">{boundPolicyCount} Active Rules</span>
                                <svg className="w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Policy Drawer (Slide Over) */}
            <div className={`absolute top-0 right-0 h-full w-[350px] bg-black/80 backdrop-blur-2xl border-l border-white/10 z-20 transition-transform duration-500 transform ${isPolicyMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-8 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-light text-white">Security Policies</h3>
                        <button onClick={() => setIsPolicyMenuOpen(false)} className="text-white/40 hover:text-white transition-colors">
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                    </div>

                    <div className="space-y-3 overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        {policies && policies.map(p => (
                            <label key={p.id} className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-all group/item">
                                <div className="relative flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={!agent.policyIds || agent.policyIds.includes(p.id)}
                                        onChange={() => togglePolicy(p.id)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 rounded-full border border-white/30 peer-checked:bg-[#00f0ff] peer-checked:border-[#00f0ff] transition-all"></div>
                                    <svg className="w-3 h-3 text-black absolute left-1 top-1 opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <div className="flex-1">
                                    <div className="text-sm font-medium text-white/90 group-hover/item:text-white transition-colors">{p.name}</div>
                                    <div className="text-xs text-white/40 mt-1 line-clamp-2">{p.naturalLanguage}</div>
                                </div>
                            </label>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default VeilIdentityCard;
