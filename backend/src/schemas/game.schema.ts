import { GameRequestStatusEnum, GameStatus, GameType } from "@enums/index";
import { z } from "zod";

const GLOBAL_CUID_REGEX = /^c[1-9a-km-zA-HJ-NP-Za-km-z]{25}$/;

export const CreateGameRequestSchema = z.object({
  senderId: z
    .string()
    .regex(GLOBAL_CUID_REGEX, "Sender ID must be a valid CUID"),
  receiverId: z
    .string()
    .regex(GLOBAL_CUID_REGEX, "Receiver ID must be a valid CUID"),
  gameId: z.string().regex(GLOBAL_CUID_REGEX, "Game ID must be a valid CUID"),
  message: z.string().optional(),
});

export const JoinGameRequestSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .optional()
    .describe("Name must be a valid string"),
  status: z
  .enum(
    [
      GameRequestStatusEnum.ACCEPT, 
      GameRequestStatusEnum.REJECT
    ]
  )
  .default(GameRequestStatusEnum.REJECT),
});

export const CreateGameSchema = z.object({
  gameType: z.enum([GameType.PRIVATE, GameType.PUBLIC], {
    required_error: "Game type is required",
    invalid_type_error: "Game type must be either 'PRIVATE' or 'PUBLIC'",
  }),
  status: z
    .enum(
      [
      GameStatus.WAITING, 
      GameStatus.IN_PROGRESS,
      GameStatus.COMPLETED
      ]
    )
    .optional()
    .default(GameStatus.WAITING),
  gameState: z
    .string()
    .optional()
    .describe("Game state must be a valid string"),
  createdBy: z
    .string()
    .optional()
    .describe("Creator ID must be a valid string"),
  maxSpectatorCount: z
    .number()
    .min(0, "Max spectator count must be at least 0")
    .default(0),
  currentSpectatorCount: z
    .number()
    .min(0, "Current spectator count must be at least 0")
    .default(0),
});

export type CreateGameDto = z.infer<typeof CreateGameSchema> 
export type CreateGameSchemaWithRequiredFields = CreateGameDto & {
  gameState: string;
  createdBy: string;
};
export type CreateGameRequestDto = z.infer<typeof CreateGameRequestSchema>;
export type JoinGameRequestDto = z.infer<typeof JoinGameRequestSchema>;
