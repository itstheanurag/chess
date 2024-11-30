import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserType } from "src/types";
import { verifyAccessToken } from "src/utils";

export async function authUser(
  req: Request, 
  res: Response, 
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    res.status(401).json({ message: "Access token is missing" });  
    return;
  }

  try {
    const decoded = verifyAccessToken(token);  
    req.user = decoded;  
    next();  
  } catch (error) {
    res.status(401).json({ message: "Invalid or expired access token" });  
    return;
  }
}

export async function refreshTokenGuard(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const refreshToken = req.body.refreshToken; 

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is missing" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as UserType;
    req.user = decoded; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired refresh token" });
  }
}
