import { z } from "zod";

export const CreateUserShema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters long")
    .regex(/^[A-Za-z0-9@_.-]+$/, "Username can only include letters, numbers, and special characters (@, _, ., -)"),
  password: z
    .string()
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least 1 uppercase letter, 1 lowercase letter, 1 number, 1 special character, and be at least 8 characters long"
    ),
});

export type CreateUserDto = z.infer<typeof CreateUserShema>;
