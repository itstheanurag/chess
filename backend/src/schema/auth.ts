import z from "zod";

export const registerSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.email().max(100),
  password: z.string().min(6),
});

export const loginSchema = z.object({
  email: z.email().max(100),
  password: z.string().min(6),
});
