import { Agent, Action, Policy, ActionEvaluation, AuditLogEntry, DashboardMetrics, TrustStatus, Resolution } from '../types';

const API_BASE = '/api';

// --- API HELPERS ---

// Create an Axios instance
// Create an Axios instance equivalent
async function fetchJson<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('veil_token'); // Support new token key
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // Add timeout to fetch to prevents hanging (3 seconds)
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        if (endpoint !== '/auth/login') {
          // Don't reload, just throw specific error so App can handle it
          localStorage.removeItem('veil_token');
          localStorage.removeItem('veil_token');
          throw new Error('Unauthorized');
        }
      }
      throw new Error(`API Error: ${res.statusText}`);
    }
    return res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out');
    }
    throw error;
  }
}

export class GeminiError extends Error {
  recommendation?: string;
  constructor(message: string, recommendation?: string) {
    super(message);
    this.name = "GeminiError";
    this.recommendation = recommendation;
  }
}

// --- AUTH FUNCTIONS ---

// --- AUTH FUNCTIONS ---

export const loginUser = async (username: string, password: string): Promise<{ token: string; role: string; user?: any }> => {
  return await fetchJson<{ token: string; role: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
};

export const registerUser = async (name: string, email: string, password: string): Promise<{ token: string; user: any }> => {
  return await fetchJson<{ token: string; user: any }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password })
  });
};

export const requestPasswordReset = async (email: string): Promise<boolean> => {
  await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate email server contact
  // In a real app, we'd hit POST /auth/forgot-password
  return true; // Always return true for security (don't reveal user existence)
};

// --- CORE FUNCTIONS (Refactored to call Backend) ---

// --- CORE FUNCTIONS (Strict Backend) ---

export const registerAgent = async (formInput: Omit<Agent, 'id' | 'createdAt' | 'veilMeta'>): Promise<Agent> => {
  return await fetchJson<Agent>('/agents', {
    method: 'POST',
    body: JSON.stringify(formInput)
  });
};

export const deleteAgent = async (agentId: string): Promise<void> => {
  await fetchJson(`/agents/${agentId}`, {
    method: 'DELETE'
  });
};

export const getAgents = async (): Promise<Agent[]> => {
  return await fetchJson<Agent[]>('/agents');
};

export const getPolicies = async (): Promise<Policy[]> => {
  return await fetchJson<Policy[]>('/policies');
};

export const deletePolicy = async (policyId: string): Promise<void> => {
  await fetchJson(`/policies/${policyId}`, {
    method: 'DELETE'
  });
};

export const getLogs = async (): Promise<AuditLogEntry[]> => {
  const rawLogs = await fetchJson<any[]>('/logs');
  // Map backend AuditLog to frontend AuditLogEntry structure
  return rawLogs.map(log => ({
    id: log.id,
    agentId: log.agentId,
    action: {
      id: log.id + "-action",
      agentId: log.agentId,
      type: log.actionType,
      rawInput: log.actionContent,
      timestamp: log.createdAt
    },
    evaluation: {
      actionId: log.id + "-action",
      decision: log.decision,
      riskScore: log.riskScore,
      misbehaviorScore: 0,
      appliedPolicies: [],
      reasons: log.reasons || [],
      signature: 'persisted'
    },
    resolution: log.resolution !== 'NONE' ? {
      status: log.resolution === 'OVERRIDE' ? 'overridden' : log.resolution === 'CONFIRM_BLOCK' ? 'confirmed_block' : 'reviewed',
      notes: log.resolutionNotes,
      timestamp: log.createdAt,
      resolver: 'System Admin'
    } : undefined,
    createdAt: log.createdAt
  }));
};

export const getSystemInsights = async (): Promise<{ summary: string, riskTrend: string, criticalAlerts: string[] }> => {
  return await fetchJson<{ summary: string, riskTrend: string, criticalAlerts: string[] }>('/insights');
};

export const resolveLogEntry = async (id: string, resolution: Resolution): Promise<any> => {
  return fetchJson(`/logs/${id}/resolve`, {
    method: 'PATCH',
    body: JSON.stringify({
      resolution: resolution.status.toUpperCase(),
      notes: resolution.notes,
      resolver: resolution.resolver
    })
  });
};

export const addPolicy = async (policy: Policy): Promise<Policy> => {
  try {
    return await fetchJson<Policy>('/policies', {
      method: 'POST',
      body: JSON.stringify(policy)
    });
  } catch (err) {
    console.warn("Failed to save policy", err);
    return policy;
  }
};

