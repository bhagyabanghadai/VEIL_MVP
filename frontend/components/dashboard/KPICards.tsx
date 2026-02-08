import React, { useEffect, useState, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
    label: string;
    value: string | number;
    subValue?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    color?: 'cyan' | 'green' | 'amber' | 'red' | 'blue';
    icon?: React.ReactNode;
    sparklineData?: number[];
}

// Animated number counter hook
const useAnimatedNumber = (target: number, duration: number = 1000) => {
    const [current, setCurrent] = useState(0);
    const startRef = useRef<number>(0);
    const startTimeRef = useRef<number>();
    const rafRef = useRef<number>();

    useEffect(() => {
        startRef.current = current;
        startTimeRef.current = undefined;

        const animate = (timestamp: number) => {
            if (!startTimeRef.current) startTimeRef.current = timestamp;
            const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);

            // Easing function (ease-out)
            const eased = 1 - Math.pow(1 - progress, 3);
            const newValue = startRef.current + (target - startRef.current) * eased;

            setCurrent(newValue);

            if (progress < 1) {
                rafRef.current = requestAnimationFrame(animate);
            }
        };

        rafRef.current = requestAnimationFrame(animate);
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [target, duration]);

    return current;
};

// Mini sparkline component
const Sparkline: React.FC<{ data: number[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data, 1);
    const min = Math.min(...data, 0);
    const range = max - min || 1;

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * 60;
        const y = 20 - ((val - min) / range) * 18;
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg className="w-16 h-6 opacity-60" viewBox="0 0 60 24">
            <polyline
                fill="none"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={points}
            />
            {/* Gradient fill under the line */}
            <defs>
                <linearGradient id={`grad-${color}`} x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            <polygon
                fill={`url(#grad-${color})`}
                points={`0,24 ${points} 60,24`}
            />
        </svg>
    );
};

const KPICard: React.FC<KPICardProps> = ({
    label,
    value,
    subValue,
    trend = 'neutral',
    trendValue,
    color = 'cyan',
    sparklineData,
}) => {
    const colorMap = {
        cyan: {
            gradient: 'from-cyan-500/20 via-cyan-500/10 to-transparent',
            border: 'border-cyan-500/30 hover:border-cyan-500/50',
            text: 'text-cyan-400',
            sparkline: '#22d3ee',
            glow: 'hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]',
        },
        green: {
            gradient: 'from-emerald-500/20 via-emerald-500/10 to-transparent',
            border: 'border-emerald-500/30 hover:border-emerald-500/50',
            text: 'text-emerald-400',
            sparkline: '#34d399',
            glow: 'hover:shadow-[0_0_30px_rgba(16,185,129,0.2)]',
        },
        amber: {
            gradient: 'from-amber-500/20 via-amber-500/10 to-transparent',
            border: 'border-amber-500/30 hover:border-amber-500/50',
            text: 'text-amber-400',
            sparkline: '#fbbf24',
            glow: 'hover:shadow-[0_0_30px_rgba(245,158,11,0.2)]',
        },
        red: {
            gradient: 'from-red-500/20 via-red-500/10 to-transparent',
            border: 'border-red-500/30 hover:border-red-500/50',
            text: 'text-red-400',
            sparkline: '#f87171',
            glow: 'hover:shadow-[0_0_30px_rgba(239,68,68,0.2)]',
        },
        blue: {
            gradient: 'from-blue-500/20 via-blue-500/10 to-transparent',
            border: 'border-blue-500/30 hover:border-blue-500/50',
            text: 'text-blue-400',
            sparkline: '#60a5fa',
            glow: 'hover:shadow-[0_0_30px_rgba(59,130,246,0.2)]',
        },
    };

    const trendColors = {
        up: 'text-emerald-400',
        down: 'text-red-400',
        neutral: 'text-slate-400',
    };

    const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
    const styles = colorMap[color];

    // Generate random sparkline if not provided
    const defaultSparkline = Array.from({ length: 8 }, () => Math.random() * 100);

    return (
        <div className={`
            relative overflow-hidden rounded-xl 
            bg-gradient-to-br ${styles.gradient}
            border ${styles.border} ${styles.glow}
            backdrop-blur-sm p-4 
            transition-all duration-300 hover:scale-[1.02]
        `}>
            {/* Subtle animated background glow */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" />
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-white/3 rounded-full blur-xl" />

            <div className="relative">
                <div className="flex items-start justify-between mb-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        {label}
                    </p>
                    {sparklineData && (
                        <Sparkline data={sparklineData || defaultSparkline} color={styles.sparkline} />
                    )}
                </div>

                <div className="flex items-end justify-between">
                    <div>
                        <p className={`text-2xl font-bold tracking-tight tabular-nums ${styles.text}`}>
                            {value}
                        </p>
                        {subValue && (
                            <p className="text-[10px] text-slate-500 mt-1 font-mono">{subValue}</p>
                        )}
                    </div>

                    {trendValue && (
                        <div className={`flex items-center gap-1 text-xs font-mono ${trendColors[trend]}`}>
                            <TrendIcon className="w-3 h-3" />
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
    // Animate the risk score
    const animatedRiskScore = useAnimatedNumber(riskScore, 1200);

    const getRiskColor = (score: number): 'green' | 'amber' | 'red' => {
        if (score < 30) return 'green';
        if (score < 60) return 'amber';
        return 'red';
    };

    const getAiColor = (level: string): 'green' | 'amber' | 'red' => {
        if (level === 'minimal' || level === 'low') return 'green';
        if (level === 'moderate') return 'amber';
        return 'red';
    };

    // Risk score dots (5 dots, filled based on score)
    const riskDots = Math.ceil(riskScore / 20);

    // Sample sparkline data
    const riskSparkline = [20, 25, 22, 28, 24, 26, 23, riskScore];
    const mttdSparkline = [15, 14, 13, 12, 14, 13, 12, mttd];
    const mttrSparkline = [10, 9, 8, 9, 8, 7, 8, mttr];
    const blockSparkline = [2.5, 3.0, 3.2, 2.8, 3.5, 3.8, 3.4, blockRate];

    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <KPICard
                label="Risk Score"
                value={Math.round(animatedRiskScore)}
                subValue={`${'●'.repeat(riskDots)}${'○'.repeat(5 - riskDots)} /100`}
                color={getRiskColor(riskScore)}
                sparklineData={riskSparkline}
            />

            <KPICard
                label="MTTD (Detect)"
                value={`${mttd}ms`}
                trend="down"
                trendValue="-2ms"
                subValue="Excellent"
                color="cyan"
                sparklineData={mttdSparkline}
            />

            <KPICard
                label="MTTR (Respond)"
                value={`${mttr}ms`}
                trend="down"
                trendValue="-1ms"
                subValue="Excellent"
                color="blue"
                sparklineData={mttrSparkline}
            />

            <KPICard
                label="Block Rate"
                value={`${blockRate.toFixed(1)}%`}
                subValue="Last 24h"
                color="amber"
                sparklineData={blockSparkline}
            />

            <KPICard
                label="AI Threat Index"
                value={aiThreatLevel.toUpperCase()}
                subValue={`Confidence: ${(aiConfidence * 100).toFixed(0)}%`}
                color={getAiColor(aiThreatLevel)}
            />
        </div>
    );
};

export default KPICards;

