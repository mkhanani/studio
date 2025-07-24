"use client"

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { mockUsers } from '@/lib/mock-data';
import type { User } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => boolean;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProviderComponent = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for a logged-in user in session storage
    const storedUser = sessionStorage.getItem('authUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    sessionStorage.setItem('authUser', JSON.stringify(updatedUser));
  }

  const login = (email: string): boolean => {
    setLoading(true);
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      sessionStorage.setItem('authUser', JSON.stringify(foundUser));
      setLoading(false);
      return true;
    }
    setLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem('authUser');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
