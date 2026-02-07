import React from 'react';

interface KPICardProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'cyan' | 'green' | 'amber' | 'red' | 'blue';
    icon?: React.ReactNode;
}

const KPICard: React.FC<KPICardProps> = ({
    label,
    value,
    subValue,
    trend = 'neutral',
    trendValue,
    color = 'cyan',
}) => {
    const colorMap = {
        cyan: 'from-cyan-500/20 to-cyan-600/5 border-cyan-500/30',
        green: 'from-emerald-500/20 to-emerald-600/5 border-emerald-500/30',
        amber: 'from-amber-500/20 to-amber-600/5 border-amber-500/30',
        red: 'from-red-500/20 to-red-600/5 border-red-500/30',
        blue: 'from-blue-500/20 to-blue-600/5 border-blue-500/30',
    };

    const trendColors = {
        up: 'text-emerald-400',
        down: 'text-red-400',
        neutral: 'text-slate-400',
    };

    const trendIcons = {
        up: '↑',
        down: '↓',
        neutral: '→',
    };

    return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${colorMap[color]} border backdrop-blur-sm p-4 transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-black/20`}>
            {/* Subtle glow effect */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-white/5 rounded-full blur-2xl" />

            <div className="relative">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">
                    {label}
                </p>

                <div className="flex items-end justify-between">
                    <div>
                        <p className="text-2xl font-bold text-white tracking-tight">
                            {value}
                        </p>
                        {subValue && (
                            <p className="text-xs text-slate-400 mt-1">{subValue}</p>
                        )}
                    </div>

                    {trendValue && (
                        <div className={`flex items-center gap-1 text-xs font-mono ${trendColors[trend]}`}>
                            <span>{trendIcons[trend]}</span>
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

interface KPICardsProps {
    riskScore?: number;
    mttd?: number;
    mttr?: number;
    blockRate?: number;
    aiThreatLevel?: 'minimal' | 'low' | 'moderate' | 'high';
    aiConfidence?: number;
}

const KPICards: React.FC<KPICardsProps> = ({
    riskScore = 23,
    mttd = 12,
    mttr = 8,
    blockRate = 3.6,
    aiThreatLevel = 'low',
    aiConfidence = 0.23,
}) => {
    const getRiskColor = (score: number) => {
        if (score < 30) return 'green';
        if (score < 60) return 'amber';
        return 'red';
    };

    const getAiColor = (level: string) => {
        if (level === 'minimal' || level === 'low') return 'green';
        if (level === 'moderate') return 'amber';
        return 'red';
    };

    // Risk score dots (5 dots, filled based on score)
    const riskDots = Math.ceil(riskScore / 20);

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <KPICard
                label="Risk Score"
                value={riskScore}
                subValue={`${'●'.repeat(riskDots)}${'○'.repeat(5 - riskDots)} /100`}
                color={getRiskColor(riskScore)}
            />

            <KPICard
                label="MTTD (Detect)"
                value={`${mttd}ms`}
                trend="down"
                trendValue="2ms"
                subValue="Excellent"
                color="cyan"
            />

            <KPICard
                label="MTTR (Respond)"
                value={`${mttr}ms`}
                trend="down"
                trendValue="1ms"
                subValue="Excellent"
                color="blue"
            />

            <KPICard
                label="Block Rate"
                value={`${blockRate}%`}
                subValue="Last 24h"
                color="amber"
            />

            <KPICard
                label="AI Threat Index"
                value={aiThreatLevel.toUpperCase()}
                subValue={`Confidence: ${aiConfidence.toFixed(2)}`}
                color={getAiColor(aiThreatLevel)}
            />
        </div>
    );
};

export default KPICards;
