import { User } from "@prisma/client";

export type ApiResponse<T> = 
  | { success? : boolean, message: string; data: T }
  | { message: string; error?: string };


export type UserCreatedResponse = ApiResponse<User>;
export type FindUserResponse = ApiResponse<User>;
export type FindUserListResponse = ApiResponse<User[]>;
export type LoginResponse = ApiResponse<{ user: User; accessToken: string; refreshToken: string }>;
export type AccessToken = ApiResponse<{ accessToken: string }>;
