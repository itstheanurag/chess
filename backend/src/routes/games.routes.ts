import express, { Request, Response } from 'express';
import { authUser, GlobalRequestValidator } from '@middlewares/index';
import { CreateGameSchema, JoinGameRequestSchema } from 'src/schemas';
import { GameRoutesEnums } from '@enums/index';
import { createGameService, GetPublicGames, JoinRoomAsPlayer } from 'src/services';

const roomRouter = express.Router();

/**
 * @swagger
 * /api/v1/rooms:
 *   get:
 *     summary: Get a list of all rooms
 *     description: Fetches a list of all available rooms.
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Successfully fetched the list of rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   roomId:
 *                     type: string
 *                     description: The unique identifier for the room
 *                   roomName:
 *                     type: string
 *                     description: The name of the room
 *                   playersCount:
 *                     type: integer
 *                     description: The number of players in the room
 *                   maxPlayers:
 *                     type: integer
 *                     description: The maximum number of players allowed in the room
 *       500:
 *         description: Internal server error
 */
const createRoomHandler = async (req: Request, res: Response) => {
  await createGameService(req, res);
};


/**
 * @swagger
 * /api/v1/rooms/create:
 *   post:
 *     summary: Create a new room
 *     description: Creates a new room with a specified configuration.
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - roomName
 *               - maxPlayers
 *             properties:
 *               roomName:
 *                 type: string
 *                 description: The name of the room
 *               maxPlayers:
 *                 type: integer
 *                 description: The maximum number of players allowed in the room
 *     responses:
 *       201:
 *         description: Successfully created a new room
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       500:
 *         description: Internal server error
 */
const getRoomsListHandler = async (req: Request, res: Response) => {
  await GetPublicGames(req, res);
};


/**
 * @swagger
 * /api/v1/rooms/{roomId}/join:
 *   post:
 *     summary: Join a room as a player
 *     description: Allows an authenticated user to join a specific room as a player.
 *     tags: [Rooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         description: The unique ID of the room to join
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the player
 *     responses:
 *       200:
 *         description: Successfully joined the room
 *       400:
 *         description: Invalid room ID or already joined
 *       401:
 *         description: Unauthorized - Invalid or missing JWT token
 *       404:
 *         description: Room not found
 *       500:
 *         description: Internal server error
 */

const joinRoomHandler = async (req: Request, res: Response) => {
  await JoinRoomAsPlayer(req, res);
};


roomRouter.get(
  GameRoutesEnums.GET_ALL_ROOMS, 
  getRoomsListHandler
);

roomRouter.post(
  GameRoutesEnums.CREATE_ROOM, 
  authUser,
  GlobalRequestValidator({ body: CreateGameSchema }), 
  createRoomHandler
);

roomRouter.post(
  GameRoutesEnums.JOIN_ROOM,
  authUser, 
  GlobalRequestValidator({ body: JoinGameRequestSchema }), 
  joinRoomHandler
);

export { roomRouter };
