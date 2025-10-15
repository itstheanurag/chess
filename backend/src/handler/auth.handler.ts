import type { Request, Response } from "express";
import { redisClient, REDIS_KEYS } from "@/libs";
import { generateToken, generateAccessToken } from "@/utils/jwt";
import { registerSchema, loginSchema } from "@/schema";
import { sendError, sendResponse } from "@/utils/helper";
import { comparePassword, hashPassword } from "@/utils";
import { AuthenticatedRequest } from "@/types";
import { authStorage } from "@/storage/auth";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error);

    const data = parsed.data;
    const existingUser = await authStorage.findUserByEmail(data.email);
    if (existingUser) return sendError(res, 400, "Email already in use");

    const toCreate = {
      username: data.username,
      email: data.email,
      password: data.password,
    };
    const user = await authStorage.createUser(toCreate);

    return sendResponse(
      res,
      201,
      user,
      "User registered successfully. Please login"
    );
  } catch (err) {
    return sendError(res, 400, err as Error);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) return sendError(res, 400, parsed.error);

    const data = parsed.data;
    const user = await authStorage.findUserByEmail(data.email);
    if (!user || !comparePassword(data.password, user.passwordHash)) {
      return sendError(res, 400, "Invalid credentials");
    }

    const tokens = await generateToken({
      id: user.id.toString(),
      name: user.username,
      email: user.email,
    });

    return sendResponse(
      res,
      200,
      { id: user.id, name: user.username, email: user.email, tokens },
      "Login successful"
    );
  } catch (err) {
    return sendError(res, 500, "Internal Server Error", err);
  }
};

export const userLogInCheck = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const { user } = req;
    return sendResponse(res, 200, user, "user is loggedIn");
  } catch (err) {
    return sendError(res, 500, "Internal Server Error", err);
  }
};

export const refreshAccessToken = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user!;

    const accessToken = await generateAccessToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return sendResponse(
      res,
      200,
      { accessToken },
      "Tokens refreshed successfully"
    );
  } catch (err) {
    return sendError(res, 500, "Failed to refresh token");
  }
};

export const logout = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<Response> => {
  try {
    const user = req.user;

    if (!user) {
      return sendError(res, 400, "User not found");
    }

    await redisClient.del(`${REDIS_KEYS.accessTokenKey}:${user.id}`);
    await redisClient.del(`${REDIS_KEYS.refreshTokenKey}:${user.id}`);

    return sendResponse(res, 200, null, "Logged out successfully");
  } catch (err) {
    return sendError(res, 500, "Failed to log out");
  }
};
