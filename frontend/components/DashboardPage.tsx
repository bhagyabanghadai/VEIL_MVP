import React, { useEffect, useState } from 'react';
import {
    Shield,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    RefreshCw,
    TrendingUp,
    XCircle
} from 'lucide-react';
import { cn } from '../lib/utils';

// API Base URL
const API_BASE = '/api';

// --- Types ---
interface Agent {
    id: string;
    name: string;
    purpose: string;
    riskLevel: string;
    createdAt: string;
}

interface Policy {
    id: string;
    name: string;
    naturalLanguage: string;
    createdAt: string;
}

interface LogEntry {
    id: string;
    actionType: string;
    actionContent: string;
    decision: string;
    riskScore: number;
    createdAt: string;
}

interface Stats {
    total_requests: number;
    allowed_count: number;
    blocked_count: number;
    recent_logs: { path: string; status: number; latency: number; timestamp: number }[];
}

interface Insights {
    summary: string;
    riskTrend: string;
    criticalAlerts: string[];
}

// --- API Hook ---
function useApi<T>(endpoint: string, defaultValue: T): { data: T; loading: boolean; refetch: () => void } {
    const [data, setData] = useState<T>(defaultValue);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE}${endpoint}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch (err) {
            console.error(`Failed to fetch ${endpoint}:`, err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 10000);
        return () => clearInterval(interval);
    }, [endpoint]);

    return { data, loading, refetch: fetchData };
}

// --- Security Status Card ---
const SecurityStatusCard = ({ stats, insights }: { stats: Stats; insights: Insights }) => {
    const blockRate = stats.total_requests > 0
        ? ((stats.blocked_count / stats.total_requests) * 100).toFixed(1)
        : '0';
    const isHealthy = parseFloat(blockRate) < 10;

    return (
        <div className={cn(
            "rounded-xl p-6 text-white relative overflow-hidden",
            isHealthy
                ? "bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600"
                : "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
        )}>
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                    <Shield className="w-5 h-5" />
                    <span className="text-sm font-medium text-white/80">VEIL Security Status</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">
                    {isHealthy ? 'All Systems Secure' : 'Elevated Threat Activity'}
                </h2>
                <p className="text-white/70 text-sm mb-4">{insights.summary}</p>

                <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold">{stats.total_requests.toLocaleString()}</span>
                    <span className="text-white/70 text-sm">requests processed</span>
                </div>

                <div className="flex items-center gap-3 mt-4">
                    <span className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-semibold",
                        insights.riskTrend === 'stable' ? "bg-white/20" : "bg-rose-500/50"
                    )}>
                        {insights.riskTrend === 'stable' ? '● Stable' : '⚠ Elevated'}
                    </span>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-8 opacity-10">
                <Shield className="w-48 h-48" />
            </div>
        </div>
    );
};

// --- KPI Cards ---
const KPICards = ({ stats, agents, policies }: { stats: Stats; agents: Agent[]; policies: Policy[] }) => {
    const kpis = [
        {
            label: 'Allowed',
            value: stats.allowed_count.toLocaleString(),
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100'
        },
        {
            label: 'Blocked',
            value: stats.blocked_count.toLocaleString(),
            icon: XCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100'
        },
        {
            label: 'Agents',
            value: agents.length.toString(),
            icon: Users,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            border: 'border-cyan-100'
        },
        {
            label: 'Policies',
            value: policies.length.toString(),
            icon: FileText,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            border: 'border-teal-100'
        },
    ];

    return (
        <div className="grid grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
                <div key={i} className={cn("bg-white rounded-xl p-5 border shadow-sm", kpi.border)}>
                    <div className="flex items-center justify-between mb-3">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", kpi.bg)}>
                            <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                        </div>
                        <TrendingUp className="w-4 h-4 text-slate-300" />
                    </div>
                    <div className="text-2xl font-bold text-slate-800">{kpi.value}</div>
                    <div className="text-sm text-slate-500">{kpi.label}</div>
                </div>
            ))}
        </div>
    );
};

