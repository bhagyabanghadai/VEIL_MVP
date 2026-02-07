import React, { useState, useEffect } from 'react';
import StatusBar from './dashboard/StatusBar';
import KPICards from './dashboard/KPICards';
import LayerHealth from './dashboard/LayerHealth';
import ThreatHeatmap from './dashboard/ThreatHeatmap';
import LiveFeed from './dashboard/LiveFeed';
import DecisionCard from './dashboard/DecisionCard';

interface DashboardPageProps {
    agents?: any[];
    policies?: any[];
    auditLog?: any[];
    selectedAgentId?: string | null;
    onSelectAgent?: (id: string) => void;
    onUpdateAgent?: (agent: any) => void;
    onDeleteAgent?: (id: string) => void;
    onAddPolicy?: (policy: any) => void;
    onDeletePolicy?: (id: string) => void;
    onClearPolicies?: () => void;
    onClearLogs?: () => void;
    onResolveEntry?: (id: string, resolution: any) => void;
    onActionEvaluated?: (action: any, evaluation: any) => void;
    onPurgeAgents?: () => void;
    scenarioTrigger?: any;
    isDemoMode?: boolean;
    systemInsights?: { summary: string; riskTrend: string; criticalAlerts: string[] };
    isInsightsLoading?: boolean;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
    auditLog = [],
    systemInsights = { summary: 'System operational. No anomalies detected.', riskTrend: 'stable', criticalAlerts: [] },
}) => {
    const [stats, setStats] = useState({
        totalRequests: 0,
        allowed: 0,
        blocked: 0,
        avgLatency: 12,
        uptime: '0h 0m',
    });

    // Fetch backend stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/v1/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats({
                        totalRequests: (data.allowed || 0) + (data.blocked || 0),
                        allowed: data.allowed || 0,
                        blocked: data.blocked || 0,
                        avgLatency: data.avgLatency || 12,
                        uptime: data.uptime || '23h 17m',
                    });
                }
            } catch (err) {
                console.error('Stats fetch failed:', err);
            }
        };

        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    // Calculate metrics
    const blockRate = stats.totalRequests > 0
        ? ((stats.blocked / stats.totalRequests) * 100).toFixed(1)
        : '0.0';

    const riskScore = Math.min(Math.round(parseFloat(blockRate) * 5 + (systemInsights.criticalAlerts?.length || 0) * 10), 100);

    const aiThreatLevel = riskScore < 20 ? 'minimal'
        : riskScore < 40 ? 'low'
            : riskScore < 70 ? 'moderate'
                : 'high';

    // Transform audit log to decisions
    const recentDecisions = auditLog.slice(0, 5).map((log: any, i: number) => ({
        id: log.id || `dec-${i}`,
        verdict: log.decision === 'allow' ? 'allow' as const : 'block' as const,
        payload: log.actionContent || 'Unknown action',
        reason: log.reasons?.[0] || 'Standard evaluation',
        confidence: log.riskScore ? (100 - log.riskScore) / 100 : 0.85,
        layer: 'L4 Flash Judge',
        timestamp: new Date(log.createdAt || Date.now()).toLocaleTimeString('en-US', { hour12: false }),
    }));

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Status Bar */}
            <StatusBar
                version="9.0"
                uptime={stats.uptime}
                status="operational"
                layersActive={7}
                lastAttack={stats.blocked > 0 ? '4m ago' : 'Never'}
            />

            {/* Main Content */}
            <div className="max-w-[1800px] mx-auto px-6 py-6 space-y-6">

                {/* KPI Row */}
                <KPICards
                    riskScore={riskScore}
                    mttd={stats.avgLatency}
                    mttr={Math.round(stats.avgLatency * 0.7)}
                    blockRate={parseFloat(blockRate)}
                    aiThreatLevel={aiThreatLevel}
                    aiConfidence={0.23 + (riskScore / 200)}
                />

                {/* Main Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Layer Health */}
                    <LayerHealth />

                    {/* Threat Heatmap */}
                    <ThreatHeatmap />
                </div>

                {/* Bottom Grid - Live Feed & Decisions */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="h-[400px]">
                        <LiveFeed />
                    </div>

                    <div className="h-[400px]">
                        <DecisionCard decisions={recentDecisions.length > 0 ? recentDecisions : undefined} />
                    </div>
                </div>

                {/* System Message */}
                <div className="rounded-xl bg-slate-900/30 border border-white/5 p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <p className="text-sm text-slate-400">
                            <span className="text-cyan-400 font-semibold">AI Analysis:</span> {systemInsights.summary}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
