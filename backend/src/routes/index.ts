import { Router, Request, Response } from "express";
import authRoutes from "./auth.route";
import gameRoutes from "./game.route";

const router: Router = Router();

router.use("/api/auth", authRoutes);
router.use("/api/games", gameRoutes);

router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    service: "chess-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
