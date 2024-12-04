import {Response, Request} from 'express';
import { createUser, findUser } from '../repositories';
import { AccessToken, LoginResponse, UserCreatedResponse } from 'src/types';
import { 
  comparePassword, 
  generateAccessToken, 
  generateRefreshToken, 
  hashPassword, 
  verifyRefreshToken 
} from 'src/utils';
import { accessTokenCache, refreshTokenCache } from 'src/cache';

const registerUser = async (req: Request, res: Response<UserCreatedResponse>) => {
  try {
    const { username, password } = req.body;

    const existingUser = await findUser(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const passwordhash = await hashPassword(password);
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

    const user = await findUser(username);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = comparePassword(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    accessTokenCache.set(accessToken, user.id, 3600);  
    refreshTokenCache.set(refreshToken, user.id, 86400); 

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
  try {
    const decoded = verifyRefreshToken(refreshToken);
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