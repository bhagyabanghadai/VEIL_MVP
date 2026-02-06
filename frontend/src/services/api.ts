import {
    Agent,
    AuditLog,
    HandshakeRequest,
    HandshakeResponse,
    HealthResponse,
    Policy,
    VeilRequest,
    VeilResponse,
    Verdict
} from '../types/dtos';

const API_BASE = '/api'; // Vite proxy should handle this, or set full URL

class VeilApiClient {
    private token: string | null = null;
    private agentId: string | null = null;

    constructor() {
        const storedToken = localStorage.getItem('veil_token');
        if (storedToken) this.token = storedToken;
    }

    private getHeaders() {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }
        return headers;
    }

    private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
        const res = await fetch(`${API_BASE}${endpoint}`, {
            ...options,
            headers: {
                ...this.getHeaders(),
                ...options.headers,
            },
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`API Error ${res.status}: ${errorText}`);
        }

        // Handle empty responses
        if (res.status === 204) return {} as T;

        return res.json();
    }

    // --- AUTH ---

    async handshake(agentId: string): Promise<HandshakeResponse> {
        // Generate a random nonce
        const nonce = crypto.randomUUID();
        // In real impl, sign(nonce + agentId) with private key
        const signature = `sig_${Date.now()}`;

        const res = await this.request<HandshakeResponse>('/auth/handshake', {
            method: 'POST',
            body: JSON.stringify({ agentId, nonce, signature } as HandshakeRequest),
        });

        this.token = res.token;
        this.agentId = agentId;
        localStorage.setItem('veil_token', res.token);
        return res;
    }

    logout() {
        this.token = null;
        this.agentId = null;
        localStorage.removeItem('veil_token');
    }

    isAuthenticated(): boolean {
        return !!this.token;
    }

    // --- CORE ---

    async checkHealth(): Promise<HealthResponse> {
        return this.request<HealthResponse>('/health');
    }

    async validatePacket(req: VeilRequest): Promise<VeilResponse> {
        return this.request<VeilResponse>('/veil/check', {
            method: 'POST',
            body: JSON.stringify(req),
        });
    }

    // --- AGENTS ---

    async getAgents(): Promise<Agent[]> {
        return this.request<Agent[]>('/agents');
    }

    async registerAgent(agent: Partial<Agent>): Promise<Agent> {
        return this.request<Agent>('/agents', {
            method: 'POST',
            body: JSON.stringify(agent),
        });
    }

    async deleteAgent(id: string): Promise<void> {
        return this.request<void>(`/agents/${id}`, { method: 'DELETE' });
    }

    // --- LOGS ---

    async getLogs(): Promise<AuditLog[]> {
        return this.request<AuditLog[]>('/logs');
    }

    async resolveLog(id: string, resolution: string, notes: string): Promise<AuditLog> {
        return this.request<AuditLog>(`/logs/${id}/resolve`, {
            method: 'PATCH',
            body: JSON.stringify({ resolution, notes }),
        });
    }

    // --- POLICIES ---

    async getPolicies(): Promise<Policy[]> {
        return this.request<Policy[]>('/policies');
    }

    async createPolicy(policy: Partial<Policy>): Promise<Policy> {
        return this.request<Policy>('/policies', {
            method: 'POST',
            body: JSON.stringify(policy),
        });
    }

    async convertPolicy(naturalLanguage: string): Promise<any> {
        return this.request<any>('/policies/convert', {
            method: 'POST',
            body: JSON.stringify({ naturalLanguage }),
        });
    }
}

export const api = new VeilApiClient();
