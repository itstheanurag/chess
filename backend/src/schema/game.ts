import z from "zod";

// --- Enums ---
export enum GameType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export enum GameStatus {
  WAITING = "WAITING",
  IN_PROGRESS = "IN_PROGRESS",
  FINISHED = "FINISHED",
}

// --- Schemas ---
export const createGameSchema = z
  .object({
    type: z.nativeEnum(GameType).default(GameType.PUBLIC),
    passcode: z.string().max(20).optional(),
    fen: z.string().optional(),
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
  type: z.nativeEnum(GameType).default(GameType.PUBLIC),
  status: z.nativeEnum(GameStatus),
});
