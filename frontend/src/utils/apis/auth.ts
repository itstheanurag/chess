import { authClient } from "@/lib/auth-client";
import {
  LoginData,
  AuthUser,
  RegisterData,
  SearchData,
  SearchUserResponse,
} from "@/types";
import { removeUser, saveUser } from "../storage";
import { Tokens, ServerResponse } from "@/types/server";
import { handleError } from "../errors";
import { errorToast, successToast } from "../toast";
import api from "@/lib/axios";

export const loginUser = async (
  data: LoginData
): Promise<{ user: AuthUser; tokens: Tokens } | null> => {
  try {
    const { data: responseData, error } = await authClient.signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      errorToast(error.message || "Login failed");
      return null;
    }

    if (!responseData) {
      errorToast("No response from server");
      return null;
    }

    const user: AuthUser = {
      id: responseData.user.id,
      email: responseData.user.email || "",
      // @ts-ignore - custom fields might not be typed in client yet
      username: responseData.user.username || responseData.user.name || "",
    };

    // Better Auth uses cookies, so we don't need to manage tokens manually.
    // However, to keep compatibility with existing store, we can return dummy tokens or null.
    // Ideally, we should refactor the store to not rely on tokens.
    const tokens: Tokens = {
      accessToken: "cookie-based-session",
      refreshToken: "cookie-based-session",
    };

    saveUser(user);
    // saveToken("accessToken", tokens.accessToken); // No need to save tokens
    // saveToken("refreshToken", tokens.refreshToken);

    successToast("Logged in successfully");

    return { user, tokens };
  } catch (err: unknown) {
    console.log("errr ", err);
    return handleError(err);
  }
};

export const registerUser = async (data: RegisterData): Promise<boolean> => {
  try {
    const { data: responseData, error } = await authClient.signUp.email({
      email: data.email,
      password: data.password,
      name: data.username,
      // @ts-ignore - passing extra fields
      username: data.username,
    });

    if (error) {
      console.error("Registration failed", error);
      errorToast(error.message || "Registration failed");
      return false;
    }

    successToast("Account created successfully");
    return true;
  } catch (err) {
    console.error("Registration error:", err);
    errorToast("An unexpected error occurred");
    return false;
  }
};

export const logoutUser = async () => {
  try {
    await authClient.signOut();
    removeUser();
    // removeToken("accessToken");
    // removeToken("refreshToken");
    console.log("Logged out successfully");
    successToast("Logged out successfully");
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
