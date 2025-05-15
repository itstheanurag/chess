import { Router } from 'express';
import { 
  createGame, 
  getGame, 
  makeMove, 
  getValidMoves 
} from '../controllers/game.controller';
import { authGuard } from '../middlewares/auth.guard';
import { asyncHandler } from '../utils/helper';

const GameRouter = Router();

/**
 * @route   GET /games/health
 * @desc    Health check for game service
 * @access  Public
 */
GameRouter.get('/health', (_req: any, res: any) => {
  res.status(200).json({ 
    success: true, 
    service: 'game', 
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

// Apply auth guard to all game routes
GameRouter.use(authGuard);

/**
 * @route   POST /api/games
 * @desc    Create a new game
 * @access  Private
 */
GameRouter.post('/', asyncHandler(createGame));

/**
 * @route   GET /api/games/:gameId
 * @desc    Get game state
 * @access  Private
 */
GameRouter.get('/:gameId', asyncHandler(getGame));

/**
 * @route   POST /api/games/:gameId/move
 * @desc    Make a move in the game
 * @access  Private
 */
GameRouter.post('/:gameId/move', asyncHandler(makeMove));

/**
 * @route   GET /api/games/:gameId/moves
 * @desc    Get valid moves for a piece
 * @access  Private
 */
GameRouter.get('/:gameId/moves', asyncHandler(getValidMoves));

// Export the router as default
export default GameRouter;

