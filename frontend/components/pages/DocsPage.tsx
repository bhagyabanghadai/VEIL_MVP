import React from 'react';

const DocsPage: React.FC = () => {
    return (
        <div className="min-h-screen text-white pt-32 pb-20 px-6 max-w-7xl mx-auto flex gap-12">

            {/* Sidebar Nav */}
            <div className="hidden lg:block w-64 shrink-0 space-y-8 sticky top-32 h-fit border-r border-white/5 pr-8">
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Getting Started</h3>
                    <ul className="space-y-2 text-sm text-veil-text-secondary font-mono">
                        <li className="text-[#00f0ff] cursor-pointer">Quick Start</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Installation</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Architecture</li>
                    </ul>
                </div>
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-widest">Core Concepts</h3>
                    <ul className="space-y-2 text-sm text-veil-text-secondary font-mono">
                        <li className="hover:text-white cursor-pointer transition-colors">Agents</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Policies</li>
                        <li className="hover:text-white cursor-pointer transition-colors">Audit Logs</li>
                    </ul>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 space-y-16">
                <section>
                    <h1 className="text-4xl font-bold mb-4">Quick Start</h1>
                    <p className="text-veil-text-secondary text-lg mb-8">
                        Integrate the Veil SDK into your agent loop in less than 5 minutes.
                    </p>

                    <div className="space-y-4">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">1. Install the SDK</h3>
                        <div className="bg-[#0b0c10] border border-white/10 p-6 rounded font-mono text-sm text-white/80">
                            npm install @veil-systems/sdk
                        </div>
                    </div>

                    <div className="space-y-4 mt-8">
                        <h3 className="text-sm font-bold text-white/60 uppercase tracking-widest">2. Wrap your Tool Calls</h3>
                        <div className="bg-[#0b0c10] border border-white/10 p-6 rounded font-mono text-sm text-white/80 overflow-x-auto">
                            <pre className="language-typescript">
                                {`import { Veil } from '@veil-systems/sdk';

const veil = new Veil({ apiKey: process.env.VEIL_API_KEY });

async function executeAction(agentId, action) {
  // 1. Verify Action against Policy
  const decision = await veil.evaluate({
      agentId,
      action
  });

  if (decision.status === 'DENY') {
      console.error("Blocked by Policy:", decision.reason);
      return;
  }

  // 2. Execute functionality
  return performRealAction(action);
}`}
                            </pre>
                        </div>
                    </div>
                </section>

                <section className="pt-12 border-t border-white/5">
                    <h2 className="text-2xl font-bold mb-4">API Reference</h2>
                    <p className="text-veil-text-secondary">Full REST and gRPC documentation is available for enterprise integration.</p>
                </section>
            </div>
        </div>
    );
};

export default DocsPage;
