'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api, ApiException } from '@/lib/api-client';
import { getToken, setToken, removeToken, isTokenExpired } from '@/lib/token';
import { type AuthRole } from '@/lib/auth-routes';

// ── Types ──────────────────────────────────────────────────────────

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role: AuthRole;
  status: string;
  department?: string;
  specialization?: string;
  years_of_experience?: number;
  // Convenience getter
  name?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (
    email: string,
    password: string,
    expectedRole?: AuthRole
  ) => Promise<{ success: boolean; message: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: AuthRole;
}

interface AuthResponseData {
  token: string;
  user: User;
}

interface PatientAuthResponseData {
  token: string;
  patient: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    dashboard_enabled?: number;
  };
}

// ── Context ────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const getTokenRole = (token: string): AuthRole | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const decoded = JSON.parse(atob(payload));
    return (decoded?.role as AuthRole) || null;
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Build display name from first/last
  const enrichUser = (u: User): User => ({
    ...u,
    name: u.name || `${u.first_name} ${u.last_name}`.trim(),
  });

  // ── Hydrate session on mount ──────────────────────────────────

  const hydrate = useCallback(async () => {
    const token = getToken();

    if (!token || isTokenExpired()) {
      removeToken();
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const tokenRole = getTokenRole(token);
      if (tokenRole === 'patient') {
        const patientRes = await api.get<{ patient: { id: number; first_name: string; last_name: string; email: string } }>('/patient/dashboard');
        if (patientRes.data?.patient) {
          setUser(
            enrichUser({
              id: String(patientRes.data.patient.id),
              first_name: patientRes.data.patient.first_name,
              last_name: patientRes.data.patient.last_name,
              email: patientRes.data.patient.email,
              role: 'patient',
              status: 'active',
            })
          );
          setIsLoading(false);
          return;
        }
      }

      const res = await api.get<{ user: User }>('/auth/me');
      if (res.data?.user) {
        setUser(enrichUser(res.data.user));
      } else {
        removeToken();
        setUser(null);
      }
    } catch {
      removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // ── Login ─────────────────────────────────────────────────────

  const login = async (
    email: string,
    password: string,
    expectedRole?: AuthRole
  ): Promise<{ success: boolean; message: string }> => {
    try {
      if (expectedRole === 'patient') {
        const res = await api.post<PatientAuthResponseData>('/patient/login', { email, password });
        if (res.data?.token && res.data?.patient) {
          setToken(res.data.token);
          setUser(
            enrichUser({
              id: String(res.data.patient.id),
              first_name: res.data.patient.first_name,
              last_name: res.data.patient.last_name,
              email: res.data.patient.email,
              role: 'patient',
              status: 'active',
            })
          );
          return { success: true, message: res.message };
        }
        return { success: false, message: 'Unexpected response from server.' };
      }

      const res = await api.post<AuthResponseData>('/auth/login', { email, password });

      if (res.data?.token && res.data?.user) {
        if (expectedRole && res.data.user.role !== expectedRole) {
          removeToken();
          setUser(null);
          return {
            success: false,
            message: `This account does not have ${expectedRole.replace('_', ' ')} access.`,
          };
        }

        setToken(res.data.token);
        setUser(enrichUser(res.data.user));
        return { success: true, message: res.message };
      }

      return { success: false, message: 'Unexpected response from server.' };
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : 'Network error. Please check your connection.';
      return { success: false, message };
    }
  };

  // ── Register ──────────────────────────────────────────────────

  const register = async (
    data: RegisterData
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await api.post<AuthResponseData>('/auth/register', data);

      if (res.data?.token && res.data?.user) {
        setToken(res.data.token);
        setUser(enrichUser(res.data.user));
        return { success: true, message: res.message };
      }

      return { success: false, message: 'Unexpected response from server.' };
    } catch (err) {
      const message =
        err instanceof ApiException
          ? err.message
          : 'Network error. Please check your connection.';
      return { success: false, message };
    }
  };


  // ── Logout ────────────────────────────────────────────────────

  const logout = () => {
    removeToken();
    setUser(null);
    // Optional: redirect handled by protected route components
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
