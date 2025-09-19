import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import { JWT_SECRET, TOKEN_EXPIRES_IN } from "@/config/config";
import { sendError, sendResponse } from "@/utils/helper";

interface UserPayload {
  id: string;
  username: string;
  email: string;
}

const users = [
  {
    id: "1",
    username: "testuser",
    email: "test@example.com",
    password: "password123",
  },
];

export const register = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { username, email, password } = req.body;
  const existingUser = users.find((user) => user.email === email);
  if (existingUser) {
    return sendError(res, "User already exists", 400);
  }

  const newUser = {
    id: (users.length + 1).toString(),
    username,
    email,
    password,
  };

  users.push(newUser);

  try {
    const token = jwt.sign(
      { userId: newUser.id, email: email },
      JWT_SECRET as jwt.Secret,
      { expiresIn: TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    return sendResponse(
      res,
      {
        id: newUser.id,
        email,
        username,
      },
      "User registered successfully"
    );
  } catch (error) {
    console.error("Registration error:", error);
    return sendError(res, "Error registering user", 500, error);
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, "Please provide email and password", 400);
    }

    const user = users.find((u) => u.email === email);
    if (!user || user.password !== password) {
      return sendError(res, "Invalid credentials", 401);
    }

    const token = jwt.sign(
      { userId: user.id, email },
      JWT_SECRET as jwt.Secret,
      { expiresIn: TOKEN_EXPIRES_IN } as jwt.SignOptions
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    return sendResponse(
      res,
      {
        id: user.id,
        email,
        username: user.username,
      },
      "Login successful"
    );
  } catch (error) {
    console.error("Login error:", error);
    return sendError(res, "Error during login", 500, error);
  }
};

export const getMe = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.user) {
      return sendError(res, "User not found", 404);
    }

    return sendResponse(res, req.user, "User fetched successfully");
  } catch (error) {
    console.error("Get user error:", error);
    return sendError(res, "Error fetching user", 500, error);
  }
};
