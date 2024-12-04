import express, { Request, Response } from 'express';
import { authUser, GlobalRequestValidator } from '@middlewares/index';
import { CreateGameSchema, JoinGameRequestSchema } from 'src/schemas';
import { GameRoutesEnums } from '@enums/index';
import { createGameService, GetPublicGames, JoinGameAsPlayer } from 'src/services';

const roomRouter = express.Router();

/**
 * @swagger
 * /api/v1/games:
 *   post:
 *     summary: Create a new game
 *     description: Allows an authenticated user to create a new game with specific parameters.
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - gameType
 *             properties:
 *               gameType:
 *                 type: string
 *                 enum:
 *                   - PRIVATE
 *                   - PUBLIC
 *                 description: The type of the game (either 'PRIVATE' or 'PUBLIC').
 *               status:
 *                 type: string
 *                 enum:
 *                   - WAITING
 *                   - IN_PROGRESS
 *                   - COMPLETED
 *                 description: The current status of the game. Defaults to 'WAITING'.
 *                 example: WAITING
 *               gameState:
 *                 type: string
 *                 description: The state of the game (e.g., board position, metadata). Optional.
 *                 example: "Initial state"
 *     responses:
 *       201:
 *         description: Game successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: Unique identifier for the newly created game.
 *                   example: "game123"
 *                 gameType:
 *                   type: string
 *                   description: The type of the created game.
 *                   example: "PRIVATE"
 *                 status:
 *                   type: string
 *                   description: The current status of the game.
 *                   example: "WAITING"
 *                 maxSpectatorCount:
 *                   type: integer
 *                   description: The maximum number of spectators for the game.
 *                   example: 10
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: The timestamp when the game was created.
 *                   example: "2024-12-04T12:00:00Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 *
 */
const CreateGameHandler = async (req: Request, res: Response) => {
  await createGameService(req, res);
};

/**
 * @swagger
 * /api/v1/games:
 *   get:
 *     summary: Retrieve all public games
 *     description: Fetches a list of all public games that users can view and join.
 *     tags: [Games]
 *     responses:
 *       200:
 *         description: A list of public games
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: Unique identifier for the game
 *                     example: "game123"
 *                   name:
 *                     type: string
 *                     description: Name of the game
 *                     example: "Chess Championship"
 *                   status:
 *                     type: string
 *                     description: Current status of the game
 *                     example: "waiting"
 *                   players:
 *                     type: array
 *                     description: List of players in the game
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                           description: Unique identifier of the player
 *                           example: "player123"
 *                         name:
 *                           type: string
 *                           description: Name of the player
 *                           example: "John Doe"
 *                   maxPlayers:
 *                     type: integer
 *                     description: Maximum number of players allowed in the game
 *                     example: 4
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the game was created
 *                     example: "2024-12-04T12:00:00Z"
 *                   updatedAt:
 *                     type: string
 *                     format: date-time
 *                     description: When the game was last updated
 *                     example: "2024-12-04T12:30:00Z"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 *
 */
const GetAllPublicGames = async (req: Request, res: Response) => {
  await GetPublicGames(req, res);
};


/**
 * @swagger
 * /api/v1/games/{gameId}/join:
 *   post:
 *     summary: Join an existing game
 *     description: Allows an authenticated user to join an existing game using the game ID.
 *     tags: [Games]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gameId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the game to join.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - playerId
 *             properties:
 *               playerId:
 *                 type: string
 *                 description: The ID of the player joining the game.
 *                 example: "player123"
 *     responses:
 *       200:
 *         description: Successfully joined the game
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 gameId:
 *                   type: string
 *                   description: The ID of the joined game.
 *                   example: "game123"
 *                 playerId:
 *                   type: string
 *                   description: The ID of the player who joined the game.
 *                   example: "player123"
 *                 status:
 *                   type: string
 *                   description: The updated status of the game.
 *                   example: "IN_PROGRESS"
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized access
 *       500:
 *         description: Internal server error
 */

const JoinGameHandler = async (req: Request, res: Response) => {
  await JoinGameAsPlayer(req, res);
};


roomRouter.get(GameRoutesEnums.GET_ALL_GAMES, GetAllPublicGames);

roomRouter.post(
  GameRoutesEnums.CREATE_GAME, 
  authUser,
  GlobalRequestValidator({ body: CreateGameSchema }), 
  CreateGameHandler
);

roomRouter.post(
  GameRoutesEnums.JOIN_GAME,
  authUser, 
  GlobalRequestValidator({ body: JoinGameRequestSchema }), 
  JoinGameHandler
);

export { roomRouter };
