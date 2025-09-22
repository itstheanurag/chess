import { allowedHeaders, allowedMethods, allowedOrigins } from "@/config/cors";
import cors, { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {   
    if (!origin || allowedOrigins.includes(origin!)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: allowedMethods,
  allowedHeaders,
  credentials: true,
};

export const corsMiddleware = cors(corsOptions);
