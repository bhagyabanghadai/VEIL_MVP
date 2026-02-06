
import React, { useState } from 'react';
import { AuditLogEntry, Agent, Resolution } from '../types';

interface AuditLogProps {
  entries: AuditLogEntry[];
  agents: Agent[];
  onClearLogs: () => void;
  onResolveEntry: (id: string, resolution: Resolution) => void;
  compact?: boolean;
}

const AuditLog: React.FC<AuditLogProps> = ({ entries = [], agents = [], onClearLogs, onResolveEntry, compact = false }) => {
  const [selectedEntry, setSelectedEntry] = useState<AuditLogEntry | null>(null);
  const [resolutionNote, setResolutionNote] = useState('');

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || 'Unknown Agent';

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const handleResolution = (status: 'overridden' | 'confirmed_block') => {
    if (!selectedEntry || !onResolveEntry) return;
    onResolveEntry(selectedEntry.id, {
      status,
      notes: resolutionNote,
      timestamp: new Date().toISOString(),
      resolver: 'SENTINEL_ROOT'
    });
    setResolutionNote('');
    setSelectedEntry(null);
  };

  const downloadCSV = () => {
    const headers = ['Timestamp', 'Agent', 'Action Type', 'Action Content', 'Decision', 'Risk Score', 'Resolution'];
    const rows = entries.map(e => [
      e.createdAt,
      getAgentName(e.agentId),
      e.action.type,
      `"${(e.action.rawInput || '').replace(/"/g, '""')}"`,
      e.evaluation.decision,
      e.evaluation.riskScore,
      e.resolution ? `${e.resolution.status}: ${e.resolution.notes}` : ''
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `passport_audit_trace_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-transparent animate-luxe">
      <div className="flex items-center justify-between px-10 py-5 border-b border-veil-border/30 bg-veil-sub/30 relative overflow-hidden backdrop-blur-md">
        <div className="absolute inset-0 bg-white/[0.01] scanline opacity-5"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-1.5 h-1.5 bg-veil-accent rounded-full animate-pulse"></div>
          <span className="text-[11px] font-bold text-veil-text-muted/60 uppercase tracking-[0.2em]">{entries.length} Operational Packets.</span>
        </div>
        <button onClick={downloadCSV} className="text-[11px] font-bold text-veil-accent uppercase tracking-[0.2em] hover:text-white flex items-center gap-2 transition-all relative z-10">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export_Stream
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-24 text-veil-text-muted/20">
          <div className="w-16 h-16 border border-veil-border/30 rotate-45 mb-8 flex items-center justify-center">
            <div className="w-8 h-8 border border-veil-border/20"></div>
          </div>
          <span className="text-[12px] font-bold uppercase tracking-[0.4em]">Zero Events in Buffer</span>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto custom-scrollbar bg-veil-bg/20">
          <ul className="divide-y divide-veil-border/10">
            {entries.slice().reverse().map((entry) => (
              <li
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="px-10 py-8 hover:bg-veil-accent/5 cursor-pointer transition-all group relative border-l-4 border-transparent hover:border-veil-accent"
              >
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[10px] font-mono font-bold text-veil-text-muted/50 tracking-widest">{formatTime(entry.createdAt)}</span>
                  <div className={`px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ${entry.evaluation.decision === 'deny' ? 'border-veil-alert/40 text-veil-alert bg-veil-alert/5' :
                    entry.evaluation.decision === 'allow' ? 'border-veil-success/40 text-veil-success bg-veil-success/5' :
                      'border-veil-warning/40 text-veil-warning bg-veil-warning/5'
                    }`}>
                    {entry.evaluation.decision}
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-2">
                  <span className="text-[20px] font-black italic uppercase tracking-tighter text-veil-text-primary group-hover:text-veil-accent transition-colors">{getAgentName(entry.agentId)}</span>
                  {entry.resolution && (
                    <div className="w-2 h-2 bg-veil-accent shadow-[0_0_8px_#0051ff]" title="Resolved"></div>
                  )}
                </div>

                <p className="text-[13px] text-veil-text-secondary font-bold uppercase tracking-widest line-clamp-1 opacity-70 group-hover:opacity-100 transition-opacity">
                  {entry.action.type === 'image' ? ':: ENCRYPTED_VISUAL_STREAM ::' : entry.action.rawInput}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* DETAIL DRAWER */}
      {selectedEntry && (
        <div className="fixed inset-0 z-[200] flex justify-end">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 animate-in fade-in" onClick={() => setSelectedEntry(null)}></div>

          {/* Panel */}
          <div className="relative w-full max-w-xl bg-veil-bg border-l border-veil-border/30 shadow-2xl h-full flex flex-col animate-in slide-in-from-right duration-500 overflow-hidden">
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none"></div>

            <div className="px-10 py-10 border-b border-veil-border/30 flex justify-between items-center bg-veil-sub/50 relative z-10 backdrop-blur-md">
              <div className="flex flex-col gap-1">
                <h2 className="text-[24px] font-black italic uppercase tracking-tighter text-veil-text-primary">Packet Inspection.</h2>
                <span className="text-[10px] font-mono text-veil-text-muted/30 uppercase tracking-[0.2em]">{selectedEntry.id}</span>
              </div>
              <button onClick={() => setSelectedEntry(null)} className="p-2 rounded border border-veil-border/30 hover:border-veil-accent/50 hover:text-veil-accent transition-all">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-10 space-y-12 overflow-y-auto custom-scrollbar min-h-0 bg-veil-bg relative z-10">

              {/* 1. Verdict & Risk */}
              <div className="grid grid-cols-2 gap-8">
                <div className={`p-8 border bg-veil-card/50 transition-all ${selectedEntry.evaluation.decision === 'allow' ? 'border-veil-success/20' :
                  selectedEntry.evaluation.decision === 'deny' ? 'border-veil-alert/20' : 'border-veil-warning/20'
                  }`}>
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-veil-text-muted/40 mb-4">Verdict Verdict</span>
                  <span className={`text-[48px] font-black italic tracking-tighter leading-none ${selectedEntry.evaluation.decision === 'allow' ? 'text-veil-success' :
                    selectedEntry.evaluation.decision === 'deny' ? 'text-veil-alert' : 'text-veil-warning'
                    }`}>{selectedEntry.evaluation.decision.toUpperCase()}.</span>
                </div>
                <div className="p-8 border border-veil-border/10 bg-veil-card/50">
                  <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-veil-text-muted/40 mb-4">Risk Variance</span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-[48px] font-black italic text-veil-text-primary leading-none">{selectedEntry.evaluation.riskScore}</span>
                    <span className="text-[14px] font-black text-veil-text-muted/30 uppercase italic">/10 pts</span>
                  </div>
                </div>
              </div>

              {/* 2. Payload */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-veil-text-muted/60 uppercase tracking-widest">Input Protocol Stream</span>
                  <div className="flex-1 h-[1px] bg-veil-border/10"></div>
                </div>
                <div className="bg-veil-sub/20 border border-veil-border/20 p-8 text-[15px] font-mono text-veil-text-secondary whitespace-pre-wrap leading-relaxed">
                  {selectedEntry.action.type === 'image' ? (
                    <div className="flex flex-col items-center gap-6">
                      <img src={`data:${selectedEntry.action.mimeType};base64,${selectedEntry.action.rawInput}`} className="max-h-80 border border-veil-border/30 shadow-2xl" />
                      <span className="text-[11px] font-mono text-veil-text-muted/40 uppercase tracking-widest italic">Decrypted Visual Buffer Pattern</span>
                    </div>
                  ) : selectedEntry.action.rawInput}
                </div>
              </div>

              {/* 3. Logic Trace */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-veil-text-muted/60 uppercase tracking-widest">Governance Logic Trace</span>
                  <div className="flex-1 h-[1px] bg-veil-border/10"></div>
                </div>
                <ul className="space-y-4">
                  {selectedEntry.evaluation.reasons.map((r, i) => (
                    <li key={i} className="text-[14px] text-veil-text-secondary/80 font-bold italic flex gap-6 leading-relaxed p-6 bg-veil-sub/10 border border-veil-border/10">
                      <div className="mt-1.5 w-1.5 h-1.5 bg-veil-accent shrink-0"></div>
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 4. Resolution */}
              <div className="pt-10 border-t border-veil-border/20">
                <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-veil-text-muted/30 mb-8">Security Resolution Override</h4>

                {selectedEntry.resolution ? (
                  <div className="bg-veil-accent/5 border border-veil-accent/20 p-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                      <span className="text-[9px] font-mono uppercase tracking-widest">RESOLVED</span>
                    </div>
                    <div className="flex justify-between items-center mb-6">
                      <span className={`text-[12px] font-black italic uppercase tracking-widest ${selectedEntry.resolution.status === 'overridden' ? 'text-veil-success' : 'text-veil-alert'
                        }`}>
                        {selectedEntry.resolution.status.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] font-mono text-veil-text-muted/40">{formatTime(selectedEntry.resolution.timestamp)}</span>
                    </div>
                    <p className="text-[18px] text-veil-text-primary font-bold italic leading-relaxed">"{selectedEntry.resolution.notes}"</p>
                    <div className="mt-8 text-[10px] font-black uppercase tracking-[0.4em] text-veil-text-muted/20">Authorized by:: {selectedEntry.resolution.resolver}</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <textarea
                      className="w-full text-[16px] p-8 bg-veil-bg border border-veil-border/30 text-veil-text-primary font-mono placeholder:text-veil-text-muted/20 transition-all outline-none resize-none focus:border-veil-accent/50"
                      placeholder="Enter override justification..."
                      rows={4}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-6">
                      <button
                        onClick={() => handleResolution('confirmed_block')}
                        disabled={!resolutionNote}
                        className="py-4 text-[11px] font-bold uppercase tracking-widest border border-veil-alert/30 text-veil-alert hover:bg-veil-alert/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        CONFIRM_BLOCK
                      </button>
                      <button
                        onClick={() => handleResolution('overridden')}
                        disabled={!resolutionNote}
                        className="py-4 text-[11px] font-bold uppercase tracking-widest border border-veil-accent/30 text-veil-accent hover:bg-veil-accent/10 transition-colors disabled:opacity-20 disabled:cursor-not-allowed"
                      >
                        OVERRIDE_ACCESS
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 5. Signature Meta */}
              <div className="pt-12 text-[9px] font-mono text-veil-text-muted/20 space-y-2 uppercase tracking-widest">
                <div>SIG_INTEGRITY:: {selectedEntry.evaluation.signature}</div>
                <div>LIFECYCLE_TS:: {selectedEntry.createdAt}</div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
