// types/socket.d.ts
import "socket.io";

declare module "socket.io" {
  interface Socket {
    user?: any; // replace `any` with a specific User type if needed
  }
}