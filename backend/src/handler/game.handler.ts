import { Request, Response } from "express";
import { activeGames, ChessGame } from "@/games/chess.game";
import { Square, Move as ChessMove } from "chess.js";
import { v4 as uuidv4 } from "uuid";
import { sendResponse, sendError } from "@/utils/helper";
import { GameMoveResult } from "@/types";

function getGameStatus(game: ChessGame): string {
  if (game.isCheckmate()) return "checkmate";
  if (game.isDraw()) return "draw";
  if (game.isStalemate()) return "stalemate";
  if (game.isThreefoldRepetition()) return "threefold";
  if (game.isInsufficientMaterial()) return "insufficient";
  return "active";
}

export const createGame = async (req: Request, res: Response) => {
  try {
    const { fen } = req.body;
    const game = new ChessGame(fen);
    const gameId = uuidv4();
    activeGames[gameId] = game;

    return sendResponse(
      res,
      { gameId, ...game.getState() },
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

export const getGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    if (!gameId) return sendError(res, "Game ID is required", 400);

    const game = activeGames[gameId];
    if (!game) return sendError(res, "Game not found", 404);

    return sendResponse(
      res,
      { gameId, ...game.getState() },
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

export const makeMove = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { from, to, promotion } = req.body;

    if (!gameId) return sendError(res, "Game ID is required", 400);
    if (!from || !to)
      return sendError(res, 'Both "from" and "to" fields are required', 400);

    const game = activeGames[gameId];
    if (!game) return sendError(res, "Game not found", 404);

    const moveOptions = {
      from: from as Square,
      to: to as Square,
      promotion: promotion?.toLowerCase(),
    };

    const result: GameMoveResult = game.makeMove(moveOptions);
    if (!result.success) {
      const validMoves = game
        .getValidMoves(from as Square)
        .map((m) => ({ from: m.from, to: m.to, promotion: m.promotion }));
      return sendError(res, result.error || "Invalid move", 400, {
        validMoves,
      });
    }

    return sendResponse(
      res,
      { gameId, move: result, ...game.getState() },
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

export const getValidMoves = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { square } = req.query;

    if (!gameId) return sendError(res, "Game ID is required", 400);
    if (!square) return sendError(res, "Square parameter is required", 400);

    const game = activeGames[gameId];
    if (!game) return sendError(res, "Game not found", 404);

    const moves = game.getValidMoves(square as Square);
    return sendResponse(
      res,
      {
        gameId,
        square,
        moves: moves.map((m) => ({
          from: m.from,
          to: m.to,
          piece: m.piece,
          promotion: m.promotion,
        })),
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
export const listGames = async (req: Request, res: Response) => {
  let rooms = Object.entries(activeGames)
    .filter(([_, game]) => !game.isFull())
    .map(([id]) => id);

  if (rooms.length === 0) {
    const newRoomId = `room-${Date.now()}`;
    activeGames[newRoomId] = new ChessGame();
    rooms = [newRoomId];
  }

  return sendResponse(res, { rooms }, "Active games fetched successfully");
};
