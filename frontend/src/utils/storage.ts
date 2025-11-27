import { AuthUser } from "@/types";

type TokenType = "accessToken" | "refreshToken" | "emailVerificationToken";

/**
 * Get a token from localStorage.
 * @param type - The token type to retrieve.
 * @returns The token string or null if not found.
 */
export const getToken = (type: TokenType): string | null => {
  return localStorage.getItem(type);
};

/**
 * Save a token to localStorage.
 * @param type - The token type to save.
 * @param value - The token value to store.
 */
export const saveToken = (key: TokenType, token: string | null) => {
  if (!token) {
    console.warn("Trying to save undefined token for", key);
    return;
  }
  localStorage.setItem(key, token);
};
/**
 * Remove a token from localStorage.
 * @param type - The token type to remove.
 */
export const removeToken = (type: TokenType): void => {
  localStorage.removeItem(type);
};

export const flushLocalTokens = () => {
  removeToken("accessToken");
  removeToken("refreshToken");
  removeUser();
};

export const saveUser = (user: AuthUser) => {
  localStorage.setItem("authUser", JSON.stringify(user));
};

export const getUser = () => {
  return localStorage.getItem("authUser");
};

export const removeUser = () => {
  localStorage.removeItem("authUser");
};
