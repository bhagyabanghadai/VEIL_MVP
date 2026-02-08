import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Globe, Code, FolderOpen, Wifi, ChevronRight, ChevronLeft, Check, Loader2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';

interface AgentRegistrationProps {
  onRegister: (agent: Agent) => void;
  isDemoMode: boolean;
  currentTrustStatus: string;
}

const AgentRegistration: React.FC<AgentRegistrationProps> = ({ onRegister, isDemoMode, currentTrustStatus }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [thinkingTokens, setThinkingTokens] = useState(1024);
  const [isMinting, setIsMinting] = useState(false);

  const availableModules = [
    { id: 'web_access', label: 'Web Access', icon: Globe, color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { id: 'code_exec', label: 'Code Execution', icon: Code, color: 'text-teal-600', bg: 'bg-teal-100' },
    { id: 'file_io', label: 'File System', icon: FolderOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
    { id: 'network', label: 'Network Access', icon: Wifi, color: 'text-rose-600', bg: 'bg-rose-100' },
  ];

  const handleToggleCapability = (id: string) => {
    setCapabilities(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleFinalize = async () => {
    setIsMinting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAgent: Agent = {
      id: uuidv4(),
      name: name || 'Unnamed Agent',
      purpose: description.substring(0, 50) || 'General Purpose',
      description: description || 'AI Agent',
      riskLevel: capabilities.length > 2 ? 'high' : capabilities.length > 0 ? 'medium' : 'low',
      createdAt: new Date().toISOString(),
      allowedCapabilities: capabilities,
      policyIds: [],
      thinkingConfig: { budgetTokens: thinkingTokens }
    };
    onRegister(newAgent);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      {/* Card Container */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">

        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 bg-gradient-to-r from-cyan-50 to-teal-50">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-slate-800">Register Agent</h2>
              <span className="text-sm text-slate-500">Step {step + 1} of 3</span>
            </div>
            <div className={cn(
              "w-3 h-3 rounded-full",
              isMinting ? 'bg-cyan-500 animate-ping' : 'bg-slate-200'
            )} />
          </div>

          {/* Progress Bar */}
          <div className="flex gap-2 mt-4">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className={cn(
                  "flex-1 h-1.5 rounded-full transition-all",
                  i <= step ? 'bg-cyan-500' : 'bg-slate-200'
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 min-h-[350px]">
          <AnimatePresence mode='wait'>
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Agent Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Data Analyst Bot..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-lg text-slate-800 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Purpose</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What will this agent do?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-slate-700 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 transition-all min-h-[120px] resize-none"
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Thinking Budget</label>
                    <span className="font-mono font-bold text-cyan-600">{thinkingTokens} tokens</span>
                  </div>
                  <input
                    type="range"
                    min="1024" max="32000" step="1024"
                    value={thinkingTokens}
                    onChange={e => setThinkingTokens(Number(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                  />
                  <p className="text-xs text-slate-400">Higher token budget improves reasoning depth but increases latency.</p>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Capabilities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableModules.map(mod => {
                      const Icon = mod.icon;
                      const isSelected = capabilities.includes(mod.id);
                      return (
                        <button
                          key={mod.id}
                          onClick={() => handleToggleCapability(mod.id)}
                          className={cn(
                            "p-4 rounded-xl border-2 flex items-center gap-3 transition-all",
                            isSelected
                              ? 'border-cyan-400 bg-cyan-50'
                              : 'border-slate-200 bg-slate-50 hover:border-slate-300'
                          )}
                        >
                          <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", mod.bg)}>
                            <Icon className={cn("w-5 h-5", mod.color)} />
                          </div>
                          <span className={cn(
                            "text-sm font-medium",
                            isSelected ? 'text-slate-800' : 'text-slate-500'
                          )}>
                            {mod.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-8 text-center"
              >
                {isMinting ? (
                  <>
                    <div className="w-16 h-16 border-4 border-cyan-200 border-t-cyan-500 rounded-full animate-spin mb-4" />
                    <p className="text-sm text-cyan-600 font-medium">Registering Agent...</p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                      <Sparkles className="w-8 h-8 text-emerald-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800">Ready to Register</h3>
                    <p className="text-slate-500 text-sm mt-2 max-w-sm">
                      "{name || 'Agent'}" will be added to your fleet with {capabilities.length} capabilities.
                    </p>
                    <button
                      onClick={handleFinalize}
                      className="mt-6 w-full py-3 bg-cyan-600 text-white rounded-xl font-semibold hover:bg-cyan-700 transition-colors"
                    >
                      Register Agent
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation */}
        {!isMinting && step < 2 && (
          <div className="flex justify-between px-8 py-4 border-t border-slate-100 bg-slate-50">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={cn(
                "flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 transition-colors",
                step === 0 && 'invisible'
              )}
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="flex items-center gap-1 px-6 py-2 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-700 transition-colors text-sm"
            >
              Continue
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentRegistration;
