import { Request } from "express";

export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  username?: string | null;
  rating?: number;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
}

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: Session;
  chat?: any;
}
