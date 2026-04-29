import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../lib/api';

interface User {
    id: string;
    email: string;
    business_name: string;
    business_type: string | null;
    created_at: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}

interface AuthContextType extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    register: (data: RegisterData) => Promise<void>;
    logout: () => void;
}

interface RegisterData {
    email: string;
    password: string;
    business_name: string;
    business_type?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    // Restore session from localStorage on mount
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const savedUser = localStorage.getItem('user');
        if (token && savedUser) {
            try {
                setState({ user: JSON.parse(savedUser), isAuthenticated: true, isLoading: false });
            } catch {
                logout();
            }
        } else {
            setState((s) => ({ ...s, isLoading: false }));
        }
    }, []);

    const saveSession = (data: { access_token: string; refresh_token: string; user: User }) => {
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('refresh_token', data.refresh_token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setState({ user: data.user, isAuthenticated: true, isLoading: false });
    };

    const login = async (email: string, password: string) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            saveSession(data);
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (formData: RegisterData) => {
        try {
            const { data } = await api.post('/auth/register', formData);
            saveSession(data);
        } catch (error) {
            console.error('Register failed:', error);
            throw error;
        }
    };

    const logout = useCallback(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        setState({ user: null, isAuthenticated: false, isLoading: false });
    }, []);

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextType {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}
