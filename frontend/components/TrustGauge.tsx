
import React from 'react';
import { AuditLogEntry } from '../types';

interface TrustGaugeProps {
  logs: AuditLogEntry[];
  activeAgentId: string | null;
}

const TrustGauge: React.FC<TrustGaugeProps> = ({ logs, activeAgentId }) => {
  const relevantLogs = activeAgentId ? logs.filter(l => l.agentId === activeAgentId) : logs;

  const calculateTrustScore = () => {
    if (relevantLogs.length === 0) return 100;
    const recent = relevantLogs.slice(0, 10);
    const riskSum = recent.reduce((acc, curr) => acc + curr.evaluation.riskScore, 0);
    return Math.max(0, 100 - (riskSum / recent.length));
  };

  const score = Math.round(calculateTrustScore());

  // Design System Colors (Electric Cyan focus)
  const isHighRisk = score < 50;
  const isOptimal = score > 85;

  const mainColor = isHighRisk ? '#ff3b30' : '#00f0ff';
  const label = isOptimal ? 'OPTIMAL' : isHighRisk ? 'CRITICAL' : 'STABLE';

  // SVG Gauge Math
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - ((score / 100) * circumference);

  return (
    <div className="flex flex-col items-center justify-center w-full animate-luxe">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-[40px] opacity-20 transition-colors duration-1000"
          style={{ backgroundColor: mainColor }}
        ></div>

        <svg className="w-full h-full transform -rotate-90 relative z-10" viewBox="0 0 128 128">
          {/* Background Circle */}
          <circle cx="64" cy="64" r={radius} className="stroke-white/5" strokeWidth="6" fill="none" />

          {/* Value Circle */}
          <circle
            cx="64" cy="64" r={radius}
            style={{
              stroke: mainColor,
              strokeDasharray: circumference,
              strokeDashoffset: offset,
              filter: `drop-shadow(0 0 8px ${mainColor})`
            }}
            className="transition-all duration-1000 ease-out"
            strokeWidth="6"
            fill="none"
            strokeLinecap="square"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
          <div className="flex flex-col items-center -gap-2">
            <span className="text-[54px] font-black italic tracking-tighter leading-none text-white transition-all duration-1000 drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
              {score}
            </span>
            <span
              className="text-[10px] font-black uppercase tracking-[0.4em] transition-colors duration-1000 shadow-black drop-shadow-md"
              style={{ color: mainColor }}
            >
              {label}
            </span>
          </div>
        </div>

        {/* Technical Corner Accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>
      </div>

      <div className="grid grid-cols-2 gap-[1px] bg-white/5 w-full mt-10 border border-white/5 overflow-hidden backdrop-blur-sm">
        <div className="bg-black/40 p-4 text-center">
          <div className="text-[18px] font-black italic text-white leading-none">{relevantLogs.length}</div>
          <div className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mt-2">Packets</div>
        </div>
        <div className="bg-black/40 p-4 text-center">
          <div className="text-[18px] font-black italic text-[#ff3b30] leading-none">
            {relevantLogs.filter(l => l.evaluation.decision === 'deny').length}
          </div>
          <div className="text-[9px] text-white/30 uppercase font-black tracking-[0.2em] mt-2">Intercepts</div>
        </div>
      </div>
    </div>
  );
};

export default TrustGauge;
