import jwt from 'jsonwebtoken';
import { UserType } from 'src/types';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'your_access_token_secret';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your_refresh_token_secret';

const generateAccessToken = (userId: string) =>
  jwt.sign({ userId }, ACCESS_TOKEN_SECRET, { expiresIn: '15m' });

const generateRefreshToken = (userId: string) =>
  jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

const verifyAccessToken = (token: string) => {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET) as UserType; 
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
};

// Function to verify the refresh token
const verifyRefreshToken = (token: string) => {
  try {
    return jwt.verify(token, REFRESH_TOKEN_SECRET) as UserType;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
};

export { generateAccessToken, generateRefreshToken, verifyAccessToken, verifyRefreshToken };