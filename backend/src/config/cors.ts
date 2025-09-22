export const allowedOrigins: string[] = (process.env.CORS_ORIGINS ?? "")
  .split(",")
  .map((o) => o.trim())
  .filter((o) => o.length > 0);

export const allowedMethods: string[] = (process.env.CORS_METHODS ?? "")
  .split(",")
  .map((m) => m.trim())
  .filter((m) => m.length > 0);

export const allowedHeaders: string[] = (process.env.CORS_HEADERS ?? "")
  .split(",")
  .map((h) => h.trim())
  .filter((h) => h.length > 0);

if (
  !allowedOrigins.length ||
  !allowedMethods.length ||
  !allowedHeaders.length
) {
  console.error("❌ Missing or invalid CORS configuration in .env");
  process.exit(1);
}

export const corsOptions = {
  origin: allowedOrigins,
  methods: allowedMethods,
  allowedHeaders: allowedHeaders,
  credentials: true,
};
