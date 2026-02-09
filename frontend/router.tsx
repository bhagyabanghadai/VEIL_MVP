/**
 * VEIL Router Configuration
 * Uses React Router v7 Data Mode with loaders, actions, and error boundaries.
 * Based on Context7 best practices.
 */
import {
    createBrowserRouter,
    redirect,
    type LoaderFunctionArgs,
    type ActionFunctionArgs,
} from 'react-router';
import { getAgents, getPolicies, getLogs, getSystemInsights } from './services/scaffoldService';

// ============================================
// LOADERS - Pre-fetch data before rendering
// ============================================

/**
 * Root loader - Fetches auth state and system insights
 */
export async function rootLoader() {
    const token = localStorage.getItem('veil_token');
    const isAuthenticated = !!token;

    if (isAuthenticated) {
        try {
            const insights = await getSystemInsights();
            return {
                isAuthenticated,
                insights,
                user: { name: 'Admin', role: 'admin' }
            };
        } catch (error) {
            console.warn('Failed to fetch root data:', error);
            return { isAuthenticated, insights: null, user: null };
        }
    }

    return { isAuthenticated: false, insights: null, user: null };
}

/**
 * Dashboard loader - Fetches agents, policies, and logs in parallel
 */
export async function dashboardLoader(): Promise<{
    agents: any[];
    policies: any[];
    logs: any[];
}> {
    const token = localStorage.getItem('veil_token');
    if (!token) {
        throw redirect('/login');
    }

    try {
        // Parallel data fetching for faster load
        const [agents, policies, logs] = await Promise.all([
            getAgents(),
            getPolicies(),
            getLogs()
        ]);

        return { agents, policies, logs };
    } catch (error: any) {
        if (error.message === 'Unauthorized') {
            localStorage.removeItem('veil_token');
            throw redirect('/login');
        }
        // Return empty data on network errors
        console.warn('Dashboard loader error:', error);
        return { agents: [], policies: [], logs: [] };
    }
}

/**
 * Agents page loader
 */
export async function agentsLoader() {
    const token = localStorage.getItem('veil_token');
    if (!token) throw redirect('/login');

    const agents = await getAgents();
    return { agents };
}

/**
 * Policies page loader
 */
export async function policiesLoader() {
    const token = localStorage.getItem('veil_token');
    if (!token) throw redirect('/login');

    const policies = await getPolicies();
    return { policies };
}

/**
 * Logs page loader
 */
export async function logsLoader() {
    const token = localStorage.getItem('veil_token');
    if (!token) throw redirect('/login');

    const [logs, agents] = await Promise.all([
        getLogs(),
        getAgents()
    ]);
    return { logs, agents };
}

// ============================================
// ACTIONS - Handle form submissions
// ============================================

/**
 * Login action - Handles form submission for login
 */
export async function loginAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        if (!response.ok) {
            return { error: 'Invalid credentials' };
        }

        const data = await response.json();
        localStorage.setItem('veil_token', data.token);
        return redirect('/');
    } catch (error) {
        return { error: 'Network error. Please try again.' };
    }
}

/**
 * Agent action - Handle agent create/update/delete
 */
export async function agentAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent') as string;
    const token = localStorage.getItem('veil_token');

    if (intent === 'delete') {
        const agentId = formData.get('agentId') as string;
        await fetch(`/api/agents/${agentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return { success: true, deleted: agentId };
    }

    if (intent === 'create') {
        const name = formData.get('name') as string;
        const purpose = formData.get('purpose') as string;
        const response = await fetch('/api/agents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, purpose })
        });
        const agent = await response.json();
        return { success: true, agent };
    }

    return { error: 'Invalid intent' };
}

/**
 * Policy action - Handle policy create/delete
 */
export async function policyAction({ request }: ActionFunctionArgs) {
    const formData = await request.formData();
    const intent = formData.get('intent') as string;
    const token = localStorage.getItem('veil_token');

    if (intent === 'delete') {
        const policyId = formData.get('policyId') as string;
        await fetch(`/api/policies/${policyId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        return { success: true, deleted: policyId };
    }

    if (intent === 'create') {
        const name = formData.get('name') as string;
        const naturalLanguage = formData.get('naturalLanguage') as string;
        const response = await fetch('/api/policies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, naturalLanguage })
        });
        const policy = await response.json();
        return { success: true, policy };
    }

    return { error: 'Invalid intent' };
}

/**
 * Log resolution action
 */
export async function logResolveAction({ request, params }: ActionFunctionArgs) {
    const formData = await request.formData();
    const logId = params.logId || formData.get('logId') as string;
    const resolution = formData.get('resolution') as string;
    const notes = formData.get('notes') as string;
    const token = localStorage.getItem('veil_token');

    await fetch(`/api/logs/${logId}/resolve`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ resolution, notes })
    });

    return { success: true };
}
