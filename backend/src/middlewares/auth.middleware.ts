import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { accessTokenCache, refreshTokenCache } from "src/cache";
import { UserType } from "src/types";
import { verifyAccessToken, verifyRefreshToken } from "src/utils";

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

  const cachedToken = accessTokenCache.get(token);

  if (!cachedToken) {
     res.status(401).json({ message: "Invalid token" });
     return;
  }

  try {
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      accessTokenCache.del(token);
       res.status(401).json({ message: "Invalid token" });
       return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    accessTokenCache.del(token);
    res.status(401).json({ message: "Invalid or expired token" });
    return;
  }
}


export const refreshTokenGuard = (req: Request, res: Response, next: NextFunction) => {
  const refreshToken = req.body.refreshToken || req.headers['authorization']?.split(' ')[1]; 

  if (!refreshToken) {
     res.status(400).json({ message: "Refresh token is required" });
     return;
  }

  const cachedToken = refreshTokenCache.get(refreshToken);

  if (!cachedToken) {
     res.status(403).json({ message: "Invalid refresh token" });
     return;
  }

  try {
    const decoded = verifyRefreshToken(refreshToken); 
    if (!decoded) {
       res.status(403).json({ message: "Invalid or expired refresh token" });
       return;
    }
    req.user = decoded; 
    next(); 
  } catch (error:any) { 
    refreshTokenCache.del(refreshToken);
     res.status(403).json({ message: "Invalid or expired refresh token", error: error.message });
     return;
  }
};