import { create } from "zustand";
import {
  AuthState,
  AuthUser,
  RegisterData,
  LoginData,
  SearchData,
  SearchUserResponse,
  ServerResponse,
} from "@/types";
import {
  getUser,
  logoutUser,
  loginUser,
  registerUser,
  callSearchUserApi,
} from "@/types/utils";

export const useAuthStore = create<AuthState>((set, get) => ({
  authUser:
    typeof window !== "undefined"
      ? (JSON.parse(getUser() || "null") as AuthUser | null)
      : null,

  username: "",
  email: "",
  password: "",
  isLoading: false,

  setField: (field, value) =>
    set((state) => ({
      ...state,
      [field]: value,
    })),
  resetFields: () =>
    set({ username: "", email: "", password: "", isLoading: false }),

  register: async (data?: RegisterData) => {
    set({ isLoading: true });
    try {
      const state: RegisterData = data ?? {
        username: get().username,
        email: get().email,
        password: get().password,
      };
      await registerUser(state);
      return true;
    } catch (err) {
      console.error("Register error in store:", err);
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (data?: LoginData) => {
    set({ isLoading: true });
    try {
      const state: LoginData = data ?? {
        email: get().email,
        password: get().password,
      };

      const result = await loginUser(state);
      if (!result) return;
      set({ authUser: result.user });
    } catch (err) {
      console.error("Login error in store:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await logoutUser();
      localStorage.removeItem("authUser");
      set({ authUser: null });
    } catch (err) {
      console.error("Logout error in store:", err);
    }
  },

  searchUser: async (
    query: SearchData
  ): Promise<ServerResponse<SearchUserResponse | null>> => {
    try {
      const results = await callSearchUserApi(query);
      return results;
    } catch (err) {
      console.error("Search user error:", err);
      return {
        success: false,
        message: "Failed to search users",
        data: null,
      };
    }
  },
}));
