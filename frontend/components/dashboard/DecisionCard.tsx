import React from 'react';

interface Decision {
    id: string;
    verdict: 'allow' | 'block' | 'flagged';
    payload: string;
    reason: string;
    confidence: number;
    layer: string;
    timestamp: string;
}

interface DecisionCardProps {
    decisions?: Decision[];
}

const defaultDecisions: Decision[] = [
    {
        id: '1',
        verdict: 'block',
        payload: 'DROP TABLE users;',
        reason: 'Pre-LLM Regex: SQL Injection',
        confidence: 1.0,
        layer: 'L4 Flash Judge',
        timestamp: '22:30:01',
    },
    {
        id: '2',
        verdict: 'allow',
        payload: 'GET /api/v1/agents',
        reason: 'Policy Match: Public Route',
        confidence: 0.95,
        layer: 'L3 Policy Engine',
        timestamp: '22:29:58',
    },
];

const DecisionCard: React.FC<DecisionCardProps> = ({ decisions = defaultDecisions }) => {
    const getVerdictStyles = (verdict: string) => {
        switch (verdict) {
            case 'allow':
                return { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' };
            case 'block':
                return { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' };
            default:
                return { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' };
        }
    };

    return (
        <div className="rounded-xl bg-slate-900/50 backdrop-blur-sm border border-white/5 overflow-hidden h-full flex flex-col">
            <div className="px-4 py-3 border-b border-white/5">
                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Recent Decisions
                </h3>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {decisions.map((decision) => {
                    const styles = getVerdictStyles(decision.verdict);
                    return (
                        <div
                            key={decision.id}
                            className={`rounded-lg ${styles.bg} border ${styles.border} p-4 transition-all hover:scale-[1.01]`}
                        >
                            <div className="flex items-center justify-between mb-3">
                                <span className={`text-sm font-bold uppercase ${styles.text}`}>
                                    {decision.verdict}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                    {decision.timestamp}
                                </span>
                            </div>

                            <div className="space-y-2">
                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase">Payload</span>
                                    <p className="text-xs text-slate-200 font-mono truncate">
                                        {decision.payload}
                                    </p>
                                </div>

                                <div>
                                    <span className="text-[10px] text-slate-500 uppercase">Reason</span>
                                    <p className="text-xs text-slate-300">
                                        {decision.reason}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between pt-2 border-t border-white/5">
                                    <span className="text-[10px] text-slate-500">
                                        {decision.layer}
                                    </span>
                                    <span className="text-[10px] text-slate-400">
                                        Confidence: <span className="text-white font-bold">{(decision.confidence * 100).toFixed(0)}%</span>
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DecisionCard;
