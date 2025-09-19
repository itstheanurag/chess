import { Router } from "express";
import { register, login, getMe } from "@/controllers/auth.controller";
import { authGuard } from "@/middlewares/auth.guard";

const AuthRouter: Router = Router();

/**
 * @route   POST /auth/register
 * @desc    Register a new user
 * @access  Public
 */
AuthRouter.post("/register", register);

/**
 * @route   POST /auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
AuthRouter.post("/login", login);

/**
 * @route   GET /auth/me
 * @desc    Get current user data
 * @access  Private
 */
AuthRouter.get("/me", authGuard, getMe);

/**
 * @route   GET /auth/health
 * @desc    Health check for auth service
 * @access  Public
 */
AuthRouter.get("/health", (_req: any, res: any) => {
  res.status(200).json({
    success: true,
    service: "auth",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default AuthRouter;
