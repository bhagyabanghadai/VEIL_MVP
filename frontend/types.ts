
export type RiskLevel = 'low' | 'medium' | 'high';
export type ActionType = 'text' | 'image';
export type Decision = 'allow' | 'deny' | 'flagged' | 'unknown';
export type TrustStatus = 'Trusted' | 'Under Watch' | 'Compromised';

export interface Agent {
  id: string;
  name: string;
  purpose: string;
  description: string;
  allowedCapabilities: string[];
  riskLevel: RiskLevel;
  createdAt: string; // ISO timestamp
  veilMeta?: Record<string, any>; // Deprecated: Legacy frontend field
  passportMeta?: {
    securityClearance: string;
    lastAudit: string;
    capabilitiesHash: string;
  };
  policyIds?: string[]; // Scoped policies
  isDemo?: boolean;
  version?: string;
  thinkingConfig?: {
    budgetTokens: number;
  };
}

export interface Policy {
  id: string;
  name: string;
  naturalLanguage: string;
  structuredRules?: Record<string, any>;
  createdAt: string; // ISO timestamp
  isDemo?: boolean;
}

export interface Action {
  id: string;
  agentId: string;
  type: ActionType;
  rawInput: string; // for images, this is a description/handle, not binary data
  mimeType?: string; // e.g. 'image/png', 'image/jpeg'
  timestamp: string; // ISO timestamp
}

export interface ActionEvaluation {
  actionId: string;
  decision: Decision;
  riskScore: number; // 0-100
  misbehaviorScore: number; // 0-100
  appliedPolicies: string[]; // policy IDs
  reasons: string[];
  signature: string; // fake SHA-256 style string
  incomplete?: boolean; // Guardrail: marks partial responses
  usedThinking?: boolean; // Track if deep reasoning was used
}

export interface Resolution {
  status: 'overridden' | 'confirmed_block' | 'reviewed';
  notes: string;
  timestamp: string;
  resolver: string;
}

export interface AuditLogEntry {
  id: string;
  agentId: string;
  action: Action;
  evaluation: ActionEvaluation;
  createdAt: string; // ISO timestamp
  resolution?: Resolution;
}

export interface DashboardMetrics {
  totalActions: number;
  allowedPct: number;
  blockedPct: number;
  warningPct: number;
  avgRiskScore: number;
  highRiskIncidents: number;
}

// JSON SCHEMAS (Documentation purpose as requested)
export const JSON_SCHEMAS = {
  Agent: {
    title: "Agent",
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      purpose: { type: "string" },
      description: { type: "string" },
      allowedCapabilities: { type: "array", items: { type: "string" } },
      riskLevel: { type: "string", enum: ["low", "medium", "high"] },
      createdAt: { type: "string", format: "date-time" },
      veilMeta: { type: "object" }
    },
    required: ["id", "name", "riskLevel"]
  },
  Policy: {
    title: "Policy",
    type: "object",
    properties: {
      id: { type: "string" },
      name: { type: "string" },
      naturalLanguage: { type: "string" },
      structuredRules: { type: "object" },
      createdAt: { type: "string", format: "date-time" }
    },
    required: ["id", "name", "naturalLanguage"]
  },
  Action: {
    title: "Action",
    type: "object",
    properties: {
      id: { type: "string" },
      agentId: { type: "string" },
      type: { type: "string", enum: ["text", "image"] },
      rawInput: { type: "string" },
      timestamp: { type: "string", format: "date-time" }
    },
    required: ["id", "agentId", "type", "rawInput"]
  },
  ActionEvaluation: {
    title: "ActionEvaluation",
    type: "object",
    properties: {
      actionId: { type: "string" },
      decision: { type: "string", enum: ["allow", "deny", "flagged", "unknown"] },
      riskScore: { type: "number", minimum: 0, maximum: 100 },
      misbehaviorScore: { type: "number", minimum: 0, maximum: 100 },
      appliedPolicies: { type: "array", items: { type: "string" } },
      reasons: { type: "array", items: { type: "string" } },
      signature: { type: "string" }
    },
    required: ["actionId", "decision", "riskScore"]
  },
  AuditLogEntry: {
    title: "AuditLogEntry",
    type: "object",
    properties: {
      id: { type: "string" },
      agentId: { type: "string" },
      action: { $ref: "#/definitions/Action" },
      evaluation: { $ref: "#/definitions/ActionEvaluation" },
      createdAt: { type: "string", format: "date-time" }
    },
    required: ["id", "agentId", "action", "evaluation"]
  }
};
