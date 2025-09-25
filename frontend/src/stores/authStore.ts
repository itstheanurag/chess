import { create } from "zustand";
import { AuthState, RegisterData, LoginData } from "@/types";
import { getUser, logoutUser, loginUser, registerUser } from "@/utils";

export const useAuthStore = create<AuthState>((set) => ({
  authUser:
    typeof window !== "undefined" ? JSON.parse(getUser() || "null") : null,

  register: async (data: RegisterData) => {
    try {
      const result = await registerUser(data);
      if (!result) return;

      set({ authUser: result.user });
      console.log("Registered user:", result.user);
    } catch (err) {
      console.error("Register error in store:", err);
    }
  },

  login: async (data: LoginData) => {
    try {
      const result = await loginUser(data);
      if (!result) return;

      set({ authUser: result.user });
      console.log("Logged in user:", result.user);
    } catch (err) {
      console.error("Login error in store:", err);
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      set({ authUser: null });
      console.log("Logged out successfully");
    } catch (err) {
      console.error("Logout error in store:", err);
    }
  },
}));
