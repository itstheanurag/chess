import "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: any;
  }
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
