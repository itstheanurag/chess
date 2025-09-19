import { Socket, Namespace } from "socket.io";
import { ChessGame } from "@/games/chess.game";
import { ChatMessage, JoinGameData, MoveData } from "@/types";

// Store active games by room ID
const activeGames: Record<string, ChessGame> = {};

export const initializeSocket = (
  nsp: Namespace,
  namespaceType: "game" | "chat" = "game"
) => {
  console.log(`Initializing ${namespaceType} namespace`);

  nsp.on("connection", (socket: Socket) => {
    console.log(`New connection to ${namespaceType} namespace:`, socket.id);

    // Common handlers for all namespaces
    socket.on("disconnect", () => {
      console.log(`Client disconnected from ${namespaceType}:`, socket.id);
    });

    socket.on("error", (error) => {
      console.error(`Socket error in ${namespaceType}:`, error);
    });

    // Namespace-specific handlers
    if (namespaceType === "chat") {
      // Chat-specific logic
      socket.on("joinChat", (room: string) => {
        socket.join(room);
        console.log(`User ${socket.id} joined chat room: ${room}`);
        socket.emit("chatJoined", { room });
      });

      socket.on("sendMessage", (data: ChatMessage) => {
        console.log(`New message in room ${data.room} from ${data.sender}`);
        const messageData = {
          ...data,
          timestamp: new Date(),
          socketId: socket.id,
        };
        // Broadcast to all in room including sender
        nsp.to(data.room).emit("newMessage", messageData);
      });

      socket.on("typing", (data: { room: string; user: string }) => {
        socket.to(data.room).emit("userTyping", {
          user: data.user,
          socketId: socket.id,
        });
      });
    } else if (namespaceType === "game") {
      // Game-specific logic for /game namespace
      socket.on("joinGame", (data: JoinGameData) => {
        const { room, playerName, isSpectator = false } = data;

        try {
          // Initialize game if it doesn't exist
          if (!activeGames[room]) {
            activeGames[room] = new ChessGame();
            console.log(`New game created in room: ${room}`);
          }

          const game = activeGames[room];

          // Join the room
          socket.join(room);

          // Handle player joining
          if (!isSpectator) {
            const playerColor = game.joinPlayer(playerName);
            socket.emit("gameJoined", {
              success: true,
              playerColor,
              gameState: game.getState(),
              message: `Joined game as ${playerColor}`,
            });

            // Notify other players
            nsp.to(room).emit("playerJoined", {
              playerName,
              playerColor,
              gameState: game.getState(),
              message: `${playerName} joined as ${playerColor}`,
            });
          } else {
            // Spectator joining
            socket.emit("spectatorJoined", {
              gameState: game.getState(),
              message: "Joined as spectator",
            });

            // Notify other players
            socket.to(room).emit("spectatorJoined", {
              playerName,
              message: `${playerName} joined as spectator`,
            });
          }

          console.log(
            `${playerName} joined ${
              isSpectator ? "as spectator in" : "game in"
            } room: ${room}`
          );
        } catch (error) {
          console.error("Error joining game:", error);
          socket.emit("error", {
            success: false,
            message:
              error instanceof Error ? error.message : "Failed to join game",
          });
        }
      });

      // Handle making a move
      socket.on("makeMove", (data: MoveData) => {
        const { room, move } = data;
        const game = activeGames[room];

        if (!game) {
          return socket.emit("error", {
            success: false,
            message: "Game not found",
          });
        }

        try {
          const result = game.makeMove(move);
          const gameState = game.getState();

          console.log(`Move made in room ${room}:`, {
            move: {
              from: result.from,
              to: result.to,
              promotion: result.promotion,
              san: result.san,
              lan: result.lan,
            },
            by: socket.id,
            fen: gameState.fen,
          });

          // Broadcast move to all clients in the room including sender
          nsp.to(room).emit("moveMade", {
            success: true,
            move: {
              from: result.from,
              to: result.to,
              promotion: result.promotion,
              san: result.san,
              lan: result.lan,
            },
            gameState,
            status: game.getStatus(),
            message: "Move successful",
          });
        } catch (error) {
          console.error("Move error:", error);
          socket.emit("error", {
            success: false,
            message: error instanceof Error ? error.message : "Invalid move",
            validMoves: game?.getValidMoves(),
          });
        }
      });

      // Handle game reset
      socket.on("resetGame", (room: string) => {
        if (activeGames[room]) {
          activeGames[room].resetGame();
          nsp.to(room).emit("gameReset", {
            board: activeGames[room].getBoard(),
            turn: activeGames[room].getTurn(),
            status: activeGames[room].getGameStatus(),
          });
        }
      });
    }

    socket.on("disconnect", () => {
      console.log(`Client ${socket.id} disconnected from game namespace`);

      // Find and clean up empty games
      Object.entries(activeGames).forEach(([roomId, game]) => {
        if (game.isEmpty()) {
          delete activeGames[roomId];
          console.log(`Game in room ${roomId} removed - no players`);

          // Notify remaining clients in the room
          nsp.to(roomId).emit("gameEnded", {
            message: "Game ended - no players remaining",
          });
        }
      });
    });
  });
};

export const handleMessage = (socket: Socket, message: string) => {
  console.log("Message from client:", message);
  socket.broadcast.emit("message", message);
};

export const joinRoom = (socket: Socket, room: string) => {
  socket.join(room);
  socket.emit("joinMessageToRoom", `You have joined the room: ${room}`);
};

export const sendMessageToRoom = (
  socket: Socket,
  room: string,
  message: string
) => {
  socket.to(room).emit("sendMessageToRoom", room, message);
};

export const disconnectSocket = (socket: Socket) => {
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};
