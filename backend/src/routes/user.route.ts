import { Router } from "express";
import { searchUser } from "@/handler";
import { authGuard } from "@/middlewares";

const UserRoutes: Router = Router();

UserRoutes.get("/health", (_req: any, res: any) => {
  res.status(200).json({
    success: true,
    service: "users",
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

UserRoutes.use(authGuard);

UserRoutes.get("", searchUser);

export default UserRoutes;
