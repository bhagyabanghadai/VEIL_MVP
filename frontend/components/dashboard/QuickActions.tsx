import React, { useState } from 'react';
import {
    Shield,
    Scan,
    FileText,
    AlertOctagon,
    RefreshCw,
    Download,
    Lock,
    Unlock
} from 'lucide-react';

interface QuickAction {
    id: string;
    label: string;
    icon: React.ElementType;
    color: 'cyan' | 'amber' | 'red' | 'green';
    description: string;
    isLoading?: boolean;
}

interface QuickActionsProps {
    onAction?: (actionId: string) => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
    const [loadingAction, setLoadingAction] = useState<string | null>(null);
    const [systemLocked, setSystemLocked] = useState(false);

    const actions: QuickAction[] = [
        {
            id: 'lockdown',
            label: systemLocked ? 'Unlock System' : 'Lockdown',
            icon: systemLocked ? Unlock : Lock,
            color: systemLocked ? 'green' : 'red',
            description: systemLocked ? 'Resume normal operations' : 'Block all non-essential traffic',
        },
        {
            id: 'scan',
            label: 'Full Scan',
            icon: Scan,
            color: 'cyan',
            description: 'Run comprehensive security scan',
        },
        {
            id: 'refresh',
            label: 'Sync Policies',
            icon: RefreshCw,
            color: 'amber',
            description: 'Refresh all policy rules',
        },
        {
            id: 'report',
            label: 'Export Report',
            icon: Download,
            color: 'green',
            description: 'Generate PDF security report',
        },
    ];

    const colorMap = {
        cyan: {
            bg: 'bg-cyan-500/10 hover:bg-cyan-500/20',
            border: 'border-cyan-500/30 hover:border-cyan-500/50',
            text: 'text-cyan-400',
            glow: 'hover:shadow-[0_0_20px_rgba(6,182,212,0.3)]',
        },
        amber: {
            bg: 'bg-amber-500/10 hover:bg-amber-500/20',
            border: 'border-amber-500/30 hover:border-amber-500/50',
            text: 'text-amber-400',
            glow: 'hover:shadow-[0_0_20px_rgba(245,158,11,0.3)]',
        },
        red: {
            bg: 'bg-red-500/10 hover:bg-red-500/20',
            border: 'border-red-500/30 hover:border-red-500/50',
            text: 'text-red-400',
            glow: 'hover:shadow-[0_0_20px_rgba(239,68,68,0.3)]',
        },
        green: {
            bg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
            border: 'border-emerald-500/30 hover:border-emerald-500/50',
            text: 'text-emerald-400',
            glow: 'hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]',
        },
    };

    const handleAction = async (actionId: string) => {
        setLoadingAction(actionId);

        // Simulate action
        await new Promise(resolve => setTimeout(resolve, 1500));

        if (actionId === 'lockdown') {
            setSystemLocked(!systemLocked);
        }

        setLoadingAction(null);
        onAction?.(actionId);
    };

    return (
        <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Quick Actions
                </h3>
                <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${systemLocked ? 'bg-red-400' : 'bg-emerald-400'} animate-pulse`} />
                    <span className={`text-[10px] font-mono ${systemLocked ? 'text-red-400' : 'text-emerald-400'}`}>
                        {systemLocked ? 'LOCKED' : 'ACTIVE'}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {actions.map((action) => {
                    const colors = colorMap[action.color];
                    const isLoading = loadingAction === action.id;

                    return (
                        <button
                            key={action.id}
                            onClick={() => handleAction(action.id)}
                            disabled={isLoading}
                            className={`
                                group relative flex flex-col items-center gap-2 p-4 rounded-xl
                                ${colors.bg} border ${colors.border} ${colors.glow}
                                transition-all duration-200 hover:scale-[1.02]
                                disabled:opacity-50 disabled:cursor-wait
                            `}
                        >
                            {/* Icon */}
                            <div className={`relative ${isLoading ? 'animate-spin' : ''}`}>
                                <action.icon className={`h-6 w-6 ${colors.text}`} />
                            </div>

                            {/* Label */}
                            <span className={`text-xs font-bold ${colors.text}`}>
                                {action.label}
                            </span>

                            {/* Description Tooltip on Hover */}
                            <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-800 border border-white/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                                <span className="text-[10px] text-slate-300">{action.description}</span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* System Status Banner */}
            {systemLocked && (
                <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center gap-3">
                    <AlertOctagon className="h-4 w-4 text-red-400 animate-pulse" />
                    <p className="text-xs text-red-400">
                        <span className="font-bold">LOCKDOWN ACTIVE</span> — All non-essential traffic is being blocked
                    </p>
                </div>
            )}
        </div>
    );
};

export default QuickActions;
