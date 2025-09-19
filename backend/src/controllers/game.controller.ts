import { Request, Response } from "express";
import { ChessGame } from "@/games/chess.game";
import { Move as ChessMove, Square } from "chess.js";
import { v4 as uuidv4 } from "uuid";
import { sendResponse, sendError } from "@/utils/helper";

interface VerboseMove
  extends Omit<
    ChessMove,
    "before" | "after" | "piece" | "captured" | "promotion" | "flags"
  > {
  san: string;
  lan: string;
  before: string;
  after: string;
  piece: string; // Override with string type for serialization
  captured?: string; // Override with string type for serialization
  promotion?: string; // Override with string type for serialization
  flags: string; // Override with string type for serialization
}

const activeGames: Record<string, ChessGame> = {};

// Helper function to get game status
function getGameStatus(game: ChessGame): string {
  if (game.isCheckmate()) return "checkmate";
  if (game.isDraw()) return "draw";
  if (game.isStalemate()) return "stalemate";
  if (game.isThreefoldRepetition()) return "threefold";
  if (game.isInsufficientMaterial()) return "insufficient";
  if (game.isDraw()) return "50move";
  return "active";
}

export const createGame = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { fen } = req.body;

    // Create a new game
    const game = new ChessGame(fen);
    const gameId = uuidv4();

    // Store the game in memory
    activeGames[gameId] = game;

    return sendResponse(
      res,
      {
        gameId,
        fen: game.fen(),
        board: game.board(),
        turn: game.turn(),
        status: getGameStatus(game),
      },
      "Game created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating game:", error);
    return sendError(
      res,
      "Failed to create game",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const getGame = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { gameId } = req.params;

    if (!gameId) {
      return sendError(res, "Game ID is required", 400);
    }

    const game = activeGames[gameId];

    if (!game) {
      return sendError(res, "Game not found", 404);
    }

    return sendResponse(
      res,
      {
        gameId,
        fen: game.fen(),
        board: game.board(),
        turn: game.turn(),
        status: getGameStatus(game),
        history: game.history(),
      },
      "Game fetched successfully"
    );
  } catch (error) {
    console.error("Error getting game:", error);
    return sendError(
      res,
      "Failed to get game",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const makeMove = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { gameId } = req.params;
    const { from, to, promotion } = req.body;

    if (!gameId) return sendError(res, "Game ID is required", 400);
    if (!from || !to)
      return sendError(res, 'Both "from" and "to" fields are required', 400);

    const game = activeGames[gameId];
    if (!game) return sendError(res, "Game not found", 404);

    let moveResult;
    try {
      const moveOptions: { from: string; to: string; promotion?: string } = {
        from,
        to,
      };
      if (promotion) moveOptions.promotion = promotion.toLowerCase();

      moveResult = game.makeMove(moveOptions);
    } catch (error) {
      // Get valid moves for the "from" square
      let validMoves: any[] = [];
      try {
        validMoves = (
          game.moves({
            square: from as Square,
            verbose: true,
          }) as unknown as VerboseMove[]
        ).map((move) => ({
          from: move.from,
          to: move.to,
          promotion: move.promotion,
          flags: move.flags,
        }));
      } catch (e) {
        console.error("Error getting valid moves:", e);
      }

      return sendError(
        res,
        error instanceof Error ? error.message : "Invalid move",
        400,
        { validMoves }
      );
    }

    return sendResponse(
      res,
      {
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
        insufficientMaterial: moveResult.insufficientMaterial,
      },
      "Move executed successfully"
    );
  } catch (error) {
    console.error("Error making move:", error);
    return sendError(
      res,
      "Failed to make move",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const getValidMoves = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { gameId } = req.params;
    const { square } = req.query;

    if (!gameId) return sendError(res, "Game ID is required", 400);
    if (!square) return sendError(res, "Square parameter is required", 400);

    const game = activeGames[gameId];
    if (!game) return sendError(res, "Game not found", 404);

    const moves = game.moves({
      square: square as Square,
      verbose: true,
    }) as unknown as VerboseMove[];

    return sendResponse(
      res,
      {
        gameId,
        square,
        moves: moves.map((move) => {
          const result: Record<string, any> = {
            from: move.from,
            to: move.to,
            color: move.color,
            flags: move.flags,
            san: move.san,
            lan: move.lan,
          };
          if (move.piece) result.piece = move.piece;
          if (move.captured) result.captured = move.captured;
          if (move.promotion) result.promotion = move.promotion;
          return result;
        }),
        count: moves.length,
      },
      "Valid moves fetched successfully"
    );
  } catch (error) {
    console.error("Error getting valid moves:", error);
    return sendError(
      res,
      "Failed to get valid moves",
      500,
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
