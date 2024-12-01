import { GameRequestStatusEnum } from '@enums/index';
import { prisma } from 'src/db';
import { CreateGameRequestDto } from 'src/schemas';

// create a game request
export async function createGameRequest(data: CreateGameRequestDto) {
  return await prisma.gameRequest.create({
    data:{ ...data, status: GameRequestStatusEnum.PENDING,}
  });
}

// find all the games you are invited to
export async function findGamesForUser(gameId: string, receiverId: string) {
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
export async function acceptOrDeclineTheGame(
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

export async function deleteGameRequest(gameRequestId: string) {
  return await prisma.gameRequest.update({
    where: {
      id: gameRequestId,
    },
    data: {
      deletedAt: new Date(), 
    },
  });
}
