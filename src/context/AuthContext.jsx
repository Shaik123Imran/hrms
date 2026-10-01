import { createContext, useContext, useState } from "react";
import * as dataService from "../services/dataService.js";
const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(dataService.readSession());

  const login = async (email, password, role) => {
    const userData = await dataService.login(email, password, role);
    if(!userData){
      return false;
    }
    setUser(userData);
    return true;
  };
  
  const logout = () => {
    dataService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout,role: user?.role, isAuthenticated: Boolean(user),}}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
