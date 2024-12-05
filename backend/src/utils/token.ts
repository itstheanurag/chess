import jwt from 'jsonwebtoken';
import { 
  ACCESS_TOKEN_EXPIRE_TIME, 
  ACCESS_TOKEN_SECRET, 
  REFRESH_TOKEN_EXPIRE_TIME, 
  REFRESH_TOKEN_SECRET 
} from 'src/config';
import { UserType } from 'src/types';
const generateAccessToken = (userId: string) =>
  jwt.sign({ id:userId, type: 'access' }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRE_TIME });

const generateRefreshToken = (userId: string) =>
  jwt.sign({  id:userId, type: 'refresh' }, REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRE_TIME });


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
