import {Response, Request} from 'express';
import { prisma } from '../db';
import { createUser, findUser } from '../repositories';
import { AccessToken, LoginResponse, UserCreatedResponse } from 'src/types';
import { 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken, 
  hashPassword, 
  verifyRefreshToken 
} from 'src/utils';

const tokens: Record<string, string> = {};

const registerUser = async (req: Request, res: Response<UserCreatedResponse>) => {
  try {
    const { username, password } = req.body;

    // Check if user already exists
    const existingUser = await findUser(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const passwordhash = await hashPassword(password);
    // Create user
    const user = await createUser({username, password: passwordhash})

    return res.status(201).json({ success: true, message: "User registered successfully", data: user });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

const loginUser = async (req: Request, res: Response<LoginResponse>) => {
  try {
    const { username, password } = req.body;

    // Check if user exists
    const user = await findUser(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    tokens[user.id] = refreshToken;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user,
        accessToken,
        refreshToken,
      },
    });
  } catch (error: any) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
}

const reLoginUser = async(req: Request, res: Response<AccessToken>) =>{
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required" });
  }

  try {
    const decoded = verifyRefreshToken(refreshToken); // Verify refresh token
    
    // Validate stored refresh token
    if (tokens[decoded.id] !== refreshToken) { // Assuming `decoded.userId` is part of the token payload
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    // Generate a new access token
    const accessToken = generateAccessToken(decoded.id);

    return res.status(200).json({
      success: true,
      message: "Access token generated successfully",
      data: { accessToken } 
    });
  } catch (error: any) {
    return res.status(403).json({ message: "Invalid or expired refresh token", error: error.message });
  }
}


export {registerUser, loginUser, reLoginUser}