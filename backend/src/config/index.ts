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

  cors: {
    ...corsOptions,
  },

  websocket: {
    pingTimeout: 60000,
    pingInterval: 25000,
    maxHttpBufferSize: 1e8,
  },

  auth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
} as const;

