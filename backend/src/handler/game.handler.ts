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
import prisma from "@/libs/db";
import { gameStorage } from "@/storage/game";

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

    const game = await gameStorage.create(payload);

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
    const userId = req.user!.id;

    const game = await prisma.game.findUnique({
      where: { id: gameId },
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

    const updated = await gameStorage.update(gameId, {
      blackPlayerId: userId,
      status: "ONGOING",
      startedAt: new Date(),
    });

    // const updated = await prisma.game.update({
    //   where: { id: gameId },
    //   data: {
    //     blackPlayerId: userId,
    //     status: "ONGOING",
    //     startedAt: new Date(),
    //   },
    // });

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

    // const game = await prisma.game.findUnique({
    //   where: { id: gameId },
    //   include: { moves: { orderBy: { moveNumber: "asc" } } },
    // });

    const game = await gameStorage.findById(gameId);

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

    // const game = await prisma.game.findUnique({
    //   where: { id: gameId },
    //   include: { moves: { orderBy: { moveNumber: "asc" } } },
    // });

    const game = await gameStorage.findById(gameId);

    if (!game) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(game.fen);
    // for (const move of game.moves) {
    //   chess.makeMove({
    //     from: move.fromSquare as Square,
    //     to: move.toSquare as Square,
    //     promotion: move.promotion || undefined,
    //   });
    // }

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
      moveNumber: game.moves.length + 1,
      playerId: null,
      fromSquare: from,
      toSquare: to,
      promotion: promotion?.toLowerCase(),
      fen: chess.getState().fen,
    };

    // await prisma.gameMove.create({
    //   data: toCreate,
    // });

    await gameStorage.create(toCreate);

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

    // const game = await prisma.game.findUnique({
    //   where: { id: gameId },
    //   include: { moves: { orderBy: { moveNumber: "asc" } } },
    // });

    const game = await gameStorage.findById(gameId);
    if (!game) return sendError(res, 404, "Game not found");

    const chess = new ChessGame(game.fen);
    // for (const move of game.moves) {
    //   chess.makeMove({
    //     from: move.fromSquare as Square,
    //     to: move.toSquare as Square,
    //     promotion: move.promotion || undefined,
    //   });
    // }

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

    // const { q, page, size, status, type } = result.data;

    // const pageNum = +(page ?? 1);
    // const pageSize = +(size ?? 15);
    // const skip = (pageNum - 1) * pageSize;

    // const where: any = {};

    // if (status && typeof status === "string") {
    //   where.status = status.toUpperCase();
    // }

    // if (type && typeof type === "string") {
    //   where.type = type.toUpperCase();
    // }

    // if (q && typeof q === "string" && q.trim().length > 0) {
    //   where.OR = [
    //     { name: { contains: q, mode: "insensitive" } },
    //     { notes: { contains: q, mode: "insensitive" } },
    //   ];
    // }

    // const totalEntries = await prisma.game.count({ where });

    // const games = await prisma.game.findMany({
    //   where,
    //   select: {
    //     id: true,
    //     status: true,
    //     type: true,
    //     fen: true,
    //     notes: true,
    //     name: true,
    //     isVisible: true,
    //     createdAt: true,
    //     whitePlayerId: true,
    //     blackPlayerId: true,
    //     whitePlayer: {
    //       select: {
    //         id: true,
    //         username: true,
    //         email: true,
    //       },
    //     },
    //     blackPlayer: {
    //       select: {
    //         id: true,
    //         username: true,
    //         email: true,
    //       },
    //     },
    //   },
    //   orderBy: { createdAt: "desc" },
    //   skip,
    //   take: pageSize,
    // });

    const data = await gameStorage.paginatedGames(result.data);

    return sendResponse(
      res,
      200,
      {
        // games,
        // page: pageNum,
        // size: pageSize,
        // total: totalEntries,

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

    const total = await prisma.game.count({
      where: {
        OR: [{ whitePlayerId: userId }, { blackPlayerId: userId }],
      },
    });

    const wins = await prisma.game.count({
      where: {
        OR: [
          { whitePlayerId: userId, result: "white_win" },
          { blackPlayerId: userId, result: "black_win" },
        ],
      },
    });

    const losses = await prisma.game.count({
      where: {
        OR: [
          { whitePlayerId: userId, result: "black_win" },
          { blackPlayerId: userId, result: "white_win" },
        ],
      },
    });

    const draws = await prisma.game.count({
      where: {
        OR: [
          { whitePlayerId: userId, result: "draw" },
          { blackPlayerId: userId, result: "draw" },
        ],
      },
    });

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
