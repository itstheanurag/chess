import { Namespace, Socket } from "socket.io";
import { ChessGame } from "@/games/chess.game";
import { JoinGameData, MoveData } from "@/types";

const activeGames: Record<string, ChessGame> = {};

export const initializeGameNamespace = (nsp: Namespace) => {
  console.log("Initializing game namespace", nsp.name);
  nsp.on("connection", (socket: Socket) => {
    console.log("Game namespace connection:", socket.id);

    socket.on("joinGame", (data: JoinGameData) => {
      const { room, playerName, isSpectator = false } = data;

      if (!activeGames[room]) activeGames[room] = new ChessGame();
      const game = activeGames[room];

      socket.join(room);

      if (!isSpectator) {
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
      } else {
        socket.emit("spectatorJoined", { gameState: game.getState() });
        socket.to(room).emit("spectatorJoined", { playerName });
      }
    });

    socket.on("makeMove", (data: MoveData) => {
      const { room, move } = data;
      const game = activeGames[room];
      if (!game)
        return socket.emit("error", {
          success: false,
          message: "Game not found",
        });

      try {
        const result = game.makeMove(move);
        nsp.to(room).emit("moveMade", {
          success: true,
          move: result,
          gameState: game.getState(),
        });
      } catch (err) {
        socket.emit("error", {
          success: false,
          message: err instanceof Error ? err.message : "Invalid move",
        });
      }
    });

    socket.on("resetGame", (room: string) => {
      if (!activeGames[room]) return;
      activeGames[room].resetGame();
      nsp.to(room).emit("gameReset", {
        board: activeGames[room].getBoard(),
        turn: activeGames[room].getTurn(),
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
