import React from 'react';

// Replaces the "NeuralNetwork" with a calm, industrial workspace background
const NeuralNetworkBackground = ({ systemRisk = 'LOW' }: { systemRisk?: string }) => {

    // Subtle risk indicator in the ambient light, very restrained
    const getRiskGradient = () => {
        switch (systemRisk) {
            case 'CRITICAL': return 'radial-gradient(circle at 50% -20%, rgba(239, 68, 68, 0.08), transparent 70%)'; // Faint Red
            case 'HIGH': return 'radial-gradient(circle at 50% -20%, rgba(249, 115, 22, 0.05), transparent 70%)'; // Faint Orange
            default: return 'radial-gradient(circle at 50% -20%, rgba(56, 189, 248, 0.03), transparent 70%)'; // Faint Blue (Standard)
        }
    };

    return (
        <div className="fixed inset-0 z-0 pointer-events-none bg-veil-bg transition-colors duration-1000">
            {/* Base Darkness */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Subtle Grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
                    backgroundSize: '100px 100px'
                }}
            />

            {/* Ambient Top Light (Status Indicator) */}
            <div
                className="absolute inset-0 transition-all duration-1000"
                style={{ background: getRiskGradient() }}
            />

            {/* Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
        </div>
    );
};

export default NeuralNetworkBackground;
