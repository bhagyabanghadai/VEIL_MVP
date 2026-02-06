import React from 'react';

const MissionPage: React.FC = () => {
    return (
        <div className="min-h-screen text-white pt-32 pb-20 px-6 max-w-4xl mx-auto space-y-24">
            <header className="space-y-8 text-center">
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-white/20">
                    ALIGNMENT <br /> IS CONTROL
                </h1>
            </header>

            <div className="space-y-12 text-xl font-light leading-relaxed text-veil-text-secondary border-l border-white/10 pl-8 md:pl-16">
                <p>
                    We are moving into an era where software writes itself. Autonomous agents are no longer just chatbots; they are economic actors with the power to transact, deploy code, and alter infrastructure.
                </p>
                <p className="text-white font-medium">
                    The problem isn't intelligence. It's coherence.
                </p>
                <p>
                    Veil existence is necessitated by the gap between intent and execution. As models become more capable, their failure modes become more catastrophic. We build the guardrails that allow organizations to deploy autonomous systems with confidence.
                </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-12">
                <div className="p-8 bg-white/[0.02] border border-white/5">
                    <div className="text-4xl font-bold text-white mb-2">2024</div>
                    <div className="text-sm text-veil-text-secondary font-mono uppercase tracking-widest">Founded</div>
                </div>
                <div className="p-8 bg-white/[0.02] border border-white/5">
                    <div className="text-4xl font-bold text-white mb-2">SF</div>
                    <div className="text-sm text-veil-text-secondary font-mono uppercase tracking-widest">HQ</div>
                </div>
            </div>
        </div>
    );
};

export default MissionPage;
