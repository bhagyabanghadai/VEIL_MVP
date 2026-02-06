import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '../types';
import { v4 as uuidv4 } from 'uuid';

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

  // Creative "Capabilities" as specialized Modules
  const availableModules = [
    { id: 'web_access', label: 'Web Access', icon: '🌐' },
    { id: 'code_exec', label: 'Code Execution', icon: '💻' },
    { id: 'file_io', label: 'File System', icon: '📂' },
    { id: 'network', label: 'Network Access', icon: '📡' },
  ];

  const handleToggleCapability = (id: string) => {
    setCapabilities(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };

  const handleFinalize = async () => {
    setIsMinting(true);
    // Simulate a "Minting" process
    await new Promise(resolve => setTimeout(resolve, 2500));

    const newAgent: Agent = {
      id: uuidv4(),
      name: name || 'Unnamed Entity',
      purpose: description.substring(0, 50) || 'General Purpose',
      description: description || 'Digital construct.',

      riskLevel: capabilities.length > 2 ? 'high' : 'low', // Simple logic for demo
      createdAt: new Date().toISOString(),
      allowedCapabilities: capabilities,
      policyIds: [],
      thinkingConfig: { budgetTokens: thinkingTokens }
    };
    onRegister(newAgent);
  };

  return (
    <div className="w-full max-w-lg mx-auto relative z-10">
      {/* GLOSS CONTAINER */}
      <div className="glass-panel p-8 backdrop-blur-3xl bg-black/40 border-white/10 shadow-2xl relative overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6">
          <div>
            <h2 className="text-2xl font-light text-white tracking-tight">Agent Genesis</h2>
            <span className="text-xs text-[#94a3b8] tracking-widest uppercase">Sequence {step + 1} / 3</span>
          </div>

          {/* Visual Pulse */}
          <div className={`w-3 h-3 rounded-full ${isMinting ? 'animate-ping bg-[#00f0ff]' : 'bg-white/20'}`}></div>
        </div>

        {/* CONTENT */}
        <div className="min-h-[300px]">
          <AnimatePresence mode='wait'>
            {step === 0 && (
              <motion.div
                key="step0"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-6"
              >
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#94a3b8]">Entity Designation</label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Nexus-7..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-xl outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-all font-light"
                    autoFocus
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest text-[#94a3b8]">Core Directive (Description)</label>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What is its purpose?"
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-base outline-none focus:border-[#00f0ff] focus:bg-white/10 transition-all min-h-[100px]"
                  />
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <label className="text-[10px] uppercase tracking-widest text-[#94a3b8]">Thinking Budget (Tokens)</label>
                    <span className="text-[#00f0ff] font-mono text-xl">{thinkingTokens}</span>
                  </div>
                  <input
                    type="range"
                    min="1024" max="32000" step="1024"
                    value={thinkingTokens}
                    onChange={e => setThinkingTokens(Number(e.target.value))}
                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#00f0ff]"
                  />
                  <p className="text-xs text-white/40">Allocating more reasoning tokens increases security analysis capability but latency also rises.</p>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest text-[#94a3b8]">Granted Capabilities</label>
                  <div className="grid grid-cols-2 gap-3">
                    {availableModules.map(mod => (
                      <button
                        key={mod.id}
                        onClick={() => handleToggleCapability(mod.id)}
                        className={`p-4 rounded-xl border flex items-center gap-3 transition-all ${capabilities.includes(mod.id)
                          ? 'bg-[#00f0ff]/10 border-[#00f0ff] text-white'
                          : 'bg-white/5 border-white/5 text-white/50 hover:bg-white/10'
                          }`}
                      >
                        <span className="text-xl">{mod.icon}</span>
                        <span className="text-sm font-medium">{mod.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-10 text-center gap-6"
              >
                {isMinting ? (
                  <>
                    <div className="w-20 h-20 border-4 border-[#00f0ff]/30 border-t-[#00f0ff] rounded-full animate-spin"></div>
                    <p className="text-sm text-[#00f0ff] animate-pulse">Forging Neural Identity...</p>
                  </>
                ) : (
                  <>
                    <div className="bg-[#00f0ff]/10 p-6 rounded-full text-[#00f0ff]">
                      <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                      <h3 className="text-xl text-white font-medium">Ready to Mint</h3>
                      <p className="text-white/50 text-sm mt-2">"{name}" will be deployed to the active fleet.</p>
                    </div>
                    <button onClick={handleFinalize} className="btn-primary w-full py-4 rounded-full font-bold tracking-widest uppercase mt-4">
                      Initialize
                    </button>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* FOOTER NAV */}
        {!isMinting && step < 2 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-white/5">
            <button
              onClick={() => step > 0 && setStep(step - 1)}
              className={`text-sm text-white/40 hover:text-white transition-colors ${step === 0 ? 'invisible' : ''}`}
            >
              Back
            </button>
            <button
              onClick={() => setStep(step + 1)}
              className="btn-gloss px-8 py-2 text-sm"
            >
              Continue
            </button>
          </div>
        )}

      </div>

      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#00f0ff] opacity-10 blur-[100px] -z-10 pointer-events-none rounded-full mix-blend-screen"></div>
    </div>
  );
};

export default AgentRegistration;
