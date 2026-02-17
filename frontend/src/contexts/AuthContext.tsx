import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../api/client';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  position: string;
  seniority: string;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  login: (email: string, password: string) => Promise<{ user: User }>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

interface RegisterData {
  email: string;
  password: string;
  name: string;
  position: string;
  seniority: string;
}

const AuthContext = createContext<AuthState | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/users/me');
      setUser({
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role,
        position: data.position,
        seniority: data.seniority,
      });
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      const u = data.user;
      setUser({
        id: u.id,
        email: u.email,
        name: u.name,
        role: u.role,
        position: u.position,
        seniority: u.seniority,
      });
      return { user: data.user };
    },
    []
  );

  const register = useCallback(async (body: RegisterData) => {
    await api.post('/auth/register', body);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, setUser, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
