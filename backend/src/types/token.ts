import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayloadOptions extends JwtPayload {
  id: number;
  email: string;
  name: string;
}

export interface AuthenticatedRequest extends Request {
  user?: JwtPayloadOptions;
  chat?: any;
}
