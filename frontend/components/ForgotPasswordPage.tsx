import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { requestPasswordReset } from '../services/scaffoldService';

const ForgotPasswordPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleReset = async () => {
        if (!email) return;
        setIsLoading(true);
        await requestPasswordReset(email);
        setIsLoading(false);
        setStep(2);
    };

    return (
        <div className="min-h-screen bg-[#030712] flex items-center justify-center relative overflow-hidden font-main">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>

            <div className="relative z-10 w-full max-w-md p-8">
                <div className="glass-panel p-10 animate-luxe relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00f0ff] to-transparent opacity-50"></div>

                    <div className="text-center mb-10">
                        <div className="w-16 h-16 border border-white/10 rounded-full flex items-center justify-center mx-auto mb-6 bg-white/5">
                            <svg className="w-8 h-8 text-[#00f0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" /></svg>
                        </div>
                        <h2 className="text-[24px] font-black italic text-white uppercase tracking-tighter mb-2">Recovery Protocol.</h2>
                        <p className="text-white/40 text-[12px] font-mono tracking-widest">RESET_CREDENTIALS_SEQUENCE</p>
                    </div>

                    {step === 1 ? (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-white/40 uppercase tracking-widest pl-2">Operator ID / Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 focus:border-[#00f0ff] p-4 text-white placeholder-white/20 outline-none transition-all text-[14px]"
                                    placeholder="ENTER_ID"
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleReset}
                                disabled={isLoading || !email}
                                className={`w-full neon-button primary font-bold text-[12px] flex items-center justify-center ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                        TRANSMITTING...
                                    </>
                                ) : 'INITIATE RESET'}
                            </button>
                            <button onClick={onBack} disabled={isLoading} className="w-full text-white/30 hover:text-white text-[10px] uppercase tracking-widest transition-colors py-2">Return to Login</button>
                        </div>
                    ) : (
                        <div className="space-y-6 text-center">
                            <div className="p-4 bg-[#00f0ff]/10 border border-[#00f0ff]/20 text-[#00f0ff] text-[12px] leading-relaxed">
                                A cryptographic reset link has been dispatched to the secure channel associated with your ID.
                            </div>
                            <button onClick={onBack} className="w-full neon-button font-bold text-[12px]">Return to Login</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
