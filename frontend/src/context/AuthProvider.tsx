// AuthProvider.tsx
import React, { useState, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

interface AuthProviderProps {
  children: ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [accessToken, setAccessToken] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [refreshToken, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refreshToken")
  );
  const navigate = useNavigate();

  const login = async (data: { username: string; password: string }) => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      console.log("RESPONSE ", res)
      if (res.data) {
        setUser(res.data.user);
        setAccessToken(res.data.accessToken);
        setRefreshToken(res.data.refreshToken);
        localStorage.setItem("accessToken", res.data.accessToken);
        localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/dashboard");
      } else {
        throw new Error(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const logOut = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, refreshToken, login, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
