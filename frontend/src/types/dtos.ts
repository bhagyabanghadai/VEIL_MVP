export type Verdict = 'ALLOW' | 'BLOCK' | 'FLAG' | 'MONITOR';

export interface HandshakeRequest {
    agentId: string;
    nonce: string;
    signature: string;
}

export interface HandshakeResponse {
    token: string;
    expiresInSeconds: number;
}

export interface VeilRequest {
    agentId: string;
    method: string;
    path: string;
    bodyHash?: string;
    jwt?: string;
}

export interface VeilResponse {
    transactionId: string; // UUID
    verdict: Verdict;
    reason: string;
    decidingLayer: string;
}

export interface PassportMeta {
    securityAnalysis?: string;
    misusePotential?: number;
    recommendedLimitations?: string[];
    passportVersion?: string;
}

export interface Agent {
    id: string; // UUID
    name: string;
    purpose: string;
    description: string;
    allowedCapabilities: string[];
    passportMeta?: PassportMeta;
    createdAt?: string; // ISO Date
}

export interface Policy {
    id: string;
    ruleContent: string;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    type: 'ALLOW' | 'BLOCK' | 'FLAG';
    createdAt?: string;
}

export interface AuditLog {
    id: string;
    agentId: string;
    actionContent: string;
    actionType: string;
    decision: string; // 'ALLOW', 'BLOCK', etc.
    riskScore: number;
    reasons: string[];
    resolution?: string;
    resolutionNotes?: string;
    createdAt: string;
    verdict?: Verdict; // Legacy mapping
    decidingLayer?: string;
}

export interface InsightsResponse {
    systemHealth?: string;
    threatLevel?: string;
    recentAlerts?: string[];
    [key: string]: any;
}

export interface HealthResponse {
    status: string;
    backend: string;
    db_status: string;
}
