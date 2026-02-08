import React, { useState } from 'react';
import { Agent } from '../../types';
import AgentHologram from '../dashboard/AgentHologram';
import { Plus, Search, Shield, Cpu, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import ConfirmationModal from '../ui/confirmation-modal';

interface AgentsPageProps {
    agents: Agent[];
    onUpdateAgent: (agent: Agent) => void;
    onDeleteAgent: (id: string) => void;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ agents, onUpdateAgent, onDeleteAgent }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

    const filteredAgents = agents.filter(agent =>
        agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        agent.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const selectedAgent = agents.find(a => a.id === selectedAgentId);

    return (
        <div className="flex flex-col gap-8 h-full">
            {/* ... header ... */}
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                        Identity <span className="text-[#00f0ff]">Matrix</span>.
                    </h1>
                    <p className="text-white/50 font-mono text-sm">
                        Manage registered neural entities and security clearances.
                    </p>
                </div>
                <Link
                    to="/register"
                    className="flex items-center gap-2 px-6 py-3 bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/50 rounded-lg hover:bg-[#00f0ff]/20 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all uppercase font-bold tracking-wider text-sm"
                >
                    <Plus size={16} />
                    <span>Initialize New Agent</span>
                </Link>
            </div>

            <div className="grid grid-cols-12 gap-8 flex-1 min-h-0">
                {/* Left Col: List & Search */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                        <input
                            type="text"
                            placeholder="Search identities..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#00f0ff]/50 transition-colors font-mono text-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 scrollbar-thin scrollbar-thumb-white/10">
                        {filteredAgents.map(agent => (
                            <button
                                key={agent.id}
                                onClick={() => setSelectedAgentId(agent.id)}
                                className={`w-full group p-4 rounded-lg border text-left transition-all duration-300 relative overflow-hidden ${selectedAgentId === agent.id
                                    ? 'bg-[#00f0ff]/5 border-[#00f0ff]/50 shadow-[0_0_15px_rgba(0,240,255,0.1)]'
                                    : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20'
                                    }`}
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded bg-gradient-to-br flex items-center justify-center ${selectedAgentId === agent.id ? 'from-[#00f0ff]/20 to-[#00f0ff]/5' : 'from-white/10 to-white/5'
                                            }`}>
                                            <Cpu size={16} className={selectedAgentId === agent.id ? 'text-[#00f0ff]' : 'text-white/50'} />
                                        </div>
                                        <div>
                                            <div className={`font-mono text-sm font-bold ${selectedAgentId === agent.id ? 'text-[#00f0ff]' : 'text-white group-hover:text-white/90'
                                                }`}>
                                                {agent.name}
                                            </div>
                                            <div className="text-[10px] text-white/40 font-mono tracking-wider uppercase">
                                                ID: {(agent.id || 'unknown').substring(0, 8)}...
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-green-500/20 text-green-400 border border-green-500/30">
                                            ACTIVE
                                        </span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2 mt-2">
                                    <div className="bg-black/20 rounded p-1.5 flex items-center gap-2">
                                        <Shield size={10} className="text-white/30" />
                                        <span className="text-[10px] text-white/50 font-mono">{agent.allowedCapabilities?.length || 0} CAPS</span>
                                    </div>
                                    <div className="bg-black/20 rounded p-1.5 flex items-center gap-2">
                                        <Activity size={10} className="text-white/30" />
                                        <span className="text-[10px] text-white/50 font-mono">v1.0.0</span>
                                    </div>
                                </div>
                            </button>
                        ))}

                        {filteredAgents.length === 0 && (
                            <div className="p-12 border border-dashed border-white/10 rounded-lg flex flex-col items-center justify-center text-center gap-2">
                                <Cpu size={24} className="text-white/20" />
                                <span className="text-white/30 text-xs font-mono">No entities found via query.</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Details */}
                <div className="col-span-12 lg:col-span-8 bg-white/[0.02] border border-white/5 rounded-xl p-1 relative overflow-hidden min-h-[500px] flex flex-col">
                    {selectedAgent ? (
                        <div className="flex-1 flex flex-col h-full">
                            <AgentHologram
                                agent={selectedAgent}
                                trustStatus="Trusted" // Simplifying for specific view
                                onUpdate={onUpdateAgent}
                                onDelete={(id) => setDeleteId(id)}
                            />
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-12">
                            <div className="w-24 h-24 rounded-full border border-white/10 flex items-center justify-center mb-6 animate-pulse bg-white/5">
                                <Cpu size={32} className="text-white/20" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Select an Identity</h3>
                            <p className="text-white/40 max-w-sm">
                                Choose an agent from the matrix on the left to view detailed heuristics, capabilities, and modify core directives.
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={!!deleteId}
                title="Decommission Agent?"
                message="This action will permanently delete the agent's profile and heuristics. This cannot be undone."
                confirmText="Decommission"
                isDestructive={true}
                onConfirm={() => {
                    if (deleteId) {
                        onDeleteAgent(deleteId);
                        setSelectedAgentId(null);
                    }
                }}
                onCancel={() => setDeleteId(null)}
            />
        </div>
    );
};

export default AgentsPage;
