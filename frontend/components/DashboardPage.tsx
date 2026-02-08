import React, { useEffect, useState } from 'react';
import {
    Shield,
    Users,
    FileText,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Activity,
    RefreshCw,
    TrendingUp,
    MapPin,
    Server,
    Search,
    Clock
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

interface LayerStatus {
    id: string;
    name: string;
    status: 'active' | 'degraded' | 'offline';
    latency: number;
    health: number;
}

interface Threat {
    id: string;
    lat: number;
    lng: number;
    severity: string;
    source_ip: string;
    type: string;
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
        const interval = setInterval(fetchData, 5000); // Faster refresh for dashboard
        return () => clearInterval(interval);
    }, [endpoint]);

    return { data, loading, refetch: fetchData };
}

// --- Security Playground (New Component) ---
const SecurityPlayground = ({ onClose, onRun }: { onClose: () => void; onRun: () => void }) => {
    const [prompt, setPrompt] = useState('DROP TABLE users;');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/validate`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    agentId: 'demo-agent',
                    actionContent: prompt,
                    actionType: 'text',
                    useThinking: true
                })
            });
            const data = await res.json();
            setResult(data);
            if (onRun) onRun(); // Refresh logs
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-200">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                        <h3 className="font-bold text-slate-800">Security Playground</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-lg transition-colors">
                        <XCircle className="w-5 h-5 text-slate-400" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulated Agent Action</label>
                        <div className="relative">
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-800 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none h-32 resize-none"
                                placeholder="Enter a command to test (e.g., 'SELECT * FROM users')"
                            />
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                <button
                                    onClick={() => setPrompt("UPDATE users SET admin = true WHERE id = 1")}
                                    className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:border-cyan-300 text-slate-500 hover:text-cyan-600 transition-colors"
                                >
                                    SQL Injection
                                </button>
                                <button
                                    onClick={() => setPrompt("rm -rf /var/www/html")}
                                    className="text-xs bg-white border border-slate-200 px-2 py-1 rounded hover:border-cyan-300 text-slate-500 hover:text-cyan-600 transition-colors"
                                >
                                    System Command
                                </button>
                            </div>
                        </div>
                    </div>

                    {result && (
                        <div className="space-y-2 animate-in slide-in-from-top-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">VEIL Analysis Result</label>
                            <div className={cn(
                                "p-4 rounded-xl border flex items-start gap-4",
                                result.decision === 'allow' ? 'bg-emerald-50 border-emerald-200' :
                                    result.decision === 'flagged' ? 'bg-amber-50 border-amber-200' :
                                        'bg-rose-50 border-rose-200'
                            )}>
                                <div className={cn(
                                    "p-2 rounded-lg shrink-0",
                                    result.decision === 'allow' ? 'bg-emerald-100 text-emerald-600' :
                                        result.decision === 'flagged' ? 'bg-amber-100 text-amber-600' :
                                            'bg-rose-100 text-rose-600'
                                )}>
                                    {result.decision === 'allow' ? <CheckCircle className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-start">
                                        <h4 className={cn(
                                            "font-bold text-lg capitalize",
                                            result.decision === 'allow' ? 'text-emerald-800' :
                                                result.decision === 'flagged' ? 'text-amber-800' :
                                                    'text-rose-800'
                                        )}>
                                            {result.decision}
                                        </h4>
                                        <span className="text-xs font-mono text-slate-500">Risk Score: {result.riskScore}/100</span>
                                    </div>
                                    <ul className="mt-2 space-y-1">
                                        {result.reasons.map((r: string, i: number) => (
                                            <li key={i} className="text-sm text-slate-700 flex items-center gap-2">
                                                <span className="w-1 h-1 bg-slate-400 rounded-full" />
                                                {r}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    <button
                        onClick={handleSimulate}
                        disabled={loading}
                        className="px-6 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
                        Run Simulation
                    </button>
                </div>
            </div>
        </div>
    );
};

// --- Security Status Card ---
const SecurityStatusCard = ({ stats, insights, onOpenPlayground }: { stats: Stats; insights: Insights; onOpenPlayground: () => void }) => {
    const blockRate = stats.total_requests > 0
        ? ((stats.blocked_count / stats.total_requests) * 100).toFixed(1)
        : '0';
    const isHealthy = parseFloat(blockRate) < 10;

    return (
        <div className={cn(
            "rounded-xl p-6 text-white relative overflow-hidden shadow-lg transition-all hover:shadow-xl",
            isHealthy
                ? "bg-gradient-to-br from-cyan-600 via-teal-600 to-emerald-600"
                : "bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500"
        )}>
            <div className="relative z-10">
                <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5" />
                        <span className="text-sm font-medium text-white/90">VEIL Security Status</span>
                    </div>
                    <button
                        onClick={onOpenPlayground}
                        className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-lg text-xs font-bold uppercase tracking-wider transition-colors border border-white/30"
                    >
                        Test Security
                    </button>
                </div>

                <h2 className="text-3xl font-bold mb-2 tracking-tight">
                    {isHealthy ? 'All Systems Secure' : 'Elevated Threat Activity'}
                </h2>
                <p className="text-white/80 text-sm mb-6 max-w-sm">{insights.summary}</p>

                <div className="flex items-baseline gap-3">
                    <span className="text-5xl font-bold">{stats.total_requests.toLocaleString()}</span>
                    <span className="text-white/80 text-sm font-medium">requests processed</span>
                </div>

                <div className="flex items-center gap-3 mt-6">
                    <span className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider backdrop-blur-sm",
                        insights.riskTrend === 'stable' ? "bg-white/20" : "bg-rose-500/50"
                    )}>
                        {insights.riskTrend === 'stable' ? '● System Stable' : '⚠ Threat Elevated'}
                    </span>
                    <span className="text-xs text-white/60 font-mono">
                        Block Rate: {blockRate}%
                    </span>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -right-8 -bottom-8 opacity-10">
                <Shield className="w-56 h-56" />
            </div>
        </div>
    );
};

// --- KPI Cards ---
const KPICards = ({ stats, agents, policies }: { stats: Stats; agents: Agent[]; policies: Policy[] }) => {
    const kpis = [
        {
            label: 'Allowed Traffic',
            value: stats.allowed_count.toLocaleString(),
            icon: CheckCircle,
            color: 'text-emerald-600',
            bg: 'bg-emerald-50',
            border: 'border-emerald-100',
            trend: '+12%'
        },
        {
            label: 'Threats Blocked',
            value: stats.blocked_count.toLocaleString(),
            icon: XCircle,
            color: 'text-rose-600',
            bg: 'bg-rose-50',
            border: 'border-rose-100',
            trend: '+2%'
        },
        {
            label: 'Active Agents',
            value: agents.length.toString(),
            icon: Users,
            color: 'text-cyan-600',
            bg: 'bg-cyan-50',
            border: 'border-cyan-100',
            trend: 'Stable'
        },
        {
            label: 'Security Policies',
            value: policies.length.toString(),
            icon: FileText,
            color: 'text-teal-600',
            bg: 'bg-teal-50',
            border: 'border-teal-100',
            trend: 'Active'
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {kpis.map((kpi, i) => (
                <div key={i} className={cn(
                    "bg-white rounded-xl p-5 border shadow-sm hover:shadow-md transition-all group",
                    kpi.border
                )}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110", kpi.bg)}>
                            <kpi.icon className={cn("w-5 h-5", kpi.color)} />
                        </div>
                        <div className={cn("text-xs font-medium px-2 py-1 rounded bg-slate-50 text-slate-500")}>
                            {kpi.trend}
                        </div>
                    </div>
                    <div className="text-2xl font-bold text-slate-800 tracking-tight">{kpi.value}</div>
                    <div className="text-xs font-medium text-slate-500 uppercase tracking-wide mt-1">{kpi.label}</div>
                </div>
            ))}
        </div>
    );
};

// --- Layer Health Monitor ---
const LayerHealthMonitor = () => {
    const { data: layers } = useApi<LayerStatus[]>('/layers', []);

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden h-full flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Server className="w-4 h-4 text-slate-500" />
                    <h3 className="font-semibold text-slate-800">Stack Health</h3>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs text-slate-500 font-medium">Live</span>
                </div>
            </div>

            <div className="p-2 space-y-1 overflow-y-auto flex-1">
                {layers.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-slate-400 text-xs">Loading layer telemetry...</div>
                ) : (
                    layers.map(layer => (
                        <div key={layer.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg group transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "w-1.5 h-8 rounded-full",
                                    layer.status === 'active' ? 'bg-emerald-500' :
                                        layer.status === 'degraded' ? 'bg-amber-500' : 'bg-rose-500'
                                )} />
                                <div>
                                    <div className="text-sm font-medium text-slate-700">{layer.name}</div>
                                    <div className="text-xs text-slate-400 font-mono">{layer.id}</div>
                                </div>
                            </div>
                            <div className="text-right">
                                <div className={cn(
                                    "text-xs font-bold uppercase",
                                    layer.status === 'active' ? 'text-emerald-600' :
                                        layer.status === 'degraded' ? 'text-amber-600' : 'text-rose-600'
                                )}>{layer.status}</div>
                                <div className="text-xs text-slate-400 font-mono">{layer.latency}ms</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Threat Map Simulation ---
const ThreatMap = () => {
    const { data: threats } = useApi<Threat[]>('/threats', []);

    return (
        <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800 overflow-hidden h-full flex flex-col relative">
            <div className="absolute inset-0 z-0 opacity-20">
                {/* Simulated Map Grid */}
                <svg width="100%" height="100%">
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
            </div>

            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between relative z-10 bg-slate-900/80 backdrop-blur-sm">
                <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-500" />
                    <h3 className="font-semibold text-white">Active Threat Map</h3>
                </div>
                <span className="text-xs px-2 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                    {threats.length} Detected
                </span>
            </div>

            <div className="flex-1 relative p-6">
                {threats.map(threat => (
                    <div
                        key={threat.id}
                        className="absolute w-3 h-3 bg-rose-500 rounded-full animate-ping"
                        style={{
                            top: `${(50 - threat.lat) * 2}%`,
                            left: `${(180 + threat.lng) / 3.6}%`
                        }}
                        title={`${threat.type} from ${threat.source_ip}`}
                    />
                ))}
                {threats.map(threat => (
                    <div
                        key={`${threat.id}-dot`}
                        className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_#f43f5e]"
                        style={{
                            top: `${(50 - threat.lat) * 2}%`,
                            left: `${(180 + threat.lng) / 3.6}%`
                        }}
                    />
                ))}
            </div>

            <div className="p-3 bg-slate-800/50 border-t border-slate-800 relative z-10">
                <div className="text-xs text-slate-400 flex justify-between">
                    <span>Global Monitoring Active</span>
                    <span className="font-mono text-cyan-400">LIVE FEED</span>
                </div>
            </div>
        </div>
    );
};

// --- Recent Activity ---
const RecentActivity = ({ logs }: { logs: LogEntry[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
            <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-600" />
                <h3 className="font-semibold text-slate-800">Live Audit Log</h3>
            </div>
            <span className="text-xs text-slate-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                Updating
            </span>
        </div>

        <div className="flex-1 px-2 overflow-y-auto">
            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-48 text-slate-400">
                    <Clock className="w-8 h-8 mb-3 text-slate-300" />
                    <p className="text-sm font-medium">No events logged</p>
                </div>
            ) : (
                <div className="divide-y divide-slate-50">
                    {logs.map((log, i) => (
                        <div key={log.id || i} className="flex items-start gap-3 p-3 hover:bg-slate-50 transition-colors group">
                            <div className={cn(
                                "w-2 h-2 mt-2 rounded-full shrink-0",
                                log.decision === 'allow' ? 'bg-emerald-500' :
                                    log.decision === 'deny' ? 'bg-rose-500' : 'bg-amber-500'
                            )} />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <span className="text-xs font-bold text-slate-700">{log.actionType}</span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                        {new Date(log.createdAt).toLocaleTimeString([], { hour12: false })}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 truncate group-hover:text-cyan-600 transition-colors">
                                    {log.actionContent}
                                </p>
                            </div>
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
    const { data: agents } = useApi<Agent[]>('/agents', []);
    const { data: policies } = useApi<Policy[]>('/policies', []);
    const { data: logs, loading: logsLoading, refetch: refetchLogs } = useApi<LogEntry[]>('/logs', []);
    const { data: insights } = useApi<Insights>('/insights', { summary: 'Connecting to VEIL...', riskTrend: 'stable', criticalAlerts: [] });
    const { data: stats, refetch: refetchStats } = useApi<Stats>('/v1/stats', { total_requests: 0, allowed_count: 0, blocked_count: 0, recent_logs: [] });

    const [showPlayground, setShowPlayground] = useState(false);
    const isLoading = logsLoading;

    const handleRefresh = () => {
        refetchLogs();
        refetchStats();
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Loading Overlay */}
            {isLoading && (
                <div className="fixed bottom-4 right-4 bg-slate-900 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-3 text-sm z-50 animate-in slide-in-from-bottom">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Syncing VEIL Neural Network...</span>
                </div>
            )}

            {showPlayground && (
                <SecurityPlayground
                    onClose={() => setShowPlayground(false)}
                    onRun={handleRefresh}
                />
            )}

            {/* Top: Status + KPIs */}
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 lg:col-span-4">
                    <SecurityStatusCard
                        stats={stats}
                        insights={insights}
                        onOpenPlayground={() => setShowPlayground(true)}
                    />
                </div>
                <div className="col-span-12 lg:col-span-8 flex flex-col justify-between">
                    <KPICards stats={stats} agents={agents} policies={policies} />
                </div>
            </div>

            {/* Middle: Map + Layer Health + Logs */}
            <div className="grid grid-cols-12 gap-6 h-[400px]">
                <div className="col-span-12 lg:col-span-6 h-full">
                    <ThreatMap />
                </div>
                <div className="col-span-12 lg:col-span-3 h-full">
                    <LayerHealthMonitor />
                </div>
                <div className="col-span-12 lg:col-span-3 h-full">
                    <RecentActivity logs={logs} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
