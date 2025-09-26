export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface ServerResponse<T> {
  success: boolean;
  message: string;
  data?: T | null;
}

export interface LoginResponseData {
  id: string;
  name: string;
  email: string;
  tokens: Tokens;
}

export interface RegisterResponseData {
  id: string;
  name: string;
  email: string;
  tokens: Tokens;
}
