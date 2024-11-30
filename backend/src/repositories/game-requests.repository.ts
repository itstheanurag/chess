import { GameRequestStatusEnum } from '@enums/index';
import { PrismaClient } from '@prisma/client';
import { CreateGameRequestDto } from 'src/schemas';

const prisma = new PrismaClient();

// create a game request
async function createGameRequest(data: CreateGameRequestDto) {
  return await prisma.gameRequest.create({
    data:{ ...data, status: GameRequestStatusEnum.PENDING,}
  });
}

// find all the games you are invited to
async function findGamesForUser(gameId: string, receiverId: string) {
  return await prisma.gameRequest.findMany({
    where: {
      gameId,
      receiverId,
      status: GameRequestStatusEnum.PENDING, 
      deletedAt: null
    },
    include: {
      game: true,
    },
  });
}

// accept or decline a game
async function acceptOrDeclineTheGame(
  gameRequestId: string, 
  status: GameRequestStatusEnum
) {
  return await prisma.gameRequest.update({
    where: {
      id: gameRequestId,
    },
    data: {
      status,
    },
  });
}

async function deleteGameRequest(gameRequestId: string) {
  return await prisma.gameRequest.update({
    where: {
      id: gameRequestId,
    },
    data: {
      deletedAt: new Date(), 
    },
  });
}


export { createGameRequest, findGamesForUser, acceptOrDeclineTheGame, deleteGameRequest};
