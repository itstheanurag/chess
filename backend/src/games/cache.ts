import { ChessGame } from "@/games/chess.game";
import { redisClient } from "@/libs";

const GAME_KEY_PREFIX = "active_games";

/**
 * Build Redis key for a given gameId
 */
const getGameKey = (gameId: string) => `${GAME_KEY_PREFIX}:${gameId}`;

/**
 * Save game state to Redis
 * @param gameId
 * @param game
 */
export async function cacheGame(
  gameId: string,
  game: ChessGame
): Promise<void> {
  const state = {
    fen: game.fen(),
    state: game.getState(),
  };

  await redisClient.set(getGameKey(gameId), JSON.stringify(state), {
    EX: 60 * 60 * 6, 
  });
}

export async function getCachedGame(
  gameId: string
): Promise<{ fen: string; state: any } | null> {
  const raw = await redisClient.get(getGameKey(gameId));
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export async function removeCachedGame(gameId: string): Promise<void> {
  await redisClient.del(getGameKey(gameId));
}

export async function loadGame(
  gameId: string,
  prisma: any
): Promise<ChessGame | null> {
  const cached = await getCachedGame(gameId);
  if (cached) {
    const game = new ChessGame(cached.fen);

    return game;
  }

  const dbGame = await prisma.game.findUnique({
    where: { id: gameId },
    include: { whitePlayer: true, blackPlayer: true, spectators: true },
  });

  if (!dbGame) return null;

  const game = new ChessGame(dbGame.fen);

  if (dbGame.whitePlayer) game.joinPlayer(dbGame.whitePlayerId, "w");
  if (dbGame.blackPlayer) game.joinPlayer(dbGame.blackPlayerId, "b");

  for (const spec of dbGame.spectators) {
    game.addSpectator(spec.spectatorId);
  }

  await cacheGame(gameId, game);

  return game;
}
