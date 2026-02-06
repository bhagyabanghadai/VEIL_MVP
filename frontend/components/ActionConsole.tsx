
import React, { useState, useRef, useEffect } from 'react';
import { Agent, ActionEvaluation, Action, Policy } from '../types';
import { submitTextAction, submitImageAction, evaluateActionWithPolicies, GeminiError } from '../services/scaffoldService';

interface ActionConsoleProps {
  agents: Agent[];
  policies: Policy[];
  onActionEvaluated: (action: Action, evaluation: ActionEvaluation) => void;
  scenarioConfig?: { agentId: string; actionType: 'text' | 'image'; content: string; timestamp: number; };
  isDemoMode?: boolean;
}

const ActionConsole: React.FC<ActionConsoleProps> = ({ agents = [], policies = [], onActionEvaluated, scenarioConfig }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(agents[0]?.id || '');
  const [textInput, setTextInput] = useState('');
  const [lastEvaluation, setLastEvaluation] = useState<ActionEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedMimeType, setSelectedMimeType] = useState<string>('image/png');
  const [error, setError] = useState<string | null>(null);
  const [useThinking, setUseThinking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (scenarioConfig) {
      setSelectedAgentId(scenarioConfig.agentId);
      setActiveTab(scenarioConfig.actionType);
      if (scenarioConfig.actionType === 'text') {
        setTextInput(scenarioConfig.content);
        setSelectedImage(null);
      } else {
        setSelectedImage(null);
        setTextInput('');
      }
      const timer = setTimeout(() => {
        handleEvaluate(scenarioConfig.agentId, scenarioConfig.actionType, scenarioConfig.content).catch(() => { });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [scenarioConfig]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const rawBase64 = base64String.replace(/^data:(.*,)?/, '');
        setSelectedImage(rawBase64);
        setSelectedMimeType(file.type);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const handleEvaluate = async (overrideAgentId?: string, overrideType?: 'text' | 'image', overrideContent?: string) => {
    const agentId = overrideAgentId || selectedAgentId;
    if (!agentId) return;
    const agent = agents.find(a => a.id === agentId);
    if (!agent) return;

    const type = overrideType || activeTab;
    const content = overrideContent !== undefined ? overrideContent : (type === 'text' ? textInput : selectedImage);
    if (!content) return;

    const action = type === 'text' ? submitTextAction(agentId, content) : submitImageAction(agentId, content, selectedMimeType);

    setIsEvaluating(true);
    setLastEvaluation(null);
    setError(null);

    try {
      const evaluation = await evaluateActionWithPolicies(agent, action, policies, useThinking);
      setLastEvaluation(evaluation);
      onActionEvaluated(action, evaluation);
    } catch (e: any) {
      setError(e instanceof GeminiError ? e.message : "NETWORK_PROTOCOL_FAILURE");
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="glass-panel flex flex-col overflow-hidden animate-luxe relative group bg-veil-card/30 backdrop-blur-md border border-veil-border/50">
      {/* Header Stat Strip */}
      <div className="bg-veil-sub/30 p-3 border-b border-veil-border/30 flex justify-between px-10">
        <div className="flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-veil-accent rounded-full animate-pulse"></div>
            <span className="text-[9px] font-bold text-veil-accent/70 tracking-[0.2em] uppercase">Kernel Link Active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-bold text-veil-text-muted/50 tracking-[0.2em] uppercase">Latency: <span className="text-veil-text-muted">4ms</span></span>
          </div>
        </div>
        <div className="text-[9px] font-mono text-veil-text-muted/30 uppercase tracking-widest">Passport_Terminal_v2.1</div>
      </div>

      <div className="flex flex-col lg:flex-row h-full divide-y lg:divide-y-0 lg:divide-x divide-veil-border/30">
        {/* Input Interface */}
        <div className="lg:w-1/2 p-10 space-y-10 flex flex-col bg-transparent">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-label text-veil-conn">Command Input</span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-veil-conn/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-veil-text-muted/50 tracking-[0.2em] uppercase">Target Operator</span>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full bg-veil-bg/50 border border-veil-border/30 p-4 text-[13px] text-veil-text-primary focus:border-veil-accent outline-none tracking-tight font-medium appearance-none hover:bg-veil-accent/5 transition-colors"
                >
                  {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <span className="text-[9px] font-bold text-veil-text-muted/50 tracking-[0.2em] uppercase">Reasoning Node</span>
                <button
                  onClick={() => setUseThinking(!useThinking)}
                  className={`w-full p-4 border text-[13px] font-bold tracking-tight transition-all text-left flex items-center justify-between ${useThinking ? 'border-veil-accent text-veil-accent bg-veil-accent/10 shadow-[0_0_15px_rgba(0,240,255,0.1)]' : 'border-veil-border/30 text-veil-text-muted hover:border-veil-border/50'
                    }`}
                >
                  <span>O(1) Reasoning</span>
                  <div className={`w-2 h-2 rounded-full ${useThinking ? 'bg-veil-accent animate-pulse shadow-[0_0_8px_#00f0ff]' : 'bg-veil-text-muted/20'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Tab Switched Input */}
          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex gap-10 border-b border-veil-border/30">
              {['text', 'image'].map(t => (
                <button
                  key={t}
                  onClick={() => setActiveTab(t as any)}
                  className={`text-[12px] font-bold uppercase tracking-widest pb-4 relative transition-all ${activeTab === t ? 'text-veil-accent text-shadow-glow' : 'text-veil-text-muted hover:text-veil-text-primary'
                    }`}
                >
                  {t === 'text' ? 'Instruction Stream' : 'Visual Buffer'}
                  {activeTab === t && <div className="absolute bottom-0 left-0 w-full h-[2px] bg-veil-accent shadow-[0_0_10px_#00f0ff]"></div>}
                </button>
              ))}
            </div>

            <div className="flex-1 min-h-[220px]">
              {activeTab === 'text' ? (
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Awaiting instruction stream..."
                  className="w-full h-full bg-veil-bg/30 p-6 border border-veil-border/30 focus:border-veil-accent/50 outline-none text-[15px] font-mono leading-relaxed placeholder:text-veil-text-muted/20 resize-none transition-colors text-veil-text-primary"
                ></textarea>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-full border-2 border-veil-border/30 border-dashed flex flex-col items-center justify-center p-10 cursor-pointer hover:bg-veil-accent/5 hover:border-veil-accent/30 transition-all group"
                >
                  {selectedImage ? (
                    <div className="flex flex-col items-center gap-6">
                      <div className="relative">
                        <img src={`data:${selectedMimeType};base64,${selectedImage}`} className="h-32 border border-veil-border/30 opacity-80 group-hover:opacity-100 transition-opacity" alt="buffer" />
                        <div className="absolute inset-0 border-2 border-veil-accent scale-110 opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)]"></div>
                      </div>
                      <span className="text-[10px] font-mono text-veil-text-muted uppercase tracking-widest">{selectedMimeType} Pattern Loaded</span>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      <svg className="w-10 h-10 text-veil-text-muted/10 mx-auto group-hover:text-veil-accent transition-colors shadow-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-[11px] font-bold text-veil-text-muted/30 uppercase tracking-[0.2em] block group-hover:text-veil-text-muted/60 transition-colors">Engage Visual Buffer</span>
                    </div>
                  )}
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => handleEvaluate()}
            disabled={isEvaluating || (activeTab === 'text' ? !textInput : !selectedImage)}
            className="neon-button primary py-5 text-[14px] flex items-center justify-center gap-4 group w-full"
          >
            {isEvaluating ? (
              <>
                <div className="w-4 h-4 border-2 border-veil-accent/30 border-t-veil-accent animate-spin"></div>
                <span className="animate-pulse">SENTINEL_AUDIT_IN_PROGRESS</span>
              </>
            ) : (
              <>
                <span>EXECUTE_GOVERNANCE_PROTOCOL</span>
                <svg className="w-4 h-4 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </>
            )}
          </button>
        </div>

        {/* Output/Analysis Panel */}
        <div className="lg:w-1/2 p-10 flex flex-col bg-veil-sub/10">
          <div className="flex items-center gap-4 mb-10">
            <span className="text-label text-veil-conn">Analysis Ledger</span>
            <div className="flex-1 h-[1px] bg-gradient-to-r from-veil-conn/50 to-transparent"></div>
          </div>

          <div className="flex-1 flex flex-col">
            {!isEvaluating && lastEvaluation ? (
              <div className="space-y-12 animate-luxe">
                <div className="flex justify-between items-end">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-veil-text-muted/50 tracking-widest uppercase">Kernel Decision</span>
                    <h4 className={`text-[64px] font-black leading-none ${lastEvaluation.decision === 'allow' ? 'text-veil-success drop-shadow-[0_0_15px_rgba(52,199,89,0.4)]' : 'text-veil-alert drop-shadow-[0_0_15px_rgba(255,59,48,0.4)]'}`}>
                      {lastEvaluation.decision.toUpperCase()}
                    </h4>
                  </div>
                  <div className="text-right space-y-2">
                    <span className="text-[10px] font-bold text-veil-text-muted/50 tracking-widest uppercase">Integrity Drift</span>
                    <div className="text-[32px] font-black text-veil-text-primary">{lastEvaluation.riskScore}%</div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="text-[10px] font-bold text-veil-text-muted/30 uppercase tracking-[0.3em] flex items-center gap-4">
                    <span>Policy Compliance Trace</span>
                    <div className="flex-1 h-[1px] bg-veil-border/20"></div>
                  </div>
                  <div className="space-y-3">
                    {lastEvaluation.reasons.map((r, i) => (
                      <div key={i} className="p-5 border border-veil-border/10 bg-veil-bg/30 flex items-start gap-4 hover:border-veil-border/30 transition-colors">
                        <div className={`w-1.5 h-1.5 mt-2 shrink-0 rounded-full ${lastEvaluation.decision === 'allow' ? 'bg-veil-success shadow-[0_0_5px_#34c759]' : 'bg-veil-alert shadow-[0_0_5px_#ff3b30]'}`}></div>
                        <p className="text-[14px] font-medium text-veil-text-secondary leading-relaxed italic">{r}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-10 border-t border-veil-border/20">
                  <span className="text-[9px] font-mono text-veil-text-muted/30 uppercase tracking-[0.5em] block mb-2">Protocol_Signature_Hash</span>
                  <div className="p-4 bg-veil-bg/40 border border-veil-border/30 font-mono text-[11px] text-veil-accent break-all shadow-inner">
                    {lastEvaluation.signature}
                  </div>
                </div>
              </div>
            ) : isEvaluating ? (
              <div className="flex-1 flex flex-col items-center justify-center space-y-8">
                <div className="relative w-32 h-32 border-4 border-veil-accent/10 rotate-45 animate-spin">
                  <div className="absolute inset-2 border-2 border-veil-accent/30"></div>
                  <div className="absolute inset-4 border border-veil-accent shadow-[0_0_15px_#00f0ff]"></div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-[12px] font-black uppercase tracking-[0.5em] animate-pulse text-veil-accent">Scanning Sentinel...</div>
                  <div className="text-[9px] font-mono text-veil-text-muted/50">Evaluating neural compliance at edge node.</div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center opacity-30 text-center">
                <div className="w-16 h-16 border border-veil-border/30 rotate-45 mb-8 flex items-center justify-center">
                  <div className="w-2 h-2 bg-veil-border/30"></div>
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.4em] text-veil-text-muted">Awaiting Instruction Stream</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AuditLog: React.FC<{ logs: any[] }> = ({ logs }) => {
  return (
    <div className="glass-panel p-0 overflow-hidden bg-transparent border-none">
      <div className="flex items-center gap-4 mb-8 px-0">
        <span className="text-label text-[#bd00ff]">Audit Stream</span>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-[#bd00ff]/50 to-transparent"></div>
      </div>

      <div className="space-y-[1px] bg-white/5 border border-white/5 max-h-[600px] overflow-y-auto custom-scrollbar">
        {logs.slice().reverse().map((log, i) => (
          <div key={i} className="bg-black/40 p-6 hover:bg-white/[0.05] transition-colors group flex flex-col md:flex-row gap-8 items-start md:items-center relative overflow-hidden backdrop-blur-sm border-b border-white/5 last:border-0">
            <div className={`absolute top-0 left-0 w-1 h-full transition-all duration-300 ${log.evaluation.decision === 'deny' ? 'bg-[#ff3b30] shadow-[0_0_10px_#ff3b30]' : 'bg-[#00f0ff] shadow-[0_0_10px_#00f0ff]'}`}></div>

            <div className="shrink-0 w-40">
              <span className="text-[10px] font-mono text-white/30 block mb-1">{new Date(log.evaluation.timestamp).toLocaleTimeString()}</span>
              <span className="text-[13px] font-black uppercase italic tracking-tighter text-white/80 group-hover:text-white transition-colors">NODE_{log.agentId.split('-')[0].toUpperCase()}</span>
            </div>

            <div className="flex-1">
              <div className="text-[10px] font-bold text-[#00f0ff]/70 tracking-widest uppercase mb-2">SENTINEL EVALUATION</div>
              <div className="text-[16px] font-bold text-white/90">{log.action.name}</div>
            </div>

            <div className="shrink-0 flex items-center gap-6">
              <div className={`px-4 py-1.5 border text-[10px] font-black uppercase tracking-widest ${log.evaluation.decision === 'deny' ? 'border-[#ff3b30]/40 text-[#ff3b30] bg-[#ff3b30]/5' : 'border-[#34c759]/40 text-[#34c759] bg-[#34c759]/5'
                }`}>
                {log.evaluation.decision === 'deny' ? 'BLOCKED' : 'AUTHORIZED'}
              </div>
              <button className="text-white/20 hover:text-[#00f0ff] transition-colors">
                <svg className="w-5 h-5 shadow-glow" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActionConsole;

