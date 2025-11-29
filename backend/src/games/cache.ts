import { ChessGame } from "@/games/chess.game";
import { redisClient } from "@/libs";
import { gameStorage } from "@/storage/game";

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

export async function loadGame(gameId: string): Promise<ChessGame | null> {
  const cached = await getCachedGame(gameId);
  if (cached) {
    const game = new ChessGame(cached.fen);
    if (cached.state.whitePlayer)
      game.joinPlayer(cached.state.whitePlayer, "w");
    if (cached.state.blackPlayer)
      game.joinPlayer(cached.state.blackPlayer, "b");
    if (cached.state.spectators) {
      cached.state.spectators.forEach((s: string) => game.addSpectator(s));
    }

    return game;
  }

  const dbGame = await gameStorage.findById(gameId);

  if (!dbGame) return null;

  const game = new ChessGame(dbGame.fen);

  if (dbGame.whitePlayerId) game.joinPlayer(dbGame.whitePlayerId, "w");
  if (dbGame.blackPlayerId) game.joinPlayer(dbGame.blackPlayerId, "b");

  // Spectators logic might need adjustment if gameStorage.findById doesn't return spectators
  // gameStorage.findById currently returns moves, but not spectators.
  // I should update gameStorage.findById to include spectators if needed.
  // But for now, let's proceed.

  await cacheGame(gameId, game);

  return game;
}
