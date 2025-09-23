import { Namespace, Socket } from "socket.io";
import { ChessGame } from "@/games/chess.game";
import { JoinGameData, MoveData } from "@/types";
import { Square } from "chess.js";

const activeGames: Record<string, ChessGame> = {};

export const initializeGameNamespace = (nsp: Namespace) => {
  console.log("Initializing game namespace", nsp.name);
  console.log("Active Games", activeGames);

  nsp.on("connection", (socket: Socket) => {
    socket.on("joinGame", (data: JoinGameData) => {
      const { room, playerName, isSpectator = false } = data;

      if (!activeGames[room]) activeGames[room] = new ChessGame();
      const game = activeGames[room];

      socket.join(room);

      if (!isSpectator) {
        try {
          const playerColor = game.joinPlayer(playerName);
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
          socket.emit("error", {
            success: false,
            message: err instanceof Error ? err.message : "Unable to join game",
          });
        }
      } else {
        socket.emit("spectatorJoined", { gameState: game.getState() });
        socket.to(room).emit("spectatorJoined", { playerName });
      }
    });

    socket.on("makeMove", (data: MoveData) => {
      const { room, move, playerName } = data;
      const game = activeGames[room];
      if (!game)
        return socket.emit("error", {
          success: false,
          message: "Game not found",
        });

      const playerColor =
        game.getState().whitePlayer === playerName ? "w" : "b";
      if (game.turn() !== playerColor) {
        return socket.emit("error", {
          success: false,
          message: "Not your turn",
        });
      }

      const fromSquare = move.from as Square;
      const toSquare = move.to as Square;

      const validMoves = game.getValidMoves(fromSquare);
      const isValid = validMoves.some((m) => m.to === toSquare);
      if (!isValid) {
        return socket.emit("error", {
          success: false,
          message: "Invalid move",
        });
      }

      const result = game.makeMove({
        from: fromSquare,
        to: toSquare,
        promotion: move.promotion as "q" | "r" | "b" | "n" | undefined,
      });

      if (!result.success) {
        return socket.emit("error", { success: false, message: result.error });
      }

      nsp.to(room).emit("moveMade", {
        move: result,
        gameState: game.getState(),
      });
    });

    socket.on("resetGame", (room: string) => {
      const game = activeGames[room];
      if (!game) return;

      game.resetGame();
      nsp.to(room).emit("gameReset", {
        gameState: game.getState(),
      });
    });

    socket.on("disconnect", () => {
      console.log(`Socket ${socket.id} disconnected from game`);
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
