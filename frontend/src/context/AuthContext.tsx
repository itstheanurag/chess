// AuthContext.tsx
import { createContext } from "react";

interface AuthContextType {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logOut: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
