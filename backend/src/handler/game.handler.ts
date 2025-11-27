import { Request, Response } from "express";
import { ChessGame } from "@/games/chess.game";
import { Square } from "chess.js";
import { sendResponse, sendError } from "@/utils/helper";
import { AuthenticatedRequest, Stats } from "@/types";
import {
  createGameSchema,
  GameStatus,
  GameType,
  paginatedGameSearchSchema,
} from "@/schema/game";
import { gameStorage } from "@/storage/game";
import { db } from "@/db/drizzle";
import { game } from "@/db/schema";
import { eq, or, and, count } from "drizzle-orm";

export const createGame = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = createGameSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 400, "Invalid request", result.error);
    }

    let { type, passcode, blackPlayerId, notes, gameName } = result.data;

    if (type === GameType.PUBLIC && passcode) {
      return sendError(res, 400, "Passcode is not allowed for public games");
    }

    if (type === GameType.PRIVATE && !passcode) {
      passcode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const chess = new ChessGame();
    const initialFen = chess.fen();

    const payload = {
      whitePlayerId: userId,
      blackPlayerId:
        blackPlayerId && blackPlayerId.trim() !== "" ? blackPlayerId : null,
      status: GameStatus.WAITING,
      type: type || GameType.PUBLIC,
      passcode: type === GameType.PRIVATE ? passcode : null,
      isVisible: type === GameType.PUBLIC,
      fen: initialFen,
      startedAt: null,
      notes: notes?.trim() || null,
      name: gameName?.trim() || "",
    };

    const newGame = await gameStorage.create(payload);

    return sendResponse(res, 201, newGame, "Game created successfully");
  } catch (error) {
    console.error("Error creating game:", error);
    return sendError(
      res,
      500,
      "Failed to create game",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const joinGame = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { passcode } = req.body;
    const { gameId } = req.params;
    const userId = req.user!.id;

    const existingGame = await gameStorage.findById(gameId);

    if (!existingGame) return sendError(res, 404, "Game not found");

    if (
      existingGame.whitePlayerId === userId ||
      existingGame.blackPlayerId === userId
    ) {
      return sendError(res, 400, "You are already part of this game");
    }

    if (existingGame.type === GameType.PRIVATE) {
      if (!passcode) {
        return sendError(res, 400, "Passcode is required to join this game");
      }

      if (existingGame.passcode !== passcode) {
        return sendError(res, 403, "Invalid passcode");
      }
    }

    if (existingGame.blackPlayerId) {
      return sendError(res, 400, "Game already has two players");
    }

    const updated = await gameStorage.update(gameId, {
      blackPlayerId: userId,
      status: "ONGOING",
      startedAt: new Date(),
    });

    return sendResponse(res, 200, updated, "Joined game successfully");
  } catch (error) {
    console.error("Error joining game:", error);
    return sendError(
      res,
      500,
      "Failed to join game",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const getGame = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    if (!gameId) return sendError(res, 400, "Game ID is required");

    const existingGame = await gameStorage.findById(gameId);

    if (!existingGame) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(existingGame.fen);

    return sendResponse(
      res,
      200,
      { gameId, ...chess.getState(), dbGame: existingGame },
      "Game fetched successfully"
    );
  } catch (error) {
    console.error("Error getting game:", error);
    return sendError(
      res,
      500,
      "Failed to get game",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const makeMove = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { from, to, promotion } = req.body;

    if (!gameId) return sendError(res, 400, "Game ID is required");
    if (!from || !to)
      return sendError(res, 400, 'Both "from" and "to" fields are required');

    const existingGame = await gameStorage.findById(gameId);

    if (!existingGame) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(existingGame.fen);

    const result = chess.makeMove({
      from: from as Square,
      to: to as Square,
      promotion: promotion?.toLowerCase(),
    });

    if (!result.success) {
      const validMoves = chess
        .getValidMoves(from as Square)
        .map((m) => ({ from: m.from, to: m.to, promotion: m.promotion }));

      return sendError(res, 400, result.error || "Invalid move", {
        validMoves,
      });
    }

    const toCreate = {
      gameId: gameId,
      moveNumber: existingGame.moves.length + 1,
      playerId: null,
      fromSquare: from,
      toSquare: to,
      promotion: promotion?.toLowerCase(),
      fen: chess.getState().fen,
    };

    await gameStorage.createMove(toCreate);

    // Update game FEN
    await gameStorage.update(gameId, { fen: chess.getState().fen });

    return sendResponse(
      res,
      200,
      { gameId, move: result, ...chess.getState() },
      "Move executed successfully"
    );
  } catch (error) {
    console.error("Error making move:", error);
    return sendError(
      res,
      500,
      "Failed to make move",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const getValidMoves = async (req: Request, res: Response) => {
  try {
    const { gameId } = req.params;
    const { square } = req.query;

    if (!gameId) return sendError(res, 400, "Game ID is required");
    if (!square) return sendError(res, 400, "Square parameter is required");

    const existingGame = await gameStorage.findById(gameId);
    if (!existingGame) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(existingGame.fen);

    const moves = chess.getValidMoves(square as Square);

    return sendResponse(
      res,
      200,
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
      500,
      "Failed to get valid moves",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const listGames = async (req: Request, res: Response) => {
  try {
    const result = paginatedGameSearchSchema.safeParse(req.query);
    if (!result.success) {
      return sendError(res, 400, "Invalid request", result.error);
    }

    const data = await gameStorage.paginatedGames(result.data);

    return sendResponse(
      res,
      200,
      {
        ...data,
      },
      "Games fetched successfully"
    );
  } catch (error) {
    console.error("Error listing games:", error);
    return sendError(
      res,
      500,
      "Failed to list games",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const GetAllGameStats = async (
  req: AuthenticatedRequest,
  res: Response
) => {
  try {
    const userId = req.user!.id;

    const [totalResult] = await db
      .select({ count: count() })
      .from(game)
      .where(
        or(eq(game.whitePlayerId, userId), eq(game.blackPlayerId, userId))
      );

    const total = totalResult?.count ?? 0;

    const [winsResult] = await db
      .select({ count: count() })
      .from(game)
      .where(
        or(
          and(eq(game.whitePlayerId, userId), eq(game.result, "white_win")),
          and(eq(game.blackPlayerId, userId), eq(game.result, "black_win"))
        )
      );
    const wins = winsResult?.count ?? 0;

    const [lossesResult] = await db
      .select({ count: count() })
      .from(game)
      .where(
        or(
          and(eq(game.whitePlayerId, userId), eq(game.result, "black_win")),
          and(eq(game.blackPlayerId, userId), eq(game.result, "white_win"))
        )
      );
    const losses = lossesResult?.count ?? 0;

    const [drawsResult] = await db
      .select({ count: count() })
      .from(game)
      .where(
        or(
          and(eq(game.whitePlayerId, userId), eq(game.result, "draw")),
          and(eq(game.blackPlayerId, userId), eq(game.result, "draw"))
        )
      );
    const draws = drawsResult?.count ?? 0;

    const stats: Stats = { total, wins, losses, draws };
    return sendResponse(res, 200, { stats }, "Stats fetched successfully");
  } catch (error) {
    console.error("Error fetching game stats:", error);
    return sendError(
      res,
      500,
      "Failed to fetch game stats",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
