import { Namespace, Socket } from "socket.io";
import { JoinGameData, JwtPayloadOptions, MoveData } from "@/types";
import { Square } from "chess.js";
import { randomUUID } from "crypto";
import { loadGame, cacheGame } from "@/games";
import prisma from "../db";

export const initializeGameNamespace = (nsp: Namespace) => {
  console.log(`✅ Game namespace initialized: ${nsp.name}`);

  nsp.on("connection", (socket: Socket) => {
    console.group(`🔗 Connection: ${socket.id}`);
    console.groupEnd();

    /**
     * --- JOIN GAME ---
     */
    socket.on("joinGame", async (data: JoinGameData) => {
      const { room: gameId, playerName, isSpectator = false } = data;
      console.log(`[joinGame] Player: ${playerName}, Room: ${gameId}`);

      const game = await loadGame(gameId, prisma);
      if (!game) {
        socket.emit("error", { success: false, message: "Game not found" });
        return;
      }

      socket.join(gameId);

      if (isSpectator) {
        game.addSpectator(playerName);
        await cacheGame(gameId, game);

        socket.emit("spectatorJoined", {
          roomId: gameId,
          gameState: game.getState(),
        });

        socket.to(gameId).emit("spectatorJoined", { playerName });
      } else {
        socket.emit("error", {
          success: false,
          message: "Players must join via API, not socket",
        });
      }
    });

    socket.on("makeMove", async (data: MoveData) => {
      const { room: gameId, move } = data;
      const user = socket.user as JwtPayloadOptions;
      const userId = user.sub;

      const game = await loadGame(gameId, prisma);
      if (!game) {
        socket.emit("error", { success: false, message: "Game not found" });
        return;
      }

      const state = game.getState();

      // check if the user is actually a player in this game
      let playerColor: "w" | "b" | null = null;
      if (state.whitePlayer === userId) playerColor = "w";
      else if (state.blackPlayer === userId) playerColor = "b";

      if (!playerColor) {
        socket.emit("error", {
          success: false,
          message: "You are not a player in this game",
        });
        return;
      }

      // check if it's their turn
      if (game.turn() !== playerColor) {
        socket.emit("error", { success: false, message: "Not your turn" });
        return;
      }

      // validate move
      const { from, to, promotion } = move;
      const validMoves = game.getValidMoves(from as Square);
      const isValid = validMoves.some((m) => m.to === to);
      if (!isValid) {
        socket.emit("error", { success: false, message: "Invalid move" });
        return;
      }

      // apply move
      const result = game.makeMove({
        from: from as Square,
        to: to as Square,
        promotion,
      });
      if (!result.success) {
        socket.emit("error", { success: false, message: result.error });
        return;
      }

      await cacheGame(gameId, game);

      nsp.to(gameId).emit("moveMade", {
        move: result,
        gameState: game.getState(),
      });
    });

    /**
     * --- RESET GAME ---
     */
    socket.on("resetGame", async (gameId: string) => {
      const game = await loadGame(gameId, prisma);
      if (!game) return;

      game.resetGame();
      await cacheGame(gameId, game);

      nsp.to(gameId).emit("gameReset", { gameState: game.getState() });
    });

    /**
     * --- DISCONNECT ---
     */
    socket.on("disconnect", async () => {
      // Optional: check active rooms of this socket and clean up if empty
      console.log(`❌ Disconnected: ${socket.id}`);
    });
  });
};