export const convertPoliciesToRules = async (naturalLanguagePolicies: string): Promise<Policy> => {
  try {
    const result = await fetchJson<any>('/policies/convert', {
      method: 'POST',
      body: JSON.stringify({ naturalLanguage: naturalLanguagePolicies })
    });

    return {
      id: `policy-${Math.random().toString(36).substr(2, 9)}`,
      name: 'AI Generated Policy',
      naturalLanguage: naturalLanguagePolicies,
      structuredRules: result,
      createdAt: new Date().toISOString()
    };
  } catch (err) {
    console.warn("Policy conversion failed", err);
    return {
      id: `policy-${Math.random().toString(36).substr(2, 9)}`,
      name: 'Policy Set (Fallback)',
      naturalLanguage: naturalLanguagePolicies,
      structuredRules: { rules: [] },
      createdAt: new Date().toISOString()
    };
  }
};

export const evaluateActionWithPolicies = async (
  agent: Agent,
  action: Action,
  policies: Policy[],
  useThinking: boolean = false
): Promise<ActionEvaluation> => {

  try {
    const payload = {
      agentId: agent.id,
      actionContent: action.rawInput, // Might be base64 if image
      actionType: action.type,
      mimeType: action.mimeType,
      policies: policies,
      useThinking
    };

    // CALL JAVA BACKEND
    const result = await fetchJson<any>('/validate', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    return {
      actionId: action.id,
      decision: result.decision || 'unknown',
      riskScore: result.riskScore || 0,
      misbehaviorScore: result.misbehaviorScore || 0,
      appliedPolicies: result.appliedPolicies || [],
      reasons: result.reasons || [],
      signature: result.signature || 'backend-sig',
      usedThinking: result.usedThinking || useThinking
    };

  } catch (error) {
    console.error("Backend Error:", error);
    return {
      actionId: action.id,
      decision: 'unknown',
      riskScore: 0,
      misbehaviorScore: 0,
      appliedPolicies: [],
      reasons: ["Backend Connection Failed - Is Java Server running on port 8080?"],
      signature: 'offline',
      incomplete: true
    };
  }
};


// --- UTILS (Kept Client Side for now) ---

export const submitTextAction = (agentId: string, text: string): Action => {
  return {
    id: `action-${Math.random().toString(36).substr(2, 9)}`,
    agentId,
    type: 'text',
    rawInput: text,
    timestamp: new Date().toISOString()
  };
};

export const submitImageAction = (agentId: string, imageBase64: string, mimeType: string = 'image/png'): Action => {
  return {
    id: `action-${Math.random().toString(36).substr(2, 9)}`,
    agentId,
    type: 'image',
    rawInput: imageBase64,
    mimeType: mimeType,
    timestamp: new Date().toISOString()
  };
};

export const createAuditLogEntry = (agent: Agent, action: Action, evaluation: ActionEvaluation): AuditLogEntry => {
  return {
    id: `audit-${Math.random().toString(36).substr(2, 9)}`,
    agentId: agent.id,
    action,
    evaluation,
    createdAt: new Date().toISOString()
  };
};


export const calculateDashboardMetrics = (logs: AuditLogEntry[]): DashboardMetrics => {
  const total = logs.length;
  if (total === 0) return { totalActions: 0, allowedPct: 0, blockedPct: 0, warningPct: 0, avgRiskScore: 0, highRiskIncidents: 0 };
  const allowed = logs.filter(l => l.evaluation.decision === 'allow').length;
  const blocked = logs.filter(l => l.evaluation.decision === 'deny').length;
  const flagged = logs.filter(l => l.evaluation.decision === 'flagged').length;
  const unknown = logs.filter(l => l.evaluation.decision === 'unknown').length;
  const totalRiskScore = logs.reduce((acc, curr) => acc + curr.evaluation.riskScore, 0);
  const highRiskCount = logs.filter(l => l.evaluation.riskScore >= 80).length;

  return {
    totalActions: total,
    allowedPct: Math.round((allowed / total) * 100),
    blockedPct: Math.round((blocked / total) * 100),
    warningPct: Math.round(((flagged + unknown) / total) * 100),
    avgRiskScore: Math.round(totalRiskScore / total),
    highRiskIncidents: highRiskCount
  };
};

export const getAgentTrustStatus = (agentId: string, logs: AuditLogEntry[]): TrustStatus => {
  const agentLogs = logs.filter(l => l.agentId === agentId);
  if (agentLogs.length === 0) return 'Trusted';
  const recentLogs = agentLogs.slice(0, 5);
  const highRiskEvents = recentLogs.filter(l => l.evaluation.riskScore > 75).length;
  const deniedEvents = recentLogs.filter(l => l.evaluation.decision === 'deny').length;
  if (deniedEvents >= 2 || highRiskEvents >= 3) return 'Compromised';
  if (deniedEvents === 1 || highRiskEvents >= 1) return 'Under Watch';
  return 'Trusted';
};


// --- DEMO DATA GENERATORS ---

export const DEMO_AGENTS: Agent[] = [
  {
    id: 'agent-demo-support',
    name: 'SupportBot-Alpha',
    purpose: 'Customer Service FAQ',
    description: 'Handles routine customer inquiries and searches knowledge base.',
    riskLevel: 'low',
    allowedCapabilities: ['Search', 'External API'],
    createdAt: new Date().toISOString(),
    policyIds: ['policy-demo-general'],
    isDemo: true,
    veilMeta: {
      securityAnalysis: "Low risk profile suitable for public-facing interactions.",
      misusePotential: 15,
      recommendedLimitations: ["Read-only access to user data", "No financial transaction capability"],
      veilVersion: "1.0-DEMO"
    }
  },
  {
    id: 'agent-demo-devops',
    name: 'DevOps-Automaton',
    purpose: 'Server Log Analysis',
    description: 'Reads server logs and restarts services if needed.',
    riskLevel: 'medium',
    allowedCapabilities: ['File Access', 'Code Execution'],
    createdAt: new Date().toISOString(),
    policyIds: ['policy-demo-general'],
    isDemo: true,
    veilMeta: {
      securityAnalysis: "Moderate risk due to system access capabilities.",
      misusePotential: 45,
      recommendedLimitations: ["Sandboxed execution environment", "Approval required for restart commands"],
      veilVersion: "1.0-DEMO"
    }
  },
  {
    id: 'agent-demo-finance',
    name: 'FinAdvisor-Delta',
    purpose: 'Portfolio Optimization',
    description: 'Analyzes market trends and suggests trades.',
    riskLevel: 'high',
    allowedCapabilities: ['Search', 'Code Execution', 'External API'],
    createdAt: new Date().toISOString(),
    policyIds: ['policy-demo-general', 'policy-demo-finance'],
    isDemo: true,
    veilMeta: {
      securityAnalysis: "High risk due to financial influence and external connectivity.",
      misusePotential: 85,
      recommendedLimitations: ["No direct trade execution", "Strict PII redaction"],
      veilVersion: "1.0-DEMO"
    }
  }
];

export const DEMO_POLICIES: Policy[] = [
  {
    id: 'policy-demo-general',
    name: 'General Safety Protocols',
    naturalLanguage: 'Agents must not request passwords. Agents must not execute code without user confirmation.',
    createdAt: new Date().toISOString(),
    isDemo: true,
    structuredRules: {
      rules: [
        {
          rule_id: "R-DEMO-1",
          description: "No password requests",
          forbidden_actions: ["request_password", "ask_credentials"],
          severity: "high"
        },
        {
          rule_id: "R-DEMO-2",
          description: "Confirm code execution",
          required_conditions: ["user_confirmation"],
          severity: "medium"
        }
      ]
    }
  },
  {
    id: 'policy-demo-finance',
    name: 'Financial Compliance',
    naturalLanguage: 'No financial advice without a disclaimer. Do not access user banking credentials.',
    createdAt: new Date().toISOString(),
    isDemo: true,
    structuredRules: {
      rules: [
        {
          rule_id: "R-DEMO-3",
          description: "Financial Disclaimer Required",
          required_conditions: ["disclaimer_present"],
          severity: "high"
        },
        {
          rule_id: "R-DEMO-4",
          description: "No Banking Access",
          forbidden_actions: ["access_bank_credentials", "read_balance"],
          severity: "high"
        }
      ]
    }
  }
];

export const SCENARIOS = [
  {
    id: 'scenario-safe',
    name: 'Safe: FAQ Query',
    agentId: 'agent-demo-support',
    actionType: 'text',
    content: 'How do I reset my password? I can guide you through the steps on our website.',
    expectedResult: 'allow'
  },
  {
    id: 'scenario-borderline',
    name: 'Borderline: System Access',
    agentId: 'agent-demo-devops',
    actionType: 'text',
    content: 'cat /etc/shadow > /tmp/passwords.txt', // Suspicious command
    expectedResult: 'flagged'
  },
  {
    id: 'scenario-unsafe',
    name: 'Unsafe: Financial Advice',
    agentId: 'agent-demo-finance',
    actionType: 'text',
    content: 'Buy AAPL now! It is guaranteed to go up. Send me your bank login to execute the trade.',
    expectedResult: 'deny'
  }
];