// --- Recent Activity ---
const RecentActivity = ({ logs }: { logs: LogEntry[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 h-full">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-800">Security Events</h3>
            </div>
            <span className="text-xs text-slate-400">Live</span>
        </div>

        <div className="p-4">
            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <Clock className="w-10 h-10 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">No events yet</p>
                    <p className="text-xs text-slate-400 mt-1">Process requests to see activity</p>
                </div>
            ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {logs.map((log, i) => (
                        <div key={log.id || i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors border border-slate-50">
                            <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                                log.decision === 'allow' ? 'bg-emerald-100' :
                                    log.decision === 'deny' ? 'bg-rose-100' : 'bg-amber-100'
                            )}>
                                {log.decision === 'allow' ? (
                                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                                ) : log.decision === 'deny' ? (
                                    <XCircle className="w-4 h-4 text-rose-600" />
                                ) : (
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={cn(
                                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                                        log.decision === 'allow' ? 'bg-emerald-100 text-emerald-700' :
                                            log.decision === 'deny' ? 'bg-rose-100 text-rose-700' :
                                                'bg-amber-100 text-amber-700'
                                    )}>
                                        {log.decision}
                                    </span>
                                    <span className="text-xs text-slate-400">{log.actionType}</span>
                                </div>
                                <p className="text-sm text-slate-600 truncate">{log.actionContent}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// --- Agents List ---
const AgentsList = ({ agents }: { agents: Agent[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-cyan-600" />
                <h3 className="font-semibold text-slate-800">Registered Agents</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-cyan-50 text-cyan-600 font-medium">{agents.length}</span>
        </div>

        <div className="p-4">
            {agents.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                    <Users className="w-10 h-10 mb-3 text-slate-300" />
                    <p className="text-sm">No agents registered</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {agents.slice(0, 5).map((agent) => (
                        <div key={agent.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 border border-slate-50">
                            <div className={cn(
                                "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                                agent.riskLevel === 'high' ? 'bg-rose-100' :
                                    agent.riskLevel === 'medium' ? 'bg-amber-100' : 'bg-emerald-100'
                            )}>
                                🤖
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="font-medium text-slate-800 truncate">{agent.name}</div>
                                <div className="text-xs text-slate-500 truncate">{agent.purpose}</div>
                            </div>
                            <span className={cn(
                                "px-2 py-1 rounded text-[10px] font-bold uppercase shrink-0",
                                agent.riskLevel === 'high' ? 'bg-rose-100 text-rose-700' :
                                    agent.riskLevel === 'medium' ? 'bg-amber-100 text-amber-700' :
                                        'bg-emerald-100 text-emerald-700'
                            )}>
                                {agent.riskLevel}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// --- Policies List ---
const PoliciesList = ({ policies }: { policies: Policy[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-teal-600" />
                <h3 className="font-semibold text-slate-800">Policies</h3>
            </div>
            <span className="text-xs px-2 py-1 rounded-full bg-teal-50 text-teal-600 font-medium">{policies.length}</span>
        </div>

        <div className="p-4">
            {policies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-slate-400">
                    <FileText className="w-10 h-10 mb-3 text-slate-300" />
                    <p className="text-sm">No policies defined</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {policies.slice(0, 4).map((policy) => (
                        <div key={policy.id} className="p-3 rounded-lg border border-teal-100 bg-teal-50/30 hover:bg-teal-50">
                            <div className="font-medium text-slate-800 text-sm mb-1">{policy.name}</div>
                            <div className="text-xs text-slate-500 line-clamp-2">{policy.naturalLanguage}</div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

// --- Main Dashboard ---
interface DashboardPageProps {
    isDemoMode?: boolean;
    [key: string]: any;
}

const DashboardPage: React.FC<DashboardPageProps> = () => {
    const { data: agents, loading: agentsLoading } = useApi<Agent[]>('/agents', []);
    const { data: policies, loading: policiesLoading } = useApi<Policy[]>('/policies', []);
    const { data: logs, loading: logsLoading } = useApi<LogEntry[]>('/logs', []);
    const { data: insights } = useApi<Insights>('/insights', { summary: 'Connecting to VEIL...', riskTrend: 'stable', criticalAlerts: [] });
    const { data: stats } = useApi<Stats>('/v1/stats', { total_requests: 0, allowed_count: 0, blocked_count: 0, recent_logs: [] });

    const isLoading = agentsLoading || policiesLoading || logsLoading;

    return (
        <div className="space-y-6">
            {/* Loading */}
            {isLoading && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing with VEIL backend...</span>
                </div>
            )}

            {/* Top: Status + KPIs */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4">
                    <SecurityStatusCard stats={stats} insights={insights} />
                </div>
                <div className="col-span-12 lg:col-span-8">
                    <KPICards stats={stats} agents={agents} policies={policies} />
                </div>
            </div>

            {/* Middle: Activity + Agents + Policies */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-5">
                    <RecentActivity logs={logs} />
                </div>
                <div className="col-span-12 lg:col-span-4">
                    <AgentsList agents={agents} />
                </div>
                <div className="col-span-12 lg:col-span-3">
                    <PoliciesList policies={policies} />
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                <span>VEIL Security OS v8.0</span>
                <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Auto-refresh: 10s
                </span>
            </div>
        </div>
    );
};

export default DashboardPage;
