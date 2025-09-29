import { Router, Request, Response } from "express";
import AuthRoutes from "./auth.route";
import GameRoutes from "./game.route";
import UserRoutes from "./user.route";

const router: Router = Router();

router.use("/api/auth", AuthRoutes);
router.use("/api/games", GameRoutes);
router.use("/api/users", UserRoutes);

router.get("/health", (_req: Request, res: Response) => {
  return res.status(200).json({
    status: "ok",
    service: "chess-api",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

export default router;
