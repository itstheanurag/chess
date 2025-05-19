import { createContext, useContext, useState, type ReactNode } from "react";

// Your AuthUser type
interface AuthUser {
  id: string;
  name: string;
}

// Define the context type
interface AuthContextType {
  authUser: AuthUser | null;
  login: (user: AuthUser) => void;
  logout: () => void;
}

// ✅ Provide the full type instead of just `null`
const AuthContext = createContext<AuthContextType | null>(null);

// Custom hook to use the AuthContext safely
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider with typed children
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
