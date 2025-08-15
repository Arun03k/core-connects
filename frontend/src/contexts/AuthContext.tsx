import React, { createContext, type ReactNode } from 'react';
import type { AuthState } from '../types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // This is a simplified version - the actual implementation would use the hooks
  const contextValue: AuthContextValue = {
    user: null,
    tokens: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
    emailVerificationSent: false,
    passwordResetSent: false,
    login: async () => {},
    signup: async () => {},
    logout: async () => {},
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
