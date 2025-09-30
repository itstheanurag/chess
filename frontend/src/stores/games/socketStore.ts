import { create } from "zustand";
import { Chess, Move } from "chess.js";
import { connectSocket, NamedSocket } from "@/lib";
import { GameSocketState } from "@/types";

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

    gameSocket.on("moveMade", ({ gameState }) => {
      chess.load(gameState.fen);
      set({ gameState });
    });

    gameSocket.on("gameReset", ({ gameState }) => {
      chess.reset();
      set({
        gameState,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
    });

    gameSocket.on("disconnect", () => {
      set({
        gameState: null,
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
    selected: null,
    validMoves: [],
    isJoined: false,
    room: null,
    playerColor: null,
    connect: initializeSocket,

    selectPiece: (square) => {
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
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
      gameSocket?.emit("resetGame");
    },

    disconnect: () => {
      gameSocket?.disconnect();
      gameSocket = null;
      set({
        gameState: null,
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
    },
  };
});
