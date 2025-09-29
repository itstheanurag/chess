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

export const paginatedSearchSchema = z.object({
  q: z.string().min(1, "Query parameter 'q' is required").trim(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be a positive number"),
  size: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 20))
    .refine((val) => val > 0, "Size must be a positive number"),
});
