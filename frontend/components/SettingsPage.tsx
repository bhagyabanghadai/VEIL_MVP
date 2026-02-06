import React from 'react';

const SettingsPage: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto w-full py-12 space-y-12">
            <header>
                <h1 className="text-hero text-[48px] mb-4">Command Config.</h1>
                <p className="text-white/40 text-[16px]">Manage protocol parameters and administrator credentials.</p>
            </header>

            <div className="glass-panel p-12 animate-luxe">
                <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]"></div>
                        <h3 className="text-label text-[#00f0ff] text-[12px]">Admin Credentials</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Operator ID</label>
                            <input type="text" value="veil_admin" disabled className="w-full bg-black/40 border border-white/10 p-4 text-white/60 text-[14px] cursor-not-allowed" />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Current Password</label>
                            <input type="password" value="********" disabled className="w-full bg-black/40 border border-white/10 p-4 text-white/60 text-[14px] cursor-not-allowed" />
                        </div>
                    </div>

                    <div className="pt-6">
                        <button className="neon-button text-[11px]">Rotate Security Keys</button>
                    </div>
                </div>
            </div>

            <div className="glass-panel p-12 animate-luxe">
                <div className="space-y-10">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-1.5 h-1.5 bg-[#bd00ff] rounded-full shadow-[0_0_8px_#bd00ff]"></div>
                        <h3 className="text-label text-[#bd00ff] text-[12px]">API Integration</h3>
                    </div>

                    <div className="space-y-4">
                        <label className="text-[11px] font-bold text-white/40 uppercase tracking-widest">Gemini API Key</label>
                        <div className="flex gap-4">
                            <input type="password" value="AIzaSy...XyZ" disabled className="flex-1 bg-black/40 border border-white/10 p-4 text-white/60 text-[14px] font-mono tracking-widest" />
                            <button className="px-6 border border-white/10 hover:bg-white/5 text-white/40 hover:text-white transition-colors uppercase text-[10px] font-bold tracking-widest">Reveal</button>
                        </div>
                        <p className="text-[12px] text-white/30 italic">Linked to Project: <span className="text-white/60">Limitless_V99</span></p>
                    </div>
                </div>
            </div>
            <div className="text-center pt-12">
                <a href="/" className="text-white/30 hover:text-white transition-colors text-[11px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Return to Dashboard
                </a>
            </div>
        </div>
    );
};

export default SettingsPage;
