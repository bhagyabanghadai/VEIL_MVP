
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import AgentRegistration from './components/AgentRegistration';
// import { SignInPage } from './components/ui/sign-in-flow';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPageRedesign';
import { SecurityBackground } from './components/landing/SecurityBackground';
import InteractiveLogo from './components/InteractiveLogo';
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

import { Agent, Policy, AuditLogEntry, Action, ActionEvaluation, Resolution } from './types';
import { addPolicy, createAuditLogEntry, deleteAgent, deletePolicy, DEMO_AGENTS, DEMO_POLICIES, getAgents, getLogs, getPolicies, SCENARIOS, resolveLogEntry } from './services/scaffoldService';

// --- LAYOUT COMPONENTS ---

import { ProfileDropdown } from './components/ui/profile-dropdown';

const NavigationHeader: React.FC<{ isDemoMode: boolean, toggleDemo: () => void, runSimulation: () => void, simulationStep: number | null, onLogout: () => void }> = ({ isDemoMode, toggleDemo, runSimulation, simulationStep, onLogout }) => {
  return (
    <header className="h-16 flex items-center justify-center px-6 border-b border-veil-border bg-veil-bg/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-[1600px] w-full flex justify-between items-center">
        <InteractiveLogo />

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center gap-3 px-4 py-1.5 border border-veil-border bg-veil-sub rounded-sm">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-veil-trust rounded-full animate-pulse-slow"></div>
              <span className="text-[10px] font-mono tracking-widest text-veil-text-muted uppercase">Uplink Active</span>
            </div>
          </div>

          <button
            onClick={toggleDemo}
            className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border transition-all ${isDemoMode ? 'border-veil-trust text-veil-trust bg-veil-trust-dim' : 'border-veil-border text-veil-text-muted hover:text-white hover:border-veil-text-secondary'
              }`}
          >
            Demo: {isDemoMode ? 'ON' : 'OFF'}
          </button>

          {isDemoMode && (
            <button
              onClick={runSimulation}
              disabled={simulationStep !== null}
              className={`text-[10px] font-mono tracking-widest uppercase px-3 py-1.5 border border-veil-audit text-veil-audit bg-veil-audit-dim hover:bg-veil-audit-dim/50 transition-all ${simulationStep !== null ? 'opacity-50 cursor-wait' : ''}`}
            >
              {simulationStep !== null ? 'SIMULATION RUNNING...' : 'RUN SIMULATION'}
            </button>
          )}

          <ProfileDropdown onLogout={onLogout} />
        </div>
      </div>
    </header>
  );
};

const ProtectedLayout: React.FC<{ children: React.ReactNode, isAuthenticated: boolean, headerProps: any, systemRisk?: string }> = ({ children, isAuthenticated, headerProps, systemRisk = 'LOW' }) => {
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const getRiskOverlay = () => {
    if (systemRisk === 'CRITICAL') return 'after:content-[""] after:fixed after:inset-0 after:bg-red-500/5 after:pointer-events-none after:animate-pulse';
    if (systemRisk === 'HIGH') return 'after:content-[""] after:fixed after:inset-0 after:bg-orange-500/5 after:pointer-events-none';
    return '';
  };

  return (
    <div className={`relative min-h-screen text-white font-main selection:bg-cyan-500/30 overflow-hidden bg-[#030712] transition-colors duration-1000 ${getRiskOverlay()}`}>
      <SecurityBackground />
      <div className="relative z-10 flex flex-col min-h-screen no-scrollbar">
        <NavigationHeader {...headerProps} />
        <main className="flex-1 w-full flex flex-col items-center px-6 md:px-12 pb-24 font-sans">
          <div className="w-full max-w-[1600px] py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};


function AppContent() {
  const navigate = useNavigate();

  // --- CORE STATE ---
  // TEMP: Auto-authenticate for development (login files preserved for later)
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('veil_token'));

  useEffect(() => {
    console.log("VEIL App Mounted. Authenticated:", isAuthenticated);
    console.log("VEIL Token:", localStorage.getItem('veil_token'));
  }, [isAuthenticated]);

  // --- DEMO STATE ---
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [simulationStep, setSimulationStep] = useState<number | null>(null);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [scenarioTrigger, setScenarioTrigger] = useState<any>(undefined);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  // --- AI INSIGHTS & THEME STATE ---
  const [systemInsights, setSystemInsights] = useState({
    summary: "Neural link establishing... System monitoring active.",
    riskTrend: "STABLE",
    criticalAlerts: []
  });
  const [isInsightsLoading, setIsInsightsLoading] = useState(false);
  const [systemRisk, setSystemRisk] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('LOW');

  const fetchInsights = async () => {
    setIsInsightsLoading(true);
    const { getSystemInsights } = await import('./services/scaffoldService');
    const data = await getSystemInsights();
    setSystemInsights(data);

    // Auto-update system risk level based on trend
    if (data.riskTrend === 'CRITICAL') setSystemRisk('CRITICAL');
    else if (data.riskTrend === 'RISING') setSystemRisk('HIGH');
    else setSystemRisk('LOW');

    setIsInsightsLoading(false);
  };

  // Poll for insights every 60 seconds if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchInsights();
      const interval = setInterval(fetchInsights, 60000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated, auditLog.length]); // Refresh insight when logs change or on interval

  // Load backend data on Init
  useEffect(() => {
    if (isAuthenticated) {
      const loadData = async () => {
        setIsLoading(true);
        const failsafeTimer = setTimeout(() => { setIsLoading(false); }, 5000);

        // Check for Demo/Offline Token
        const token = localStorage.getItem('veil_token');
        if (token === 'demo-token-fallback') {
          console.warn("Offline/Demo Mode Detected. Loading Mock Data.");
          ensureDemoData();
          setIsLoading(false);
          clearTimeout(failsafeTimer);
          return;
        }

        try {
          const minLoadTime = new Promise(resolve => setTimeout(resolve, 800));
          const [fetchedAgents, fetchedPolicies, fetchedLogs] = await Promise.all([
            getAgents(),
            getPolicies(),
            getLogs(),
            minLoadTime
          ]);
          setAgents(fetchedAgents);
          setPolicies(fetchedPolicies);
          setAuditLog(fetchedLogs);

          if (fetchedAgents.length > 0 && !selectedAgentId) {
            setSelectedAgentId(fetchedAgents[0].id);
          }
        } catch (error: any) {
          console.error("Failed to sync with backend:", error);
          if (error.message === 'Unauthorized') {
            // For now, instead of hard logout, fallback to demo data to preserve UX
            console.warn("Backend Unauthorized. Falling back to Demo Data.");
            ensureDemoData();
            // Optionally keep them logged in but warn?
            // setIsAuthenticated(false);
            // localStorage.removeItem('veil_token');
            // navigate('/login');
          } else {
            // Network error ?
            console.warn("Network Error. Switch to Offline Mode.");
            ensureDemoData();
          }
        } finally {
          clearTimeout(failsafeTimer);
          setIsLoading(false);
        }
      };
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('agent_passport_token');
    localStorage.removeItem('veil_token');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem('veil_token', token);
    setIsAuthenticated(true);
    navigate('/');
  };

  const handleRegisterAgent = (agent: Agent) => {
    setAgents(prev => [...prev, agent]);
    setSelectedAgentId(agent.id);
    navigate('/');
  };

  const handleUpdateAgent = (updatedAgent: Agent) => {
    setAgents(prev => prev.map(a => a.id === updatedAgent.id ? updatedAgent : a));
  };

  const handleDeleteAgent = async (agentId: string) => {
    await deleteAgent(agentId);
    setAgents(prev => prev.filter(a => a.id !== agentId));
    if (selectedAgentId === agentId) {
      setSelectedAgentId(null);
    }
  };

  const handleDeletePolicy = async (policyId: string) => {
    const { deletePolicy } = await import('./services/scaffoldService');
    await deletePolicy(policyId);
    setPolicies(prev => prev.filter(p => p.id !== policyId));
  };

  const handleAddPolicy = async (policy: Policy) => {
    const saved = await addPolicy(policy);
    setPolicies(prev => [...prev, saved]);
  };

  const handleActionEvaluated = (action: Action, evaluation: ActionEvaluation) => {
    const agent = agents.find(a => a.id === action.agentId);
    if (agent) {
      const entry = createAuditLogEntry(agent, action, evaluation);
      setAuditLog(prev => [entry, ...prev]);
    }
  };

  const handleResolveEntry = async (entryId: string, resolution: Resolution) => {
    try {
      await resolveLogEntry(entryId, resolution);
      setAuditLog(prev => prev.map(entry =>
        entry.id === entryId ? { ...entry, resolution } : entry
      ));
    } catch (error) {
      console.error("Failed to resolve log entry:", error);
    }
  };

  const ensureDemoData = () => {
    const newAgents = [...agents];
    DEMO_AGENTS.forEach(da => {
      if (!newAgents.find(a => a.id === da.id)) newAgents.push(da);
    });
    setAgents(newAgents);
    if (!selectedAgentId && DEMO_AGENTS.length > 0) setSelectedAgentId(DEMO_AGENTS[0].id);

    const newPolicies = [...policies];
    DEMO_POLICIES.forEach(dp => {
      if (!newPolicies.find(p => p.id === dp.id)) newPolicies.push(dp);
    });
    setPolicies(newPolicies);
  };

  const runScenario = (scenarioId: string) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    ensureDemoData();
    setSelectedAgentId(scenario.agentId);
    navigate('/');

    setScenarioTrigger({
      agentId: scenario.agentId,
      actionType: scenario.actionType as 'text' | 'image',
      content: scenario.content,
      timestamp: Date.now()
    });
  };

  const runSimulation = () => {
    if (!isDemoMode) {
      setIsDemoMode(true);
      ensureDemoData();
    }
    setAuditLog([]);
    setSimulationComplete(false);
    navigate('/');

    const STEP_DELAY = 12000;
    let delay = 500;

    SCENARIOS.forEach((scenario, index) => {
      setTimeout(() => {
        setSimulationStep(index + 1);
        runScenario(scenario.id);
      }, delay);
      delay += STEP_DELAY;
    });

    setTimeout(() => {
      setSimulationStep(null);
      setSimulationComplete(true);
      setTimeout(() => setSimulationComplete(false), 8000);
    }, delay);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center text-white relative overflow-hidden">
        <SecurityBackground />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#00f0ff]/20 border-t-[#00f0ff] rounded-full animate-spin"></div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-[14px] font-bold tracking-[0.3em] uppercase animate-pulse">Establishing Uplink</span>
            <span className="text-[10px] text-white/40 font-mono">ENCRYPTING CONNECTION...</span>
          </div>
        </div>
      </div>
    );
  }

  const headerProps = {
    isDemoMode,
    toggleDemo: () => setIsDemoMode(!isDemoMode),
    runSimulation,
    simulationStep,
    onLogout: handleLogout
  };

  return (
    <Routes>
      <Route path="/login" element={
        !isAuthenticated ? (
          <LoginPage
            onLoginSuccess={handleLoginSuccess}
            onBack={() => navigate('/')}
          />
        ) : <Navigate to="/" />
      } />

      <Route path="/forgot-password" element={<ForgotPasswordPage onBack={() => navigate('/login')} />} />

      <Route path="/" element={
        isAuthenticated ? (
          <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
            <DashboardPage
              agents={agents}
              policies={policies}
              auditLog={auditLog}
              selectedAgentId={selectedAgentId}
              onSelectAgent={setSelectedAgentId}
              onUpdateAgent={handleUpdateAgent}
              onDeleteAgent={handleDeleteAgent}
              onAddPolicy={handleAddPolicy}
              onDeletePolicy={handleDeletePolicy}
              onClearPolicies={() => setPolicies([])}
              onClearLogs={() => setAuditLog([])}
              onResolveEntry={handleResolveEntry}
              onActionEvaluated={handleActionEvaluated}
              onPurgeAgents={() => setAgents([])}
              scenarioTrigger={scenarioTrigger}
              isDemoMode={isDemoMode}
              systemInsights={systemInsights}
              isInsightsLoading={isInsightsLoading}
            />
          </DashboardLayout>
        ) : <LandingPage onStart={() => setIsAuthenticated(true)} />
      } />

      <Route path="/register" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <div className="glass-panel p-20 animate-luxe max-w-3xl mx-auto my-12">
            <div className="flex justify-between items-center mb-16">
              <h2 className="text-[42px] font-black italic tracking-tighter">Identity Issuance.</h2>
              <a href="/" className="text-[#00f0ff] font-mono hover:underline tracking-widest text-[12px]">CANCEL_SEQUENCE</a>
            </div>
            <AgentRegistration onRegister={handleRegisterAgent} isDemoMode={isDemoMode} currentTrustStatus="Trusted" />
          </div>
        </DashboardLayout>
      } />

      <Route path="/settings" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <SettingsPage />
        </DashboardLayout>
      } />

      <Route path="/agents" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <AgentsPage
            agents={agents}
            onUpdateAgent={handleUpdateAgent}
            onDeleteAgent={handleDeleteAgent}
          />
        </DashboardLayout>
      } />

      <Route path="/policies" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <PoliciesPage
            policies={policies}
            onAddPolicy={handleAddPolicy}
            onDeletePolicy={handleDeletePolicy}
            onClearPolicies={() => setPolicies([])}
          />
        </DashboardLayout>
      } />

      <Route path="/logs" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <LogsPage
            auditLog={auditLog}
            agents={agents}
            onClearLogs={() => setAuditLog([])}
            onResolveEntry={handleResolveEntry}
          />
        </DashboardLayout>
      } />

      <Route path="/terminal" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <PlaceholderPage title="Command Terminal" description="Direct CLI uplink to agent kernel." />
        </DashboardLayout>
      } />

      <Route path="/broadcast" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <PlaceholderPage title="System Broadcast" description="Network-wide alerts and message propagation." />
        </DashboardLayout>
      } />

      {/* Footer Pages */}
      <Route path="/protocol" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <ProtocolPage />
        </DashboardLayout>
      } />

      <Route path="/docs" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <DocsPage />
        </DashboardLayout>
      } />

      <Route path="/mission" element={
        <DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}>
          <MissionPage />
        </DashboardLayout>
      } />

      <Route path="/identity-bridge" element={<PlatformPage />} />
      <Route path="/audit-ledger" element={<PlatformPage />} />
      <Route path="/neural-firewall" element={<PlatformPage />} />

      <Route path="/platform" element={<PlatformPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/careers" element={<CareersPage />} />

      <Route path="/press" element={<ComingSoonPage />} />

      <Route path="*" element={<DashboardLayout isAuthenticated={isAuthenticated} headerProps={headerProps} systemRisk={systemRisk}><NotFoundPage /></DashboardLayout>} />
    </Routes>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
