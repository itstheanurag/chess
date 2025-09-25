import z from "zod";

export const createGameSchema = z
  .object({
    type: z.enum(["PUBLIC", "PRIVATE"]).default("PUBLIC"),
    passcode: z.string().max(20).optional(),
    fen: z.string().optional(),
  })
  .refine(
    (data) => (data.type === "PRIVATE" ? !!data.passcode : !data.passcode),
    {
      message:
        "Passcode is required for PRIVATE games and not allowed for PUBLIC games",
      path: ["passcode"],
    }
  );

export const joinGameSchema = z.object({
  gameId: z.string(),
  passcode: z.string().optional(),
});
