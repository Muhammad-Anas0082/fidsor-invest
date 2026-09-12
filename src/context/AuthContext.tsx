import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { DEMO_USERS, DEMO_PASSWORD, getStoredSession, saveSession, clearSession } from '../lib/auth';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, pass: string, keepSignedIn?: boolean) => boolean;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const session = getStoredSession();
    if (session) {
      const user = DEMO_USERS.find(u => u.id === session.userId);
      if (user) return user;
    }
    // No session -> show login page
    return null;
  });

  const login = (email: string, pass: string, keepSignedIn: boolean = true): boolean => {
    const normalizedEmail = email.trim().toLowerCase();
    if (pass.trim().toLowerCase() !== DEMO_PASSWORD.toLowerCase()) {
      return false;
    }

    const user = DEMO_USERS.find(
      u =>
        u.email.toLowerCase() === normalizedEmail ||
        u.email.split('@')[0].toLowerCase() === normalizedEmail.split('@')[0].toLowerCase()
    );

    if (user) {
      setCurrentUser(user);
      saveSession(user.id, keepSignedIn);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.roleId === 'administrator'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
