import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../../types';
import { MockService } from '../../services/mockService';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Check for persisted session on mount (simulated)
  useEffect(() => {
    const checkSession = async () => {
      const savedUser = localStorage.getItem('neonlens_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };
    checkSession();
  }, []);

  const login = async (email: string) => {
    setLoading(true);
    try {
      const loggedInUser = await MockService.login(email);
      setUser(loggedInUser);
      localStorage.setItem('neonlens_user', JSON.stringify(loggedInUser));
    } catch (error) {
      console.error("Login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await MockService.logout();
    setUser(null);
    localStorage.removeItem('neonlens_user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
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