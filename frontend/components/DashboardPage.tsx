import React, { useState } from 'react';
import { Agent, Policy, AuditLogEntry, Action, ActionEvaluation, Resolution } from '../types';
import AgentHologram from './dashboard/AgentHologram';
import PolicyEditor from './PolicyEditor';
import ActionConsole from './ActionConsole';
import AuditLog from './AuditLog';
import LiveMetrics from './dashboard/LiveMetrics';
import { getAgentTrustStatus } from '../services/scaffoldService';
// import { Plus } from 'lucide-react'; // Unused
import ConfirmationModal from './ui/confirmation-modal';
import DashboardCard from './dashboard/DashboardCard';
import { WaveText } from './ui/wave-text';
// import { ArrowRight, Activity, ShieldAlert, Cpu } from 'lucide-react'; // Unused

interface DashboardPageProps {
    agents: Agent[];
    policies: Policy[];
    auditLog: AuditLogEntry[];
    selectedAgentId: string | null;
    onSelectAgent: (id: string) => void;
    onUpdateAgent: (agent: Agent) => void;
    onDeleteAgent: (id: string) => void;
    onAddPolicy: (policy: Policy) => void;
    onDeletePolicy?: (id: string) => void;
    onClearPolicies: () => void;
    onClearLogs: () => void;
    onResolveEntry: (id: string, resolution: Resolution) => void;
    onActionEvaluated: (action: Action, evaluation: ActionEvaluation) => void;
    onPurgeAgents: () => void;
    scenarioTrigger?: any;
    isDemoMode: boolean;
    systemInsights: { summary: string, riskTrend: string, criticalAlerts: string[] };
    isInsightsLoading: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
    agents,
    policies,
    auditLog,
    selectedAgentId,
    onSelectAgent,
    onUpdateAgent,
    onDeleteAgent,
    onAddPolicy,
    onDeletePolicy,
    onClearPolicies,
    onClearLogs,
    onResolveEntry,
    onActionEvaluated,
    onPurgeAgents,
    scenarioTrigger,
    isDemoMode,
    systemInsights,
    // isInsightsLoading // Unused
}) => {
    const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);
    const activeAgent = agents.find(a => a.id === selectedAgentId);
    const currentTrustStatus = activeAgent ? getAgentTrustStatus(activeAgent.id, auditLog) : 'Trusted';

    return (
        <div className="flex flex-col gap-6">
            {/* Top Section: Metrics & Welcome */}
            <div className="flex flex-col lg:flex-row gap-8 items-end justify-between">
                <div>
                    <h1 className="text-3xl font-semibold text-veil-text-primary mb-2 tracking-tight">
                        <WaveText text="VEIL OS v2.4" />
                    </h1>
                    <p className="text-veil-text-muted text-sm max-w-lg font-medium">
                        {systemInsights.summary}
                    </p>
                </div>
                <div className="w-full lg:w-auto min-w-[500px] bg-black/20 backdrop-blur-sm rounded-lg border border-white/5 p-1">
                    <LiveMetrics />
                </div>
            </div>

            {/* Main Operational Grid */}
            <div className="grid grid-cols-12 gap-6 min-h-[600px]">

                {/* LEFT: Agent List & Status */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
                    <DashboardCard
                        title="LAYER 2: IDENTITY GRID"
                        subtitle={`${agents.length} Nodes Verified`}
                        className="flex-1"
                    >
                        <div className="flex flex-col gap-2 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-veil-border">
                            {agents.map(agent => (
                                <button
                                    key={agent.id}
                                    onClick={() => onSelectAgent(agent.id)}
                                    className={`group p-4 rounded-lg border text-left transition-all duration-300 relative overflow-hidden ${selectedAgentId === agent.id
                                        ? 'bg-veil-accent/10 border-veil-accent/50 shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                                        : 'bg-veil-card border-veil-border hover:bg-veil-sub hover:border-veil-text-muted/30'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`font-mono text-sm font-bold tracking-tight ${selectedAgentId === agent.id ? 'text-veil-accent' : 'text-veil-text-secondary group-hover:text-veil-text-primary'}`}>
                                            {agent.name}
                                        </span>
                                        {selectedAgentId === agent.id && <div className="w-2 h-2 rounded-full bg-veil-accent shadow-[0_0_8px_#00f0ff] animate-pulse" />}
                                    </div>
                                    <div className="h-[2px] w-full bg-veil-bg mt-3 relative overflow-hidden rounded-full">
                                        <div className={`absolute inset-0 bg-veil-accent w-2/3 transition-all duration-1000 ${selectedAgentId === agent.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full group-hover:opacity-50 group-hover:translate-x-[-20%]'}`} />
                                    </div>
                                </button>
                            ))}

                            {agents.length === 0 && (
                                <div className="p-8 border border-dashed border-white/10 rounded-lg text-center text-white/20 text-xs font-mono uppercase tracking-widest flex flex-col items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/10 font-bold mb-2">V</div>
                                    No Neural Nodes Online
                                </div>
                            )}

                            <div className="mt-auto pt-4 flex gap-2">
                                <button
                                    onClick={() => window.location.href = '/register'}
                                    className="flex-1 py-3 bg-veil-accent/10 border border-veil-accent/30 text-veil-accent text-xs font-bold font-mono uppercase tracking-widest hover:bg-veil-accent/20 hover:border-veil-accent transition-all rounded hover:shadow-[0_0_15px_rgba(0,240,255,0.2)]"
                                >
                                    + Initialize Node
                                </button>
                                {agents.length > 0 && (
                                    <button
                                        onClick={() => setShowPurgeConfirm(true)}
                                        className="px-3 py-3 border border-veil-alert/30 text-veil-alert text-xs font-bold font-mono uppercase tracking-widest hover:bg-veil-alert/10 hover:border-veil-alert transition-all rounded"
                                        title="Purge All"
                                    >
                                        X
                                    </button>
                                )}
                            </div>
                        </div>
                    </DashboardCard>
                </div>

                {/* MIDDLE: Hologram & Action Console */}
                <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
                    {/* Hologram Viewport */}
                    <DashboardCard className="h-[400px] relative overflow-hidden p-0" gradient>
                        {activeAgent ? (
                            <div className="absolute inset-0">
                                <AgentHologram
                                    agent={activeAgent}
                                    trustStatus={currentTrustStatus}
                                    onUpdate={onUpdateAgent}
                                    onDelete={onDeleteAgent}
                                />
                                {/* Overlay Stats */}
                                <div className="absolute top-4 left-4 p-2 bg-black/40 backdrop-blur rounded border border-veil-border/50">
                                    <div className="text-[10px] text-veil-text-muted font-mono">STATUS</div>
                                    <div className={`text-sm font-bold ${currentTrustStatus === 'Compromised' ? 'text-veil-alert' : 'text-veil-success'}`}>
                                        {currentTrustStatus}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-veil-text-dim">
                                <div className="w-24 h-24 rounded-full border border-veil-border/30 flex items-center justify-center mb-6 animate-pulse-slow">
                                    <div className="w-2 h-2 bg-veil-accent/50 rounded-full" />
                                </div>
                                <span className="font-mono text-sm uppercase tracking-[0.2em]">Select Node to Visualize</span>
                            </div>
                        )}
                    </DashboardCard>

                    {/* Decision Engine */}
                    <DashboardCard title="LAYER 5: SEMANTIC FIREWALL" className="flex-1 min-h-[300px]" alertLevel={scenarioTrigger ? 'medium' : 'none'}>
                        {activeAgent ? (
                            <ActionConsole
                                agents={agents}
                                policies={policies}
                                onActionEvaluated={onActionEvaluated}
                                scenarioConfig={selectedAgentId === scenarioTrigger?.agentId ? scenarioTrigger : undefined}
                                isDemoMode={isDemoMode}
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-veil-text-dim font-mono text-xs">
                                AWAITING TARGET LOCK
                            </div>
                        )}
                    </DashboardCard>
                </div>

                {/* RIGHT: Policy & Logs */}
                <div className="col-span-12 lg:col-span-3 flex flex-col gap-6 h-full">
                    <DashboardCard
                        title="LAYER 4: STATIC POLICY"
                        subtitle="Enforcement Matrix"
                        action={<span className="text-veil-accent font-bold text-lg">{policies.length}</span>}
                    >
                        <PolicyEditor
                            onAddPolicy={onAddPolicy}
                            onClearPolicies={onClearPolicies}
                            onDeletePolicy={onDeletePolicy}
                            policies={policies}
                            compact={true}
                        />
                    </DashboardCard>

                    <DashboardCard
                        title="LAYER 7: IMMUTABLE LEDGER"
                        subtitle="Audit Chain"
                        className="flex-1"
                        action={<div className="w-2 h-2 rounded-full bg-veil-success shadow-[0_0_5px_#00ff9d] animate-pulse" />}
                    >
                        <AuditLog entries={auditLog} agents={agents} onClearLogs={onClearLogs} onResolveEntry={onResolveEntry} compact={true} />
                    </DashboardCard>
                </div>

            </div>

            <ConfirmationModal
                isOpen={showPurgeConfirm}
                title="PURGE MATRIX?"
                message="This will permanently delete all agent profiles. This action generates a Level 5 system alert and cannot be undone."
                confirmText="INITIATE PURGE"
                isDestructive={true}
                onConfirm={onPurgeAgents}
                onCancel={() => setShowPurgeConfirm(false)}
            />
        </div>
    );
};

export default DashboardPage;
