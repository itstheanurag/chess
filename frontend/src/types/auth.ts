export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthState {
  authUser: AuthUser | null;
  username: string;
  email: string;
  password: string;
  isLoading: boolean;
  setField: (field: "username" | "email" | "password", value: string) => void;
  resetFields: () => void;
  register: (data?: RegisterData) => Promise<void>;
  login: (data?: LoginData) => Promise<void>;
  logout: () => Promise<void>;
}
