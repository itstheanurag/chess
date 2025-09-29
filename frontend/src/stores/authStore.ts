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
} from "@/utils";

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
    } catch (err) {
      console.error("Register error in store:", err);
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

      console.log("result from the auth user ", result);
      set({ authUser: result.user });
      console.log("Logged in user:", result.user);
    } catch (err) {
      console.error("Login error in store:", err);
    } finally {
      set({ isLoading: false });
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
