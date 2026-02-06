import React, { useState } from 'react';
import { Policy } from '../../types';
import PolicyEditor from '../PolicyEditor';
import { ShieldAlert } from 'lucide-react';

interface PoliciesPageProps {
    policies: Policy[];
    onAddPolicy: (policy: Policy) => void;
    onDeletePolicy: (id: string) => void;
    onClearPolicies: () => void;
}

import ConfirmationModal from '../ui/confirmation-modal';

const PoliciesPage: React.FC<PoliciesPageProps> = ({ policies, onAddPolicy, onDeletePolicy, onClearPolicies }) => {
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    return (
        <div className="flex flex-col gap-8 h-full max-w-5xl mx-auto w-full">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black italic tracking-tighter text-white mb-2">
                        Governance <span className="text-[#00f0ff]">Matrix</span>.
                    </h1>
                    <p className="text-white/50 font-mono text-sm">
                        Define constraints and behavioral inhibitors for all active nodes.
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-mono text-[#00f0ff] font-bold">{policies.length}</div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest">Active Protocols</div>
                </div>
            </div>

            <div className="flex-1 bg-[#050505] border border-white/10 rounded-xl p-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-32 bg-[#00f0ff] opacity-[0.02] rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/2" />

                <PolicyEditor
                    policies={policies}
                    onAddPolicy={onAddPolicy}
                    onDeletePolicy={(id) => setDeleteId(id)}
                    onClearPolicies={() => setShowClearConfirm(true)}
                    compact={false}
                />

                {policies.length === 0 && (
                    <div className="mt-8 p-4 bg-yellow-500/5 border border-yellow-500/10 rounded flex items-start gap-4">
                        <ShieldAlert className="text-yellow-500/50 shrink-0 mt-0.5" size={18} />
                        <div>
                            <h4 className="text-yellow-500/80 text-sm font-bold mb-1">Unrestricted Environment</h4>
                            <p className="text-yellow-500/50 text-xs leading-relaxed">
                                No active policies detected. Agents are currently operating with unrestricted autonomy.
                                It is recommended to establish at least one baseline constraint (e.g. data egress limits).
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Confirm Delete Policy */}
            <ConfirmationModal
                isOpen={!!deleteId}
                title="Delete Policy?"
                message="Are you sure you want to remove this governance protocol? Agents relying on this policy will revert to default behaviors."
                confirmText="Delete Policy"
                isDestructive={true}
                onConfirm={() => {
                    if (deleteId) onDeletePolicy(deleteId);
                }}
                onCancel={() => setDeleteId(null)}
            />

            {/* Confirm Clear All */}
            <ConfirmationModal
                isOpen={showClearConfirm}
                title="Purge All Policies?"
                message="WARNING: This will remove ALL governance protocols. All agents will immediately become unrestricted. This action is extremely risky."
                confirmText="PURGE ALL"
                isDestructive={true}
                onConfirm={onClearPolicies}
                onCancel={() => setShowClearConfirm(false)}
            />
        </div>
    );
};

export default PoliciesPage;
