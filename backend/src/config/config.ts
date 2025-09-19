import dotenv from "dotenv";

dotenv.config();

/**
 * Application configuration
 */
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
    origin: process.env.FRONTEND_URL?.split(",") || ["http://localhost:3000"],
    credentials: true,
  },

  // WebSocket configuration
  websocket: {
    pingTimeout: 60000, // 60 seconds
    pingInterval: 25000, // 25 seconds
    maxHttpBufferSize: 1e8, // 100MB
  },
} as const;

// Export individual configs for backward compatibility
export const { JWT_SECRET, GAME_JWT_SECRET, TOKEN_EXPIRES_IN, FRONTEND_URL } = {
  JWT_SECRET: config.jwt.secret,
  GAME_JWT_SECRET: config.jwt.gameSecret,
  TOKEN_EXPIRES_IN: config.jwt.expiresIn,
  FRONTEND_URL: config.cors.origin[0],
};
