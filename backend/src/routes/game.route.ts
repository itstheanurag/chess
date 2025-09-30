import { Router } from "express";
import {
  createGame,
  getGame,
  listGames,
  joinGame,
  GetAllGameStats,
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

GameRouter.use(authGuard);

/**
 * @route   POST /api/games
 * @desc    Create a new game
 * @access  Private
 */
GameRouter.post("/", createGame);

GameRouter.get("/stats", GetAllGameStats);

/**
 * @route   POST /api/games
 * @desc    Join a game
 * @access  Private
 */
GameRouter.post("/:gameId/join", joinGame);
/**
 * @route   GET /api/games/:gameId
 * @desc    Get game state
 * @access  Private
 */
GameRouter.get("/:gameId", getGame);

// Export the router as default
export default GameRouter;
