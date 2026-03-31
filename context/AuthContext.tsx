'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'patient' | 'doctor' | 'lab_technician' | 'nurse' | 'admin';
  department?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, role: 'patient' | 'doctor' | 'lab_technician' | 'nurse' | 'admin') => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authUser');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const login = (email: string, password: string, role: 'patient' | 'doctor' | 'lab_technician' | 'nurse' | 'admin'): boolean => {
    // Mock authentication with demo credentials
    const credentials: Record<string, { email: string; password: string }> = {
      patient: { email: 'patient@hospital.com', password: 'patient123' },
      doctor: { email: 'doctor@hospital.com', password: 'doctor123' },
      lab_technician: { email: 'labtech@hospital.com', password: 'labtech123' },
      nurse: { email: 'nurse@hospital.com', password: 'nurse123' },
      admin: { email: 'admin@hospital.com', password: 'admin123' }
    };

    const cred = credentials[role];
    if (!cred || email !== cred.email || password !== cred.password) {
      return false;
    }





    let newUser: User;

    switch (role) {
      case 'patient':
        newUser = {
          id: 'P001',
          name: 'John Sharma',
          email: email,
          role: 'patient'
        };
        break;
      case 'doctor':
        newUser = {
          id: 'DOC001',
          name: 'Dr. Rajesh Kumar',
          email: email,
          role: 'doctor',
          department: 'Cardiology'
        };
        break;
      case 'lab_technician':
        newUser = {
          id: 'LAB001',
          name: 'Priya Patel',
          email: email,
          role: 'lab_technician',
          department: 'Laboratory'
        };
        break;
      case 'nurse':
        newUser = {
          id: 'NURSE001',
          name: 'Aisha Khan',
          email: email,
          role: 'nurse',
          department: 'Nursing'
        };
        break;
      case 'admin':
        newUser = {
          id: 'ADMIN001',
          name: 'Hospital Admin',
          email: email,
          role: 'admin'
        };
        break;
      default:
        return false;
    }

    setUser(newUser);
    localStorage.setItem('authUser', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
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
