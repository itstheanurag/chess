import { GameStatus, GameType } from "@enums/game.enums";
import { prisma } from "src/db";
import { CreateGameSchemaWithRequiredFields } from "src/schemas";

export async function createGame(data: CreateGameSchemaWithRequiredFields) {
  try {
    const game = await prisma.$transaction(async (tx) => {
      const createdGame = await tx.game.create({ data });
      await tx.player.create({
        data: {
          name: `Player (white)`,
          color: "white",
          gameId: createdGame.id,
          userId: data.createdBy ?? "",
        },
      });
      return createdGame;
    });

    return game;
  } catch (error) {
    console.error("Error creating game and player:", error);
    throw error;
  }
}

// async findAllPublicGames
export async function findAllPublicActiveGamesWithPlayers() {
  return await prisma.game.findMany({
    where: {
      gameType: GameType.PUBLIC,
      status: { not: "completed" },
      deletedAt: null,
    },
    include: {
      players: true,
    },
  });
}

export async function findOneWithGameRequests(id: string) {
  return await prisma.game.findUnique({
    where: { id },
    include: {
      gameRequests: true,
      players: true,
    },
  });
}

export async function joinGameAsPlayer(gameId: string, userId: string) {
  return await prisma.player.create({
    data: {
      name: `Player (white)`,
      color: "white",
      gameId: gameId,
      userId: userId,
    },
  });
}

export async function updateGameStatusAsStarted(id: string) {
  return await prisma.game.update({
    where: {
      id,
    },
    data: {
      status: GameStatus.IN_PROGRESS,
      startedAt: new Date()
    },
  });
}

