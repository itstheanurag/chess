import { Request, Response } from "express";
import { ChessGame } from "@/games/chess.game";
import { Square } from "chess.js";
import { sendResponse, sendError } from "@/utils/helper";
import { AuthenticatedRequest } from "@/types";
import prisma from "@/libs/db";
import { createGameSchema, GameStatus, GameType } from "@/schema/game";

export const createGame = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = BigInt(req.user!.id);

    // Validate request body
    const result = createGameSchema.safeParse(req.body);
    if (!result.success) {
      return sendError(res, 400, "Invalid request", result.error);
    }

    let { type, passcode, blackPlayerId } = result.data;

    // Passcode rules
    if (type === GameType.PUBLIC && passcode) {
      return sendError(res, 400, "Passcode is not allowed for public games");
    }

    if (type === GameType.PRIVATE && !passcode) {
      // Generate random 6-digit passcode
      passcode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Parse blackPlayerId if provided
    const blackId = blackPlayerId ? BigInt(blackPlayerId) : null;

    const chess = new ChessGame();
    const initialFen = chess.fen();

    // Create game in DB
    const game = await prisma.game.create({
      data: {
        whitePlayerId: userId,
        blackPlayerId: blackId,
        status: GameStatus.WAITING,
        type: type || GameType.PUBLIC,
        passcode: type === GameType.PRIVATE ? passcode : null,
        isVisible: type === GameType.PUBLIC,
        fen: initialFen,
        startedAt: null,
      },
    });

    return sendResponse(res, 201, game, "Game created successfully");
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
    const userId = BigInt(req.user!.id);

    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
    });

    if (!game) return sendError(res, 404, "Game not found");

    if (game.whitePlayerId === userId || game.blackPlayerId === userId) {
      return sendError(res, 400, "You are already part of this game");
    }

    if (game.type === GameType.PRIVATE) {
      if (!passcode) {
        return sendError(res, 400, "Passcode is required to join this game");
      }

      if (game.passcode !== passcode) {
        return sendError(res, 403, "Invalid passcode");
      }
    }

    if (game.blackPlayerId) {
      return sendError(res, 400, "Game already has two players");
    }

    const updated = await prisma.game.update({
      where: { id: BigInt(gameId) },
      data: {
        blackPlayerId: userId,
        status: "ONGOING",
        startedAt: new Date(),
      },
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

    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
      include: { moves: { orderBy: { moveNumber: "asc" } } },
    });

    if (!game) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(game.fen);
    return sendResponse(
      res,
      200,
      { gameId, ...chess.getState(), dbGame: game },
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

    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
      include: { moves: { orderBy: { moveNumber: "asc" } } },
    });

    if (!game) return sendError(res, 404, "Game not found");

    const chess = new ChessGame();
    for (const move of game.moves) {
      chess.makeMove({
        from: move.fromSquare as Square,
        to: move.toSquare as Square,
        promotion: move.promotion || undefined,
      });
    }

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

    await prisma.gameMove.create({
      data: {
        gameId: BigInt(gameId),
        moveNumber: game.moves.length + 1,
        playerId: null,
        fromSquare: from,
        toSquare: to,
        promotion: promotion?.toLowerCase(),
        fen: chess.getState().fen,
      },
    });

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

    const game = await prisma.game.findUnique({
      where: { id: BigInt(gameId) },
      include: { moves: { orderBy: { moveNumber: "asc" } } },
    });
    if (!game) return sendError(res, 404, "Game not found");

    const chess = new ChessGame();
    for (const move of game.moves) {
      chess.makeMove({
        from: move.fromSquare as Square,
        to: move.toSquare as Square,
        promotion: move.promotion || undefined,
      });
    }

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
    const { status, type } = req.query;
    const where: any = {};
    if (status && typeof status === "string")
      where.status = status.toUpperCase();
    if (type && typeof type === "string") where.type = type.toUpperCase();

    const games = await prisma.game.findMany({
      where,
      select: {
        id: true,
        status: true,
        type: true,
        fen: true,
        isVisible: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return sendResponse(res, 200, { games }, "Games fetched successfully");
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
