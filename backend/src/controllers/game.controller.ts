import { Request, Response } from 'express';
import { ChessGame } from '../games/chess.game';
import { Square, Move as ChessMove } from 'chess.js';
import { v4 as uuidv4 } from 'uuid';

// Extended Move type to include verbose move properties
interface VerboseMove extends Omit<ChessMove, 'before' | 'after' | 'piece' | 'captured' | 'promotion' | 'flags'> {
  san: string;
  lan: string;
  before: string;
  after: string;
  piece: string; // Override with string type for serialization
  captured?: string; // Override with string type for serialization
  promotion?: string; // Override with string type for serialization
  flags: string; // Override with string type for serialization
}

// In-memory store for active games (replace with database in production)
const activeGames: Record<string, ChessGame> = {};

// Helper function to get game status
function getGameStatus(game: ChessGame): string {
  if (game.isCheckmate()) return 'checkmate';
  if (game.isDraw()) return 'draw';
  if (game.isStalemate()) return 'stalemate';
  if (game.isThreefoldRepetition()) return 'threefold';
  if (game.isInsufficientMaterial()) return 'insufficient';
  if (game.isDraw()) return '50move';
  return 'active';
}

export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fen } = req.body;
    
    // Create a new game
    const game = new ChessGame(fen);
    const gameId = uuidv4();
    
    // Store the game in memory
    activeGames[gameId] = game;
    
    res.status(201).json({
      success: true,
      gameId,
      fen: game.fen(),
      board: game.board(),
      turn: game.turn(),
      status: getGameStatus(game)
    });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to create game',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    
    if (!gameId) {
      res.status(400).json({ 
        success: false, 
        message: 'Game ID is required' 
      });
      return;
    }
    
    const game = activeGames[gameId];
    
    if (!game) {
      res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      gameId,
      fen: game.fen(),
      board: game.board(),
      turn: game.turn(),
      status: getGameStatus(game),
      history: game.history()
    });
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get game',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const makeMove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { from, to, promotion } = req.body;
    
    if (!gameId) {
      res.status(400).json({ 
        success: false, 
        message: 'Game ID is required' 
      });
      return;
    }
    
    if (!from || !to) {
      res.status(400).json({ 
        success: false, 
        message: 'Both "from" and "to" fields are required' 
      });
      return;
    }
    
    const game = activeGames[gameId];
    
    if (!game) {
      res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
      return;
    }
    
    // Make the move
    let moveResult;
    try {
      const moveOptions: { from: string; to: string; promotion?: string } = {
        from,
        to
      };
      
      if (promotion) {
        moveOptions.promotion = promotion.toLowerCase();
      }
      
      moveResult = game.makeMove(moveOptions);
    } catch (error) {
      // Get valid moves for the from square to help the client
      let validMoves: any[] = [];
      try {
        validMoves = (game.moves({ square: from as Square, verbose: true }) as unknown as VerboseMove[])
          .map(move => ({
            from: move.from,
            to: move.to,
            promotion: move.promotion,
            flags: move.flags
          }));
      } catch (e) {
        // If we can't get valid moves, just return an empty array
        console.error('Error getting valid moves:', e);
      }
      
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Invalid move',
        validMoves
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      gameId,
      fen: game.fen(),
      board: game.board(),
      turn: game.turn(),
      status: getGameStatus(game),
      move: {
        from: moveResult.from,
        to: moveResult.to,
        color: moveResult.color,
        piece: moveResult.piece,
        captured: moveResult.captured,
        promotion: moveResult.promotion,
      },
      inCheck: moveResult.inCheck,
      inCheckmate: moveResult.inCheckmate,
      inDraw: moveResult.inDraw,
      inStalemate: moveResult.inStalemate,
      inThreefoldRepetition: moveResult.inThreefoldRepetition,
      insufficientMaterial: moveResult.insufficientMaterial
    });
  } catch (error) {
    console.error('Error making move:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to make move',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const getValidMoves = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameId } = req.params;
    const { square } = req.query;
    
    if (!gameId) {
      res.status(400).json({ 
        success: false, 
        message: 'Game ID is required' 
      });
      return;
    }
    
    if (!square) {
      res.status(400).json({ 
        success: false, 
        message: 'Square parameter is required' 
      });
      return;
    }
    
    const game = activeGames[gameId];
    
    if (!game) {
      res.status(404).json({ 
        success: false, 
        message: 'Game not found' 
      });
      return;
    }
    
    const moves = game.moves({ 
      square: square as Square, 
      verbose: true 
    }) as unknown as VerboseMove[];
    
    res.status(200).json({
      success: true,
      gameId,
      square,
      moves: moves.map(move => {
        const result: Record<string, any> = {
          from: move.from,
          to: move.to,
          color: move.color,
          flags: move.flags,
          san: move.san,
          lan: move.lan
        };
        
        // Only include properties that exist on the move
        if (move.piece) result.piece = move.piece;
        if (move.captured) result.captured = move.captured;
        if (move.promotion) result.promotion = move.promotion;
        
        return result;
      }),
      count: moves.length
    });
  } catch (error) {
    console.error('Error getting valid moves:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get valid moves',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
