import { Namespace, Socket } from "socket.io";
import { activeGames, ChessGame } from "@/games/chess.game";
import { JoinGameData, MoveData } from "@/types";
import { Square } from "chess.js";
import { randomUUID } from "crypto";

function getOrCreateRoom(
  roomId: string,
  playerName: string
): {
  roomId: string;
  game: ChessGame;
} {
  for (const [existingRoomId, game] of Object.entries(activeGames)) {
    if (existingRoomId === roomId && game.isFull()) {
      game.addSpectator(randomUUID());
      console.log(`👀 Joined existing room as spectator: ${roomId}`);
      return { roomId: existingRoomId, game };
    } else if (existingRoomId === roomId && !game.isFull()) {
      game.joinPlayer(playerName);
      return { roomId, game };
    }
  }

  const game = new ChessGame();
  activeGames[roomId] = game;
  console.log(`🆕 Created new game room: ${roomId}`);
  return { roomId, game };
}

export const initializeGameNamespace = (nsp: Namespace) => {
  console.log(`✅ Game namespace initialized: ${nsp.name}`);

  nsp.on("connection", (socket: Socket) => {
    console.group(`🔗 Connection: ${socket.id}`);
    console.log("Active rooms:", Object.keys(activeGames));
    console.groupEnd();

    socket.on("joinGame", (data: JoinGameData) => {
      const { room: requestedRoom, playerName, isSpectator = false } = data;

      let roomId = requestedRoom;
      let game: ChessGame | undefined = requestedRoom
        ? activeGames[requestedRoom]
        : undefined;

      if (!game || game.isFull()) {
        ({ roomId, game } = getOrCreateRoom(roomId, playerName));
      }

      socket.join(roomId);

      if (!isSpectator) {
        try {
          const playerColor = game.joinPlayer(playerName);

          socket.emit("gameJoined", {
            success: true,
            playerColor,
            roomId,
            gameState: game.getState(),
          });

          nsp.to(roomId).emit("playerJoined", {
            playerName,
            playerColor,
            roomId,
            gameState: game.getState(),
          });
        } catch (err) {
          socket.emit("error", {
            success: false,
            message: err instanceof Error ? err.message : "Unable to join game",
          });
        }
      } else {
        socket.emit("spectatorJoined", { roomId, gameState: game.getState() });
        socket.to(roomId).emit("spectatorJoined", { playerName });
      }
      console.groupEnd();
    });

    socket.on("makeMove", (data: MoveData) => {
      const { room, move, playerName } = data;
      console.log("\n[makeMove] Incoming move:", {
        room,
        playerName,
        move,
      });

      const game = activeGames[room];
      if (!game) {
        console.error("[makeMove] ❌ Game not found for room:", room);
        socket.emit("error", { success: false, message: "Game not found" });
        return;
      }

      const playerColor =
        game.getState().whitePlayer === playerName ? "w" : "b";

      console.log(
        "[makeMove] Player color:",
        playerColor,
        "| Current turn:",
        game.turn()
      );

      if (game.turn() !== playerColor) {
        console.warn("[makeMove] ❌ Not player's turn:", {
          playerName,
          attemptedColor: playerColor,
          actualTurn: game.turn(),
        });
        socket.emit("error", { success: false, message: "Not your turn" });
        return;
      }

      const { from, to, promotion } = move;
      console.log("[makeMove] Attempting move:", { from, to, promotion });

      const validMoves = game.getValidMoves(from as Square);
      console.log("[makeMove] Valid moves from", from, ":", validMoves);

      const isValid = validMoves.some((m) => m.to === to);
      if (!isValid) {
        console.warn("[makeMove] ❌ Invalid move attempted:", { from, to });
        socket.emit("error", { success: false, message: "Invalid move" });
        return;
      }

      const result = game.makeMove({
        from: from as Square,
        to: to as Square,
        promotion,
      });

      if (!result.success) {
        console.error("[makeMove] ❌ Move failed:", result.error);
        socket.emit("error", { success: false, message: result.error });
        return;
      }

      console.log("[makeMove] ✅ Move successful:", result);

      nsp.to(room).emit("moveMade", {
        move: result,
        gameState: game.getState(),
      });
    });

    socket.on("resetGame", (room: string) => {
      const game = activeGames[room];
      if (!game) return;
      game.resetGame();
      nsp.to(room).emit("gameReset", { gameState: game.getState() });
    });

    socket.on("disconnect", () => {
      Object.entries(activeGames).forEach(([roomId, game]) => {
        if (game.isEmpty()) {
          delete activeGames[roomId];
          nsp.to(roomId).emit("gameEnded", {
            message: "Game ended - no players remaining",
          });
        }
      });
    });
  });
};
