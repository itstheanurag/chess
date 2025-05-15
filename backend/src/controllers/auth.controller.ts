import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

import { JWT_SECRET, TOKEN_EXPIRES_IN } from '../config/config';

interface UserPayload {
  id: string;
  username: string;
  email: string;
}

// Mock user database (replace with your actual database)
const users = [
  {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123' // In a real app, store hashed passwords
  }
];

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = users.find(user => user.email === email);
    if (existingUser) {
  res.status(400).json({ success: false, message: 'User already exists' });
    return;
    }

    // In a real app, hash the password before saving
    const newUser = {
      id: (users.length + 1).toString(),
      username,
      email,
      password // Remember to hash this in production
    };

    users.push(newUser);

    try {
      // In a real app, you would save the user to a database here
      // For now, we'll just return a success response

      // Generate JWT token
      const token = jwt.sign(
        { userId: newUser.id, email: email },
        JWT_SECRET as jwt.Secret,
        { expiresIn: TOKEN_EXPIRES_IN } as jwt.SignOptions
      );

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          email: email,
          name: username
        }
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering user'
      });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    try {
      // In a real app, you would validate the credentials against a database
      // For now, we'll just check if the email and password are provided
      if (!email || !password) {
        res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
        return;
      }

      // In a real app, you would verify the password against the hashed password in the database
      // For now, we'll just check if the password is 'password'
      const user = users.find(u => u.email === email);
      if (!user || user.password !== password) {
        res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
        return;
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: email },
        JWT_SECRET as jwt.Secret,
        { expiresIn: TOKEN_EXPIRES_IN } as jwt.SignOptions
      );

      // Set the token as an HTTP-only cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
          id: user.id,
          email: email,
          name: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Error during login'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    try {
      // In a real app, you would fetch the user from the database using the ID from the token
      // For now, we'll just return the user from the token
      if (!req.user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: req.user
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching user'
      });
    }
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
