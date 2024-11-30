import { GameType } from '@enums/game.enums';
import { PrismaClient } from '@prisma/client';
import { CreateGameDto, CreateGameSchemaWithRequiredFields } from 'src/schemas';

const prisma = new PrismaClient();

async function createGame(data: CreateGameSchemaWithRequiredFields) {

  try {
    const game = await prisma.$transaction(async (tx) => {
      const createdGame = await tx.game.create({ data });
      await tx.player.create({
        data: {
          name: `Player (white)`,
          color: 'white',
          gameId: createdGame.id,
          userId: data.createdBy ?? ""
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
async function findAllPublicActiveGamesWithPlayers() {
  return await prisma.game.findMany({
    where: {
      gameType: GameType.PUBLIC,
      status: { not: 'completed' },
      deletedAt: null
    },
    include: {
      players: true,
    },
  });
}

async function findOneWithGameRequests(id: string) {
  return await prisma.game.findUnique({
    where: {id},
    include: {
      gameRequests: true,
    },
  })
}

export { createGame, findAllPublicActiveGamesWithPlayers, findOneWithGameRequests };
