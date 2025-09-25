import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthUser {
  id: string;
  name: string;
}

interface AuthContextType {
  authUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  const login = (user: AuthUser) => {
    localStorage.setItem("authUser", JSON.stringify(user));
    setAuthUser(user);
  };

  const logout = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
