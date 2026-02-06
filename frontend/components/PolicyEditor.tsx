
import React, { useState } from 'react';
import { Policy } from '../types';
import { convertPoliciesToRules } from '../services/scaffoldService';

interface PolicyEditorProps {
  policies: Policy[];
  onAddPolicy: (policy: Policy) => void;
  onClearPolicies: () => void;
  onDeletePolicy?: (id: string) => void;
  compact?: boolean;
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({ policies = [], onAddPolicy, onClearPolicies, onDeletePolicy, compact = false }) => {
  const [naturalInput, setNaturalInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSynthesize = async () => {
    if (!naturalInput.trim()) return;
    setIsProcessing(true);

    // Simulate AI thinking time for effect
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPolicy = await convertPoliciesToRules(naturalInput);
    onAddPolicy(newPolicy);
    setNaturalInput('');
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-[400px] animate-luxe">
      <div className="flex-1 overflow-y-auto mb-6 pr-2 custom-scrollbar space-y-3">
        {policies.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-veil-text-muted/20 border-2 border-dashed border-veil-border/10 rounded-2xl bg-veil-bg/20">
            <span className="font-mono text-[10px] uppercase tracking-widest mb-2">Policy Matrix Empty</span>
            <p className="text-[12px] text-center max-w-xs text-veil-text-muted/50">Define governance rules using natural language below.</p>
          </div>
        ) : (
          policies.map((policy) => (
            <div key={policy.id} className="group p-4 bg-veil-card/40 border border-veil-border/30 hover:border-veil-accent/50 transition-all rounded-lg relative hover:shadow-[0_0_15px_rgba(0,240,255,0.1)]">
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-veil-accent uppercase tracking-widest">{policy.id}</span>
                {onDeletePolicy && (
                  <button onClick={() => onDeletePolicy(policy.id)} className="text-veil-text-muted/30 hover:text-veil-alert transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                )}
              </div>
              <p className="text-[13px] text-veil-text-secondary font-medium leading-relaxed">{policy.naturalLanguage}</p>

              <div className="mt-3 pt-3 border-t border-veil-border/20 grid grid-cols-2 gap-2">
                {policy.structuredRules?.rules.map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${rule.severity === 'high' ? 'bg-veil-alert shadow-[0_0_5px_#ff3b30]' : 'bg-veil-warning shadow-[0_0_5px_#ff9500]'}`}></div>
                    <span className="text-[9px] uppercase font-bold text-veil-text-muted/60 truncate">{rule.description || 'Rule Condition'}</span>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-4">
        <div className="relative group">
          <textarea
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder="Describe new governance policies..."
            className="w-full bg-veil-bg/40 border border-veil-border/30 p-4 text-[13px] text-veil-text-primary focus:border-veil-accent outline-none transition-all h-24 resize-none rounded-xl placeholder:text-veil-text-muted/30"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSynthesize();
              }
            }}
          />
          <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-veil-accent to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity blur-[1px]"></div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleSynthesize}
            disabled={isProcessing || !naturalInput.trim()}
            className={`flex-1 neon-button primary text-[11px] font-bold flex items-center justify-center gap-2 ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
          >
            {isProcessing ? (
              <>
                <div className="w-3 h-3 border-2 border-veil-accent/30 border-t-veil-accent rounded-full animate-spin"></div>
                <span>SYNTHESIZING PROTOCOLS...</span>
              </>
            ) : (
              <>
                <span>INITIALIZE POLICY</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </>
            )}
          </button>

          {policies.length > 0 && (
            <button onClick={onClearPolicies} className="px-4 border border-veil-border/30 hover:bg-veil-alert/10 hover:border-veil-alert/40 hover:text-veil-alert transition-colors text-veil-text-muted/40 uppercase text-[10px] font-bold tracking-widest rounded-lg">
              Clear
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyEditor;
