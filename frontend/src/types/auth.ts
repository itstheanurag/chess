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
  register: (data: RegisterData) => void;
  login: (data: LoginData) => void;
  logout: () => void;
}
