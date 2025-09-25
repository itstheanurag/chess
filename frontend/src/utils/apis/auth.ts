import api from "@/lib/axios";
import { LoginData, AuthUser, RegisterData } from "@/types";
import { removeToken, removeUser } from "../storage";
import {
  Tokens,
  LoginResponseData,
  RegisterResponseData,
  ServerResponse,
} from "@/types/server";

export const loginUser = async (
  data: LoginData
): Promise<{ user: AuthUser; tokens: Tokens } | null> => {
  try {
    const response = await api.post<ServerResponse<LoginResponseData>>(
      "/login",
      JSON.stringify(data)
    );

    if (!response.data.status || !response.data.data) {
      console.error("Login failed");
      return null;
    }

    const user: AuthUser = {
      id: response.data.data.id,
      name: response.data.data.name,
      email: response.data.data.email,
    };

    const tokens = response.data.data.tokens;

    return { user, tokens };
  } catch (error) {
    console.error("Login error:", error);
    return null;
  }
};

export const registerUser = async (
  data: RegisterData
): Promise<{ user: AuthUser; tokens: Tokens } | null> => {
  try {
    const response = await api.post<ServerResponse<RegisterResponseData>>(
      "/register",
      JSON.stringify(data)
    );

    if (!response.data.status || !response.data.data) {
      console.error("Registration failed");
      return null;
    }

    const user: AuthUser = {
      id: response.data.data.id,
      name: response.data.data.name,
      email: response.data.data.email,
    };

    const tokens = response.data.data.tokens;

    return { user, tokens };
  } catch (error) {
    console.error("Registration error:", error);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/logout");
    removeUser();
    removeToken("accessToken");
    removeToken("refreshToken");
    console.log("Logged out successfully");
  } catch (error) {
    console.error("Logout error:", error);
  }
};
