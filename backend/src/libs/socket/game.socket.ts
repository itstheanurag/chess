import { Namespace, Socket } from "socket.io";
import { JoinGameData, User, MoveData } from "@/types";
import { Square } from "chess.js";
import { loadGame, cacheGame, removeCachedGame } from "@/games";
import { gameStorage } from "@/storage/game";

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

      const game = await loadGame(gameId);
      if (!game) {
        socket.emit("error", { success: false, message: "Game not found" });
        return;
      }

      socket.join(gameId);

      const userId = socket.user?.id;
      const state = game.getState();
      let playerColor: "w" | "b" | null = null;

      if (userId) {
        if (state.whitePlayer === userId) playerColor = "w";
        else if (state.blackPlayer === userId) playerColor = "b";
      }

      if (playerColor) {
        // Player joining
        socket.emit("gameJoined", {
          gameState: state,
          playerColor,
          roomId: gameId,
        });

        if (game.isFull()) {
          const dbGame = await gameStorage.findById(gameId);
          if (dbGame && dbGame.status === "ONGOING") {
            nsp.to(gameId).emit("gameStarted", {
              gameState: state,
              startedAt: dbGame.startedAt,
            });
          }
        }
      } else {
        game.addSpectator(playerName || socket.user?.name || "Anonymous");
        await cacheGame(gameId, game);

        socket.emit("gameJoined", {
          gameState: state,
          playerColor: null,
          roomId: gameId,
        });

        socket.to(gameId).emit("spectatorJoined", {
          playerName: playerName || socket.user?.name || "Anonymous",
        });
      }
    });

    socket.on("makeMove", async (data: MoveData) => {
      const { room: gameId, move } = data;
      const user = socket.user as User;
      const userId = user.id;

      const game = await loadGame(gameId);
      if (!game) {
        socket.emit("error", { success: false, message: "Game not found" });
        return;
      }

      const state = game.getState();

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

      // Persist move and update game state in DB
      const dbGame = await gameStorage.findById(gameId);
      if (dbGame) {
        await gameStorage.createMove({
          gameId,
          moveNumber: dbGame.moves.length + 1,
          playerId: userId,
          fromSquare: from,
          toSquare: to,
          promotion,
          fen: game.fen(),
        });

        const updates: any = { fen: game.fen() };

        if (result.status === "checkmate") {
          updates.status = "FINISHED";
          updates.result = game.turn() === "w" ? "black_win" : "white_win";
          updates.endedAt = new Date();
        } else if (
          ["draw", "stalemate", "threefold", "insufficient", "50move"].includes(
            result.status
          )
        ) {
          updates.status = "FINISHED";
          updates.result = "draw";
          updates.endedAt = new Date();
        }

        await gameStorage.update(gameId, updates);
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
      const game = await loadGame(gameId);
      if (!game) return;

      game.resetGame();
      await cacheGame(gameId, game);

      nsp.to(gameId).emit("gameReset", { gameState: game.getState() });
    });

    socket.on("leaveGame", async (gameId: string) => {
      const game = await loadGame(gameId);
      if (!game) return;
      socket.leave(gameId);
      const user = socket.user as User;
      const userId = user.id;

      // game.removePlayerOrSpectator(userId);
      await cacheGame(gameId, game);
      socket.to(gameId).emit("playerLeft", { userId });
    });

    /**
     * --- RESIGN GAME ---
     */
    socket.on("resignGame", async (data: { room: string }) => {
      const { room: gameId } = data;
      const user = socket.user as User;
      const userId = user.id;

      const game = await loadGame(gameId);
      if (!game) return;

      const state = game.getState();
      let playerColor: "w" | "b" | null = null;
      if (state.whitePlayer === userId) playerColor = "w";
      else if (state.blackPlayer === userId) playerColor = "b";

      if (!playerColor) {
        socket.emit("error", { message: "You are not a player in this game" });
        return;
      }

      // Update DB
      const winner = playerColor === "w" ? "black_win" : "white_win";
      await gameStorage.update(gameId, {
        status: "FINISHED",
        result: winner,
        endedAt: new Date(),
      });

      // Update cache? Or just remove it?
      // Usually removing is safer as it forces reload.
      await removeCachedGame(gameId); // Import this if not imported

      nsp.to(gameId).emit("gameResigned", {
        winner: playerColor === "w" ? "b" : "w",
        resignedBy: playerColor,
        gameState: { ...state, status: "checkmate" }, // sending checkmate as proxy for end of game for now, or update types
      });
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
