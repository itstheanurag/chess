import { create } from "zustand";
import { toast } from "react-toastify";
import { Chess, Move } from "chess.js";
import { connectSocket, NamedSocket } from "@/lib";
import { GameSocketState, GameStateData } from "@/types";

export const useGameSocketStore = create<GameSocketState>((set, get) => {
  const chess = new Chess();
  let gameSocket: NamedSocket | null = null;

  const initializeSocket = () => {
    if (gameSocket) return;

    gameSocket = connectSocket({ namespace: "game" });

    gameSocket.on("gameJoined", ({ gameState, playerColor, roomId }) => {
      chess.load(gameState.fen);
      set({ gameState, room: roomId, playerColor, isJoined: true });
    });

    gameSocket.on("moveMade", ({ gameState, move }) => {
      chess.load(gameState.fen);
      set({ gameState, lastMove: move });
    });

    gameSocket.on("gameStarted", ({ gameState, startedAt }) => {
      chess.load(gameState.fen);
      set({ gameState: { ...gameState, startedAt } });
    });

    gameSocket.on("gameReset", ({ gameState }) => {
      chess.reset();
      set({
        gameState,
        lastMove: null,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
    });

    gameSocket.on(
      "gameResigned",
      (data: {
        message?: string;
        gameState?: GameStateData;
        winner?: string;
        resignedBy?: string;
      }) => {
        if (data?.message) {
          toast.info(data.message);
        }
        if (data?.gameState) {
          if (data.gameState.fen) {
            chess.load(data.gameState.fen);
          }
          set({
            gameState: {
              ...data.gameState,
              winner: data.winner,
              resignedBy: data.resignedBy,
            },
          });
        }
      }
    );

    gameSocket.on("disconnect", () => {
      set({
        gameState: null,
        lastMove: null,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
      gameSocket = null;
    });
  };

  return {
    gameState: null,
    lastMove: null,
    selected: null,
    validMoves: [],
    isJoined: false,
    room: null,
    playerColor: null,
    connect: initializeSocket,

    joinGame: (data: {
      room: string;
      playerName: string;
      isSpectator?: boolean;
    }) => {
      if (!gameSocket) initializeSocket();
      // Wait for connection? Usually socket.io buffers events.
      // But initializeSocket sets gameSocket.
      // We might need to wait a bit or just emit.
      // If initializeSocket creates the socket, it's sync.

      // We need to make sure we don't emit before connection if possible, but socket.io handles it.
      // However, initializeSocket checks `if (gameSocket) return`.

      // Let's just emit.
      gameSocket?.emit("joinGame", data);
    },

    selectPiece: (square) => {
      const { playerColor } = get();
      const piece = chess.get(square);

      if (piece?.color !== playerColor) return;

      const moves = chess.moves({ square, verbose: true }) as Move[];
      set({ selected: square, validMoves: moves });
    },

    makeMove: (move) => {
      const { validMoves, room } = get();
      if (!validMoves.some((m) => m.to === move.to)) return;
      if (!gameSocket) return;

      gameSocket.emit("makeMove", { room, move });
      set({ selected: null, validMoves: [] });
    },

    clearSelection: () => set({ selected: null, validMoves: [] }),

    resetGame: () => {
      chess.reset();
      set({
        gameState: null,
        lastMove: null,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
      gameSocket?.emit("resetGame");
    },

    resignGame: () => {
      const { room } = get();
      if (!gameSocket || !room) return;
      gameSocket.emit("resignGame", { room });
    },

    disconnect: () => {
      gameSocket?.disconnect();
      gameSocket = null;
      set({
        gameState: null,
        lastMove: null,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
    },
  };
});
