import api from "@/lib/axios";
import {
  LoginData,
  AuthUser,
  RegisterData,
  SearchData,
  SearchUserResponse,
} from "@/types";
import { removeToken, removeUser, saveToken, saveUser } from "../storage";
import {
  Tokens,
  LoginResponseData,
  RegisterResponseData,
  ServerResponse,
} from "@/types/server";
import { error, success } from "../toast";
import { handleError } from "../errors";

export const loginUser = async (
  data: LoginData
): Promise<{ user: AuthUser; tokens: Tokens } | null> => {
  try {
    const response = await api.post<ServerResponse<LoginResponseData>>(
      "/auth/login",
      data
    );

    if (response.status !== 200) {
      console.error("Login failed: status code", response.status);
      error("Login failed. Please try again.");
      return null;
    }

    const responseData = response.data;

    console.log(responseData);
    if (!responseData.success) {
      error(responseData.message || "Login failed");
      return null;
    }

    const serverData = responseData.data;

    if (!serverData || !serverData.tokens) {
      error("Invalid server response");
      return null;
    }

    const user: AuthUser = {
      id: serverData.id!,
      name: serverData.name!,
      email: serverData.email!,
    };

    const tokens: Tokens = {
      accessToken: serverData.tokens.accessToken,
      refreshToken: serverData.tokens.refreshToken,
    };

    saveUser(user);
    saveToken("accessToken", tokens.accessToken);
    saveToken("refreshToken", tokens.refreshToken);
    success(responseData.message || "Logged in successfully");

    return { user, tokens };
  } catch (err: unknown) {
    console.log("errr ", err);
    return handleError(err);
  }
};

export const registerUser = async (data: RegisterData): Promise<null> => {
  try {
    const response = await api.post<ServerResponse<RegisterResponseData>>(
      "/auth/register",
      JSON.stringify(data)
    );

    if (!response.data.success || !response.data.data) {
      console.error("Registration failed");
      error(response.data.message);
      return null;
    }
    success(response.data.message);
    return null;
  } catch (err) {
    console.error("Registration error:", err);
    return null;
  }
};

export const logoutUser = async () => {
  try {
    await api.post("/auth/logout");
    removeUser();
    removeToken("accessToken");
    removeToken("refreshToken");
    console.log("Logged out successfully");
  } catch (err) {
    console.error("Logout error:", err);
  }
};

export const callSearchUserApi = async (
  params: SearchData
): Promise<ServerResponse<SearchUserResponse | null>> => {
  try {
    const response = await api.get<ServerResponse<SearchUserResponse>>(
      "/users",
      {
        params: {
          q: params.q ?? "",
          page: params.page ?? 1,
          size: params.size ?? 20,
        },
      }
    );

    if (!response.data) {
      return {
        success: false,
        message: "No data received from search API",
        data: null,
      };
    }

    return response.data;
  } catch (err) {
    console.error("Search user error:", err);
    return {
      success: false,
      message: "Failed to search users",
      data: null,
    };
  }
};
