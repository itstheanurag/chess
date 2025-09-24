import dotenv from "dotenv";
dotenv.config();

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

export const config = {
  server: {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV !== "production",
  },

  jwt: {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || "your-secret-key",
    refreshTokenSecret:
      process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key",
    accessTokenExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "1h",
    refreshTokenExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    // gameSecret: process.env.JWT_GAME_SECRET || "your-game-secret-key",
    issuer: "chess-api",
    audience: "chess-client",
  },

  cors: {
    ...corsOptions,
  },

  websocket: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
  },
} as const;

export const JWT_CONFIG = config.jwt;
