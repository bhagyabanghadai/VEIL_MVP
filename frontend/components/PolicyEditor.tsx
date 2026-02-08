import React, { useState } from 'react';
import { Policy } from '../types';
import { convertPoliciesToRules } from '../services/scaffoldService';
import { Plus, Trash2, FileText, Loader2 } from 'lucide-react';
import { cn } from '../lib/utils';

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

    await new Promise(resolve => setTimeout(resolve, 800));

    const newPolicy = await convertPoliciesToRules(naturalInput);
    onAddPolicy(newPolicy);
    setNaturalInput('');
    setIsProcessing(false);
  };

  return (
    <div className="flex flex-col h-[450px]">
      {/* Policy List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {policies.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 p-8">
            <FileText className="w-10 h-10 mb-3 text-slate-300" />
            <span className="text-sm font-medium">No Policies Defined</span>
            <p className="text-xs text-slate-400 text-center mt-1 max-w-xs">
              Define governance rules using natural language below.
            </p>
          </div>
        ) : (
          policies.map((policy) => (
            <div
              key={policy.id}
              className="group p-4 bg-white border border-slate-200 hover:border-cyan-300 transition-all rounded-xl shadow-sm hover:shadow-md"
            >
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-wider font-semibold">
                  {policy.id}
                </span>
                {onDeletePolicy && (
                  <button
                    onClick={() => onDeletePolicy(policy.id)}
                    className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
              <p className="text-sm text-slate-700 font-medium leading-relaxed">
                {policy.naturalLanguage}
              </p>

              {policy.structuredRules?.rules.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap gap-2">
                  {policy.structuredRules.rules.map((rule, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold",
                        rule.severity === 'high'
                          ? 'bg-rose-100 text-rose-700'
                          : 'bg-amber-100 text-amber-700'
                      )}
                    >
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        rule.severity === 'high' ? 'bg-rose-500' : 'bg-amber-500'
                      )} />
                      {rule.description || 'Rule'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="space-y-3">
        <div className="relative">
          <textarea
            value={naturalInput}
            onChange={(e) => setNaturalInput(e.target.value)}
            placeholder="Describe new governance policies in natural language..."
            className="w-full bg-white border border-slate-200 p-4 text-sm text-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 outline-none transition-all h-24 resize-none rounded-xl placeholder:text-slate-400"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSynthesize();
              }
            }}
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSynthesize}
            disabled={isProcessing || !naturalInput.trim()}
            className={cn(
              "flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all",
              isProcessing || !naturalInput.trim()
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-cyan-600 text-white hover:bg-cyan-700"
            )}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Policy</span>
              </>
            )}
          </button>

          {policies.length > 0 && (
            <button
              onClick={onClearPolicies}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-500 hover:border-rose-300 hover:text-rose-600 hover:bg-rose-50 transition-all text-sm font-medium"
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PolicyEditor;
