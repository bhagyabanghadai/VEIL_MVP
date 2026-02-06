import React from 'react';
import Sidebar from '../dashboard/Sidebar';
import CommandBar from '../dashboard/CommandBar';
import NeuralNetworkBackground from '../NeuralNetworkBackground';

import { Navigate } from 'react-router-dom';

interface DashboardLayoutProps {
    children: React.ReactNode;
    isAuthenticated: boolean;
    headerProps: any; // Using the existing props structure for compatibility
    systemRisk?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
}

import { FallingPattern } from '../ui/falling-pattern';

const DashboardLayout: React.FC<DashboardLayoutProps> = ({
    children,
    isAuthenticated,
    headerProps,
    systemRisk = 'LOW'
}) => {
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen w-full bg-veil-bg overflow-hidden text-veil-text-primary font-sans selection:bg-veil-accent/30 relative">
            <div className="absolute inset-0 z-0 pointer-events-none">
                <FallingPattern
                    color="#FFFFFF"
                    backgroundColor="#050505"
                    density={1.5}
                />
            </div>

            {/* Background Gradient Overlay to match Login Page */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]/80 pointer-events-none z-0" />

            {/* Sidebar Left */}
            <Sidebar className="relative z-20" />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col relative z-10 h-full overflow-hidden">
                {/* Top Command Bar */}
                <CommandBar
                    isDemoMode={headerProps.isDemoMode}
                    toggleDemo={headerProps.toggleDemo}
                    runSimulation={headerProps.runSimulation}
                    simulationStep={headerProps.simulationStep}
                    onLogout={headerProps.onLogout}
                    systemRisk={systemRisk}
                />

                {/* Scrollable Workspace */}
                <main className="flex-1 overflow-y-auto overflow-x-hidden p-8 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <div className="max-w-[1600px] mx-auto pb-24">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
