import React from 'react';
import { useNavigate } from 'react-router-dom';

interface PlaceholderPageProps {
    title: string;
    description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description = "This module is currently initializing." }) => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8 animate-luxe">
            <div className="relative">
                <div className="w-24 h-24 border border-white/10 rotate-45 flex items-center justify-center">
                    <div className="w-12 h-12 border border-[#00f0ff]/30"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-[#00f0ff] animate-ping rounded-full"></div>
                </div>
            </div>

            <div className="space-y-4">
                <h1 className="text-4xl font-black italic tracking-tighter text-white">{title}</h1>
                <p className="text-white/40 font-mono text-sm tracking-widest uppercase">{description}</p>
            </div>

            <div className="p-4 border border-dashed border-white/10 rounded-lg bg-white/[0.02]">
                <code className="text-[#00f0ff] font-mono text-xs">System.module.load('{title.toLowerCase().replace(/\s/g, '_')}').pending()</code>
            </div>

            <button
                onClick={() => navigate('/')}
                className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white/60 hover:text-white transition-all uppercase tracking-widest text-xs font-bold rounded-sm"
            >
                Return to Command
            </button>
        </div>
    );
};

export default PlaceholderPage;
