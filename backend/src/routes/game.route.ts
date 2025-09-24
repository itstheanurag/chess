import { Router } from "express";
import {
  createGame,
  getGame,
  makeMove,
  getValidMoves,
  listGames,
} from "@/handler";
import { authGuard } from "@/middlewares";

const GameRouter: Router = Router();

/**
 * @route   GET /games/health
 * @desc    Health check for game service
 * @access  Public
 */
GameRouter.get("/health", (_req: any, res: any) => {
  res.status(200).json({
    success: true,
    service: "game",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

GameRouter.get("/list", listGames);

// Apply auth guard to all game routes
GameRouter.use(authGuard);

/**
 * @route   POST /api/games
 * @desc    Create a new game
 * @access  Private
 */
GameRouter.post("/", createGame);

/**
 * @route   GET /api/games/:gameId
 * @desc    Get game state
 * @access  Private
 */
GameRouter.get("/:gameId", getGame);

/**
 * @route   POST /api/games/:gameId/move
 * @desc    Make a move in the game
 * @access  Private
 */
GameRouter.post("/:gameId/move", makeMove);

/**
 * @route   GET /api/games/:gameId/moves
 * @desc    Get valid moves for a piece
 * @access  Private
 */
GameRouter.get("/:gameId/moves", getValidMoves);

// Export the router as default
export default GameRouter;
