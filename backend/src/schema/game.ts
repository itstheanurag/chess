import z, { nullable } from "zod";

export enum GameType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum GameStatus {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",

  CHALLENGE_RAISED = "challenge_raised",
  CHALLENGE_ACCEPTED = "challenge_accepted",
  CHALLENGE_DECLINED = "challenge_declined",
  CHALLENGE_EXPIRED = "challenge_expired",

  CANCELLED = "cancelled",
  EXPIRED = "expired",
  ABANDONED = "abandoned",

  RESIGNED = "resigned",
  TIMEOUT = "timeout",
  CHECKMATE = "checkmate",
  STALEMATE = "stalemate",
  DRAW = "draw",

  DISCONNECTED = "disconnected",
  PAUSED = "paused",
  TERMINATED = "terminated",
  INVALID = "invalid",
}

export enum ChessResult {
  WHITE_WIN = "white_win",
  BLACK_WIN = "black_win",
  DRAW = "draw",

  STALEMATE = "stalemate",
  THREEFOLD_REPETITION = "threefold_repetition",
  FIFTY_MOVE_RULE = "fifty_move_rule",
  INSUFFICIENT_MATERIAL = "insufficient_material",
  AGREED_DRAW = "agreed_draw",

  RESIGNATION = "resignation",
  TIMEOUT = "timeout",
  DISCONNECTION = "disconnection",
  ABANDONED = "abandoned",
}

export const createGameSchema = z
  .object({
    gameName: z.string("Name is required for game Creation"),
    type: z.enum(GameType).default(GameType.PUBLIC),
    passcode: z.string().max(20).optional(),
    fen: z.string().optional(),
    blackPlayerId: z.string().optional().nullable(),
    notes: z.string().optional(),
  })
  .refine(
    (data) =>
      data.type === GameType.PRIVATE ? !!data.passcode : !data.passcode,
    {
      message:
        "Passcode is required for PRIVATE games and not allowed for PUBLIC games",
      path: ["passcode"],
    }
  );

export const joinGameSchema = z.object({
  passcode: z.string().optional(),
});

export const searchGamesSchema = z.object({
  type: z.enum(GameType).default(GameType.PUBLIC),
  status: z.enum(GameStatus),
});

export const paginatedGameSearchSchema = z.object({
  q: z.string().optional(),
  page: z.string().regex(/^\d+$/).transform(Number).default(1),
  size: z.string().regex(/^\d+$/).transform(Number).default(15),
  status: z.enum(GameStatus).optional(),
  type: z.enum(GameType).optional(),
});
