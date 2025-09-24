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

// console.log("✅ CORS configuration loaded:", corsOptions);

export const config = {
  // Server configuration
  server: {
    port: parseInt(process.env.PORT || "4000", 10),
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction: process.env.NODE_ENV === "production",
    isDevelopment: process.env.NODE_ENV !== "production",
  },

  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || "your-secret-key",
    gameSecret: process.env.GAME_JWT_SECRET || "your-game-secret-key",
    expiresIn: process.env.TOKEN_EXPIRES_IN || "1h",
    refreshExpiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || "7d",
    issuer: "chess-api",
    audience: "chess-client",
  },

  // CORS configuration
  cors: {
    ...corsOptions,
  },

  websocket: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
  },
} as const;

export const { JWT_SECRET, GAME_JWT_SECRET, TOKEN_EXPIRES_IN, FRONTEND_URL } = {
  JWT_SECRET: config.jwt.secret,
  GAME_JWT_SECRET: config.jwt.gameSecret,
  TOKEN_EXPIRES_IN: config.jwt.expiresIn,
  FRONTEND_URL: config.cors.origin[0],
};
