/* eslint-disable react/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as dataService from '../services/dataService.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => dataService.readSession());

  const login = useCallback(async (email, password) => {
    const session = await dataService.login(email, password);
    if (session) setUser(session);
    return session;
  }, []);

  const logout = useCallback(() => {
    dataService.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, login, logout, isAuthenticated: Boolean(user) }),
    [user, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}