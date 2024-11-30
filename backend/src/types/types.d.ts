import { Request } from "express";

export type UserType = {
  id: string;
  roomId?: string;
  socketId?: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: UserType; 
    }
  }
}
