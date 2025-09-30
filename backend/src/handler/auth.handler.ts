import type { Request, Response } from "express";
import { redisClient, REDIS_KEYS } from "@/libs";
import { generateToken, generateAccessToken } from "@/utils/jwt";
import { registerSchema, loginSchema } from "@/schema";
import { sendError, sendResponse } from "@/utils/helper";
import prisma from "@/libs/db";
import { comparePassword, hashPassword } from "@/utils";
import { AuthenticatedRequest } from "@/types";

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const parsedResult = registerSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error);
    }

    const parsedData = parsedResult.data;

    const existingUser = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (existingUser) {
      return sendError(res, 400, "Email already in use");
    }

    const user = await prisma.user.create({
      data: {
        username: parsedData.username,
        email: parsedData.email,
        passwordHash: hashPassword(parsedData.password),
      },
    });

    return sendResponse(
      res,
      201,
      { ...user },
      "User registered successfully. Please login"
    );
  } catch (err) {
    return sendError(res, 400, err as Error);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsedResult = loginSchema.safeParse(req.body);

    if (!parsedResult.success) {
      return sendError(res, 400, parsedResult.error);
    }

    const parsedData = parsedResult.data;

    const user = await prisma.user.findUnique({
      where: { email: parsedData.email },
    });

    if (!user) {
      return sendError(res, 400, "Invalid credentials");
    }

    if (!comparePassword(parsedData.password, user.passwordHash)) {
      return sendError(res, 400, "Invalid credentials");
    }
    const userDetails = {
      id: user.id.toString(),
      name: user.username,
      email: user.email,
    };

    const tokens = await generateToken(userDetails);

    return sendResponse(
      res,
      200,
      {
        ...userDetails,
        tokens,
      },
      "Login successful"
    );
  } catch (err) {
    return sendError(res, 400, err);
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
    return sendError(res, 400, err);
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
