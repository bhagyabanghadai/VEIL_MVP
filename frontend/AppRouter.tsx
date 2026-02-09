/**
 * VEIL App Router (React Router v7 Data Mode)
 * 
 * This file creates the router using createBrowserRouter with:
 * - Route loaders for data fetching
 * - Route actions for form handling
 * - Error boundaries per route
 * 
 * Based on Context7 React Router v7 best practices.
 */
import React from 'react';
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    useLoaderData,
    useNavigation,
    Navigate,
} from 'react-router';

// Page components
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPageRedesign';
import DashboardPage from './components/DashboardPage';
import SettingsPage from './components/SettingsPage';
import NotFoundPage from './components/NotFoundPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';
import DashboardLayout from './components/layout/DashboardLayout';
import PlaceholderPage from './components/PlaceholderPage';
import ProtocolPage from './components/pages/ProtocolPage';
import DocsPage from './components/pages/DocsPage';
import MissionPage from './components/pages/MissionPage';
import AgentsPage from './components/pages/AgentsPage';
import PoliciesPage from './components/pages/PoliciesPage';
import LogsPage from './components/pages/LogsPage';
import ComingSoonPage from './components/pages/ComingSoonPage';
import PlatformPage from './components/pages/PlatformPage';
import PricingPage from './components/pages/PricingPage';
import CareersPage from './components/pages/CareersPage';

// Router utilities
import { RouteErrorBoundary } from './components/RouteErrorBoundary';
import {
    rootLoader,
    dashboardLoader,
    agentsLoader,
    policiesLoader,
    logsLoader,
    loginAction,
    agentAction,
    policyAction,
} from './router';

// ============================================
// LAYOUT COMPONENTS
// ============================================

/**
 * Root Layout - Provides auth context to all routes
 */
function RootLayout() {
    const { isAuthenticated } = useLoaderData() as { isAuthenticated: boolean };
    const navigation = useNavigation();

    // Show loading indicator during navigation
    const isLoading = navigation.state === 'loading';

    return (
        <div className={isLoading ? 'opacity-80 transition-opacity' : ''}>
            <Outlet context={{ isAuthenticated }} />
        </div>
    );
}

/**
 * Dashboard Layout Wrapper - Uses loader data
 */
function DashboardLayoutWrapper() {
    const { agents, policies, logs } = useLoaderData() as {
        agents: any[];
        policies: any[];
        logs: any[];
    };
    const navigation = useNavigation();
    const isLoading = navigation.state === 'loading';

    // Default header props for demo functionality
    const headerProps = {
        isDemoMode: false,
        toggleDemo: () => { },
        runSimulation: () => { },
        simulationStep: null,
        onLogout: () => {
            localStorage.removeItem('veil_token');
            window.location.href = '/login';
        }
    };

    return (
        <DashboardLayout headerProps={headerProps}>
            <div className={isLoading ? 'animate-pulse' : ''}>
                <Outlet context={{ agents, policies, logs }} />
            </div>
        </DashboardLayout>
    );
}

/**
 * Agents Wrapper - Consumes agentsLoader data
 */
function AgentsWrapper() {
    const { agents } = useLoaderData() as { agents: any[] };
    return (
        <DashboardLayout>
            <AgentsPage
                agents={agents}
                onUpdateAgent={() => { }}
                onDeleteAgent={() => { }}
            />
        </DashboardLayout>
    );
}

/**
 * Policies Wrapper - Consumes policiesLoader data
 */
function PoliciesWrapper() {
    const { policies } = useLoaderData() as { policies: any[] };
    return (
        <DashboardLayout>
            <PoliciesPage
                policies={policies}
                onAddPolicy={() => { }}
                onDeletePolicy={() => { }}
                onClearPolicies={() => { }}
            />
        </DashboardLayout>
    );
}

/**
 * Logs Wrapper - Consumes logsLoader data
 */
function LogsWrapper() {
    const { logs, agents } = useLoaderData() as { logs: any[]; agents: any[] };
    return (
        <DashboardLayout>
            <LogsPage
                auditLog={logs}
                agents={agents}
                onClearLogs={() => { }}
                onResolveEntry={() => { }}
            />
        </DashboardLayout>
    );
}

// ============================================
// ROUTER CONFIGURATION
// ============================================

const router = createBrowserRouter([
    {
        path: '/',
        loader: rootLoader,
        element: <RootLayout />,
        errorElement: <RouteErrorBoundary />,
        children: [
            // Public routes
            {
                path: 'login',
                action: loginAction,
                element: <LoginPage onLoginSuccess={() => { }} onBack={() => { }} />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage onBack={() => { }} />,
            },

            // Dashboard (protected with loader)
            {
                index: true,
                loader: dashboardLoader,
                element: <DashboardLayoutWrapper />,
                errorElement: <RouteErrorBoundary />,
            },

            // Agents page
            {
                path: 'agents',
                loader: agentsLoader,
                action: agentAction,
                element: <AgentsWrapper />,
                errorElement: <RouteErrorBoundary />,
            },

            // Policies page
            {
                path: 'policies',
                loader: policiesLoader,
                action: policyAction,
                element: <PoliciesWrapper />,
                errorElement: <RouteErrorBoundary />,
            },

            // Logs page
            {
                path: 'logs',
                loader: logsLoader,
                element: <LogsWrapper />,
                errorElement: <RouteErrorBoundary />,
            },

            // Settings
            {
                path: 'settings',
                element: (
                    <DashboardLayout>
                        <SettingsPage />
                    </DashboardLayout>
                ),
            },

            // Static pages
            { path: 'terminal', element: <DashboardLayout><PlaceholderPage title="Command Terminal" description="Direct CLI uplink to agent kernel." /></DashboardLayout> },
            { path: 'broadcast', element: <DashboardLayout><PlaceholderPage title="System Broadcast" description="Network-wide alerts and message propagation." /></DashboardLayout> },
            { path: 'protocol', element: <DashboardLayout><ProtocolPage /></DashboardLayout> },
            { path: 'docs', element: <DashboardLayout><DocsPage /></DashboardLayout> },
            { path: 'mission', element: <DashboardLayout><MissionPage /></DashboardLayout> },

            // Public footer pages
            { path: 'platform', element: <PlatformPage /> },
            { path: 'pricing', element: <PricingPage /> },
            { path: 'careers', element: <CareersPage /> },
            { path: 'press', element: <ComingSoonPage /> },
            { path: 'identity-bridge', element: <PlatformPage /> },
            { path: 'audit-ledger', element: <PlatformPage /> },
            { path: 'neural-firewall', element: <PlatformPage /> },

            // Catch-all 404
            {
                path: '*',
                element: <DashboardLayout><NotFoundPage /></DashboardLayout>,
            },
        ],
    },
]);

// ============================================
// APP COMPONENT
// ============================================

/**
 * AppRouter - New App component using React Router v7 Data Mode
 * 
 * Benefits over BrowserRouter:
 * - Parallel data loading (faster page loads)
 * - Automatic data revalidation after actions
 * - Pending states via useNavigation()
 * - Error boundaries per route
 * - Type-safe route definitions
 */
export function AppRouter() {
    return <RouterProvider router={router} />;
}

export default AppRouter;
