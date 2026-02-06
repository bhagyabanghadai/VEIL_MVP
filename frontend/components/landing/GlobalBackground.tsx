import React from 'react';

export const GlobalBackground = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#0a0a0a]">
            {/* 1. Base Noise Texture (The "Film Grain" Look) */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    transform: 'translateZ(0)', // Force GPU
                }}
            />

            {/* 2. Ambient Mondrian Glows (Use sparingly for "Atmosphere") */}
            {/* Blue Glow - Bottom Left */}
            <div className="absolute -bottom-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[#009fe3] opacity-[0.04] blur-[120px] animate-pulse-slow" />

            {/* Red Glow - Top Right */}
            <div className="absolute -top-[10%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#e30613] opacity-[0.03] blur-[100px]" />

            {/* Yellow Accent - Mid Right (Subtle) */}
            <div className="absolute top-[40%] right-[15%] w-[20vw] h-[20vw] rounded-full bg-[#ffc20e] opacity-[0.02] blur-[80px] mix-blend-screen" />

            {/* 3. Vignette (Focus attention to center) */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
        </div>
    );
};
