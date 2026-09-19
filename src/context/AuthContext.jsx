/* eslint-disable react/only-export-components */
import { createContext, useContext, useState } from 'react';
import * as dataService from '../services/dataService.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => dataService.readSession());

  async function login(email, password) {
    const session = await dataService.login(email, password);
    if (session) setUser(session);
    return session;
  }

  function logout() {
    dataService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}