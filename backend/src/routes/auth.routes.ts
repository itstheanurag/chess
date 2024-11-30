import express, { Request, Response } from "express";
import { loginUser, registerUser, reLoginUser } from "../services/auth.service";
import { AccessToken, LoginResponse, UserCreatedResponse } from "src/types";
import { GlobalRequestValidator } from "@middlewares/index";
import { CreateUserShema } from "src/schemas/index";
import { AuthRoutesEnums } from "@enums/index";

const authRouter = express.Router();

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Registers a new user
 *     description: Allows a new user to register by providing their username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: The username of the user
 *               password:
 *                 type: string
 *                 description: The password of the user
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input
 */
const registerUserHandler = async (req: Request, res: Response<UserCreatedResponse>) => {
  await registerUser(req, res);
};

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Login an existing user
 *     description: Allows a user to log in by providing their username and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       401:
 *         description: Unauthorized
 */
const loginUserHandler = async (req: Request, res: Response<LoginResponse>) => {
  await loginUser(req, res);
};

/**
 * @swagger
 * /api/v1/auth/refresh-login:
 *   post:
 *     summary: Refreshes the access token
 *     description: Provides a new access token using a valid refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: The refresh token to get a new access token
 *     responses:
 *       200:
 *         description: New access token generated
 *       400:
 *         description: Invalid request
 */
const reLoginUserHandler = async (req: Request, res: Response<AccessToken>) => {
  await reLoginUser(req, res);
};

authRouter.post(AuthRoutesEnums.REGISTER, GlobalRequestValidator({ body: CreateUserShema }), registerUserHandler);
authRouter.post(AuthRoutesEnums.LOGIN, loginUserHandler);
authRouter.post(AuthRoutesEnums.REFRESH_TOKEN_LOGIN, reLoginUserHandler);

export { authRouter };
