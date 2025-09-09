import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  username: string;
  role: 'doctor' | 'admin';
  abhaId?: string;
  abhaToken?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string, role: 'doctor' | 'admin') => boolean;
  loginWithABHA: (abhaId: string, token: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (username: string, password: string, role: 'doctor' | 'admin'): boolean => {
    // Simple authentication - in production, this would be actual validation
    if (username && password) {
      setUser({ username, role });
      return true;
    }
    return false;
  };

  const loginWithABHA = async (abhaId: string, token: string): Promise<boolean> => {
    // Mock ABHA authentication - in production, validate with ABHA service
    if (abhaId.startsWith('ABHA-') && token) {
      setUser({
        username: abhaId,
        role: 'doctor',
        abhaId,
        abhaToken: token
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      loginWithABHA,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}