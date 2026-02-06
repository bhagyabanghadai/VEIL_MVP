import React, { useState } from 'react';
import { AuditLogEntry, Agent, Resolution } from '../../types';
import AuditLog from '../AuditLog';
import { Database, Download, FileJson } from 'lucide-react';

interface LogsPageProps {
    auditLog: AuditLogEntry[];
    agents: Agent[];
    onClearLogs: () => void;
    onResolveEntry: (id: string, resolution: Resolution) => void;
}

import ConfirmationModal from '../ui/confirmation-modal';

const LogsPage: React.FC<LogsPageProps> = ({ auditLog, agents, onClearLogs, onResolveEntry }) => {
    const [showPurgeConfirm, setShowPurgeConfirm] = useState(false);

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLog, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", `veil_audit_log_${Date.now()}.json`);
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    return (
        <div className="flex flex-col gap-8 h-full max-w-6xl mx-auto w-full">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                        Neural <span className="text-[#00f0ff]">Ledger</span>.
                    </h1>
                    <p className="text-white/50 font-mono text-sm max-w-md">
                        Immutable record of all agent decisions and policy evaluations.
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white border border-white/10 rounded-lg transition-colors text-xs font-mono uppercase tracking-wider"
                    >
                        <Download size={14} />
                        Export JSON
                    </button>
                    <button
                        onClick={() => setShowPurgeConfirm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-red-500/5 hover:bg-red-500/10 text-red-500/70 hover:text-red-500 border border-red-500/10 hover:border-red-500/30 rounded-lg transition-colors text-xs font-mono uppercase tracking-wider"
                    >
                        <Database size={14} />
                        Purge Logs
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-black border border-white/10 rounded-xl overflow-hidden flex flex-col shadow-2xl">
                <div className="flex-1 overflow-y-auto p-0">
                    <AuditLog
                        entries={auditLog}
                        agents={agents}
                        onClearLogs={onClearLogs}
                        onResolveEntry={onResolveEntry}
                        compact={false}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={showPurgeConfirm}
                title="Purge Neural Ledger?"
                message="This will permanently delete all audit logs. This action cannot be undone and may violate compliance requirements if executed without backup."
                confirmText="Purge All Logs"
                isDestructive={true}
                onConfirm={onClearLogs}
                onCancel={() => setShowPurgeConfirm(false)}
            />
        </div>
    );
};

export default LogsPage;
