import { Namespace, Socket } from "socket.io";
import { ChessGame } from "@/games/chess.game";
import { JoinGameData, MoveData } from "@/types";
import { Square } from "chess.js";

const activeGames: Record<string, ChessGame> = {};


export const initializeGameNamespace = (nsp: Namespace) => {
  console.log(`✅ Game namespace initialized: ${nsp.name}`);

  nsp.on("connection", (socket: Socket) => {
    console.group(`🔗 Connection: ${socket.id}`);
    console.log("Active rooms at connection:", Object.keys(activeGames));
    console.groupEnd();

    // === Join Game ===
    socket.on("joinGame", (data: JoinGameData) => {
      console.group(`🎮 [joinGame] ${socket.id}`);
      console.log("Join data:", data);

      const { room, playerName, isSpectator = false } = data;

      if (!activeGames[room]) {
        activeGames[room] = new ChessGame();
        console.log(`🆕 Created new game for room: ${room}`);
      }

      const game = activeGames[room];
      socket.join(room);
      console.log(`📌 Socket joined room: ${room}`);

      if (!isSpectator) {
        try {
          const playerColor = game.joinPlayer(playerName);
          console.log(`👤 Player joined: ${playerName} as ${playerColor}`);

          socket.emit("gameJoined", {
            success: true,
            playerColor,
            gameState: game.getState(),
          });

          nsp.to(room).emit("playerJoined", {
            playerName,
            playerColor,
            gameState: game.getState(),
          });
        } catch (err) {
          console.error("❌ Failed to join game:", err);
          socket.emit("error", {
            success: false,
            message: err instanceof Error ? err.message : "Unable to join game",
          });
        }
      } else {
        console.log(`👀 Spectator joined: ${playerName}`);
        socket.emit("spectatorJoined", { gameState: game.getState() });
        socket.to(room).emit("spectatorJoined", { playerName });
      }
      console.groupEnd();
    });

    // === Make Move ===
    socket.on("makeMove", (data: MoveData) => {
      console.group(`♟ [makeMove] ${socket.id}`);
      console.log("Move data:", data);

      const { room, move, playerName } = data;
      const game = activeGames[room];
      if (!game) {
        console.warn(`⚠ No game found for room: ${room}`);
        socket.emit("error", { success: false, message: "Game not found" });
        console.groupEnd();
        return;
      }

      const playerColor =
        game.getState().whitePlayer === playerName ? "w" : "b";
      console.log(
        `Expected turn: ${game.turn()}, Player color: ${playerColor}`
      );

      if (game.turn() !== playerColor) {
        console.warn(`🚫 Invalid turn for player: ${playerName}`);
        socket.emit("error", { success: false, message: "Not your turn" });
        console.groupEnd();
        return;
      }

      const fromSquare = move.from as Square;
      const toSquare = move.to as Square;
      const validMoves = game.getValidMoves(fromSquare);
      const isValid = validMoves.some((m) => m.to === toSquare);

      console.table(validMoves.map((m) => ({ from: m.from, to: m.to })));

      if (!isValid) {
        console.warn(`🚫 Invalid move from ${fromSquare} to ${toSquare}`);
        socket.emit("error", { success: false, message: "Invalid move" });
        console.groupEnd();
        return;
      }

      const result = game.makeMove({
        from: fromSquare,
        to: toSquare,
        promotion: move.promotion as "q" | "r" | "b" | "n" | undefined,
      });

      if (!result.success) {
        console.error("❌ Move failed:", result.error);
        socket.emit("error", { success: false, message: result.error });
        console.groupEnd();
        return;
      }

      console.log(`✅ Move successful: ${fromSquare} → ${toSquare}`);
      nsp.to(room).emit("moveMade", {
        move: result,
        gameState: game.getState(),
      });
      console.groupEnd();
    });

    // === Reset Game ===
    socket.on("resetGame", (room: string) => {
      console.group(`🔄 [resetGame] ${socket.id}`);
      console.log(`Reset request for room: ${room}`);
      const game = activeGames[room];
      if (!game) {
        console.warn(`⚠ No game to reset in room: ${room}`);
        console.groupEnd();
        return;
      }
      game.resetGame();
      console.log(`✅ Game reset for room: ${room}`);
      nsp.to(room).emit("gameReset", { gameState: game.getState() });
      console.groupEnd();
    });

    // === Disconnect ===
    socket.on("disconnect", () => {
      console.group(`❎ Disconnect: ${socket.id}`);
      Object.entries(activeGames).forEach(([roomId, game]) => {
        if (game.isEmpty()) {
          delete activeGames[roomId];
          console.log(`🗑 Removed empty game for room: ${roomId}`);
          nsp.to(roomId).emit("gameEnded", {
            message: "Game ended - no players remaining",
          });
        }
      });
      console.groupEnd();
    });
  });
};
