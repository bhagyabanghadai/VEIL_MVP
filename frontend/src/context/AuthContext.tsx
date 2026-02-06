import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

interface AuthContextType {
    isAuthenticated: boolean;
    agentId: string | null;
    login: (agentId: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [agentId, setAgentId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        // Hydrate from storage or validate token
        const token = localStorage.getItem('veil_token');
        if (token && api.isAuthenticated()) {
            setIsAuthenticated(true);
            // In a real app, we might decode JWT to get agentId
        }
        setIsLoading(false);
    }, []);

    const login = async (id: string) => {
        try {
            await api.handshake(id);
            setAgentId(id);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const logout = () => {
        api.logout();
        setIsAuthenticated(false);
        setAgentId(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, agentId, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
