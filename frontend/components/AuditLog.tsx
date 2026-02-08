import React, { useState } from 'react';
import { AuditLogEntry, Agent, Resolution } from '../types';
import { Download, X, CheckCircle, XCircle, AlertTriangle, Search, Clock, FileText } from 'lucide-react';
import { cn } from '../lib/utils';

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

  const getAgentName = (id: string) => agents.find(a => a.id === id)?.name || 'System';

  const formatTime = (iso: string) => {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  };

  const handleResolution = (status: 'overridden' | 'confirmed_block') => {
    if (!selectedEntry || !onResolveEntry) return;
    onResolveEntry(selectedEntry.id, {
      status,
      notes: resolutionNote,
      timestamp: new Date().toISOString(),
      resolver: 'Admin'
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
    link.download = `veil_audit_log_${new Date().toISOString()}.csv`;
    link.click();
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 text-cyan-600" />
          <span className="text-sm font-semibold text-slate-800">{entries.length} Audit Entries</span>
        </div>
        <button
          onClick={downloadCSV}
          className="flex items-center gap-2 text-sm font-medium text-cyan-600 hover:text-cyan-700 transition-colors"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* List */}
      {entries.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-slate-400">
          <Clock className="w-12 h-12 mb-4 text-slate-300" />
          <span className="text-sm font-medium">No Events Logged</span>
          <p className="text-xs mt-1">Events will appear here when processed</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-slate-100">
            {entries.slice().reverse().map((entry) => (
              <li
                key={entry.id}
                onClick={() => setSelectedEntry(entry)}
                className="px-6 py-4 hover:bg-slate-50 cursor-pointer transition-all group"
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-mono text-slate-400">{formatTime(entry.createdAt)}</span>
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold uppercase",
                    entry.evaluation.decision === 'deny' ? 'bg-rose-100 text-rose-700' :
                      entry.evaluation.decision === 'allow' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                  )}>
                    {entry.evaluation.decision}
                  </span>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-slate-800 group-hover:text-cyan-600 transition-colors">
                    {getAgentName(entry.agentId)}
                  </span>
                  {entry.resolution && (
                    <div className="w-2 h-2 rounded-full bg-cyan-500" title="Resolved" />
                  )}
                </div>

                <p className="text-sm text-slate-500 truncate">
                  {entry.action.type === 'image' ? '[Image Data]' : entry.action.rawInput}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Detail Drawer */}
      {selectedEntry && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setSelectedEntry(null)}
          />

          {/* Panel */}
          <div className="relative w-full max-w-xl bg-white shadow-2xl h-full flex flex-col z-10">
            {/* Panel Header */}
            <div className="px-6 py-5 border-b border-slate-200 flex justify-between items-center bg-slate-50">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Entry Details</h2>
                <span className="text-xs font-mono text-slate-400">{selectedEntry.id}</span>
              </div>
              <button
                onClick={() => setSelectedEntry(null)}
                className="p-2 rounded-lg hover:bg-slate-200 transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Panel Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Verdict & Risk */}
              <div className="grid grid-cols-2 gap-4">
                <div className={cn(
                  "p-5 rounded-xl border",
                  selectedEntry.evaluation.decision === 'allow' ? 'bg-emerald-50 border-emerald-200' :
                    selectedEntry.evaluation.decision === 'deny' ? 'bg-rose-50 border-rose-200' :
                      'bg-amber-50 border-amber-200'
                )}>
                  <span className="text-xs font-semibold uppercase text-slate-500">Verdict</span>
                  <div className={cn(
                    "text-2xl font-bold mt-1",
                    selectedEntry.evaluation.decision === 'allow' ? 'text-emerald-700' :
                      selectedEntry.evaluation.decision === 'deny' ? 'text-rose-700' :
                        'text-amber-700'
                  )}>
                    {selectedEntry.evaluation.decision.toUpperCase()}
                  </div>
                </div>
                <div className="p-5 rounded-xl border border-slate-200 bg-slate-50">
                  <span className="text-xs font-semibold uppercase text-slate-500">Risk Score</span>
                  <div className="text-2xl font-bold text-slate-800 mt-1">
                    {selectedEntry.evaluation.riskScore}<span className="text-sm text-slate-400">/100</span>
                  </div>
                </div>
              </div>

              {/* Payload */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Input Content</span>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-sm text-slate-700 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {selectedEntry.action.type === 'image' ? (
                    <img
                      src={`data:${selectedEntry.action.mimeType};base64,${selectedEntry.action.rawInput}`}
                      className="max-h-32 rounded border"
                      alt="Visual input"
                    />
                  ) : selectedEntry.action.rawInput}
                </div>
              </div>

              {/* Reasons */}
              <div className="space-y-2">
                <span className="text-xs font-semibold uppercase text-slate-500">Analysis</span>
                <ul className="space-y-2">
                  {selectedEntry.evaluation.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-1.5 shrink-0" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resolution */}
              <div className="pt-4 border-t border-slate-200">
                <span className="text-xs font-semibold uppercase text-slate-500 block mb-3">Resolution</span>

                {selectedEntry.resolution ? (
                  <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className={cn(
                        "text-sm font-semibold",
                        selectedEntry.resolution.status === 'overridden' ? 'text-emerald-700' : 'text-rose-700'
                      )}>
                        {selectedEntry.resolution.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400">{formatTime(selectedEntry.resolution.timestamp)}</span>
                    </div>
                    <p className="text-sm text-slate-700">"{selectedEntry.resolution.notes}"</p>
                    <div className="mt-2 text-xs text-slate-400">By: {selectedEntry.resolution.resolver}</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <textarea
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none resize-none"
                      placeholder="Enter resolution notes..."
                      rows={3}
                      value={resolutionNote}
                      onChange={(e) => setResolutionNote(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => handleResolution('confirmed_block')}
                        disabled={!resolutionNote}
                        className="py-2.5 text-sm font-medium rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Confirm Block
                      </button>
                      <button
                        onClick={() => handleResolution('overridden')}
                        disabled={!resolutionNote}
                        className="py-2.5 text-sm font-medium rounded-xl border border-cyan-200 text-cyan-600 hover:bg-cyan-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                      >
                        Override Allow
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLog;
