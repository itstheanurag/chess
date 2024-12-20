import { Request, Response } from "express";
import { Game } from "@prisma/client";
import {
  acceptOrDeclineTheGame,
  createGame,
  findAllPublicActiveGamesWithPlayers,
  findOneWithGameRequests,
  joinGameAsPlayer,
  updateGameStatusAsStarted
} from "src/repositories";
import { CreateGameSchemaWithRequiredFields } from "src/schemas";
import { Chess } from "chess.js";
import { GameRequestStatusEnum, GameStatus, GameType } from "@enums/game.enums";

export async function GetPublicGames(
  req: Request,
  res: Response
): Promise<Response<{ success: boolean; data: Game[] }>> {
  try {
    const games = await findAllPublicActiveGamesWithPlayers();

    return res.json({
      success: true,
      data: games,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: "An error occurred while fetching room details.",
    });
  }
}

export async function createGameService(
  req: Request,
  res: Response
): Promise<Response<{ success: boolean; message: string; data: Game }>> {
  try {
    const { body } = req;
    const userId = req.user?.id ?? "";

    const toCreate: CreateGameSchemaWithRequiredFields = {
      status: GameStatus.WAITING,
      gameState: new Chess().fen(),
      createdBy: userId,
      maxSpectatorCount: 0,
      currentSpectatorCount: 0,
      gameType: body.gameType,
    };

    const room = await createGame(toCreate);

    return res.status(201).json({
      success: true,
      message: "Room created successfully",
      data: room,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the room.",
      error: error.message,
    });
  }
}

export async function JoinGameAsPlayer(req: Request, res: Response) {
  try {
    const { gameId } = req.params;
    const { status } = req.body;
    const userId = req.user?.id ?? "";

    const game = await findOneWithGameRequests(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: "Game not found",
      });
    }

    if(game.players?.length > 1) {
      return res.send(400).json({
        status: false,
        message: "Can't join an ongoing game"
      })
    }

    // Check if the game has a matching game request where the receiverId matches
    if (game.gameType === GameType.PRIVATE) {
      return await handlePrivateGamesJoin(req, res, { game, userId, status });
    }

    await joinGameAsPlayer(game.id, userId);
    await updateGameStatusAsStarted(game.id);

    return res.send(200).json({
      success: true,
      message: "Successfully joined the game",
      data: null
    })
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An error occurred while creating the room.",
      error: error.message,
    });
  }
}

export async function handlePrivateGamesJoin(
  req: Request,
  res: Response,
  data: { game: any; userId: string; status: GameRequestStatusEnum }
) {
  const gameRequest = data?.game?.gameRequests?.find(
    (request: { receiverId: string }) => request.receiverId === data.userId
  );

  if (!gameRequest) {
    return res.status(400).json({
      success: false,
      message: "No valid game request found for the user.",
    });
  }

  await acceptOrDeclineTheGame(gameRequest.id, data.status);

  if (data.status === GameRequestStatusEnum.REJECT) {
    return res.status(200).json({
      success: true,
      message: "successfully rejected the game request",
      data: null,
    });
  }

  await updateGameStatusAsStarted(data.game.id);

  return res.send(200).json({
    success: true,
    message: "Game has now started",
    data: null
  })
}

