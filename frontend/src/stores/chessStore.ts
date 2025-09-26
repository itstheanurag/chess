import { create } from "zustand";
import { Chess, Square, Move } from "chess.js";
import { normalizeBoard } from "@/utils";
import { Game } from "@/types";
import { connectSocket, NamedSocket } from "@/lib";

function generatePlayerName() {
  return `Player-${Math.floor(Math.random() * 9000 + 1000)}`;
}

export const useGameStore = create<Game>((set, get) => {
  const chess = new Chess();

  let gameSocket: NamedSocket | null = null;

  const initializeSocket = () => {
    if (gameSocket) return;

    gameSocket = connectSocket({ namespace: "game" });

    gameSocket.on("gameJoined", ({ gameState, playerColor, roomId }) => {
      const board = normalizeBoard(gameState.board);
      chess.load(gameState.fen);
      set({
        gameState: { ...gameState, board },
        room: roomId,
        playerColor,
        isJoined: true,
      });
    });

    gameSocket.on("moveMade", (data) => {
      chess.load(data.gameState.fen);
      set({ gameState: data.gameState });
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
    playerName: generatePlayerName(),

    // **Manual connection**
    connect: () => initializeSocket(),

    joinGame: (
      room: string,
      playerName = generatePlayerName(),
      isSpectator = false
    ) => {
      get().connect();
      if (!gameSocket) return;

      set({ playerName });
      gameSocket.emit("joinGame", { room, playerName, isSpectator });
    },

    selectPiece: (square: Square) => {
      const moves = chess.moves({ square, verbose: true }) as Move[];
      set({ selected: square, validMoves: moves });
    },

    makeMove: (move) => {
      const { validMoves, room, playerName } = get();
      const isValid = validMoves.some((m) => m.to === move.to);
      if (!isValid) return console.warn("Invalid move locally");
      if (!gameSocket) return;

      gameSocket.emit("makeMove", { room, move, playerName });
      set({ selected: null, validMoves: [] });
    },

    clearSelection: () => {
      set({ selected: null, validMoves: [] });
    },

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
      if (gameSocket) gameSocket.emit("resetGame");
    },

    disconnect: () => {
      if (gameSocket) {
        gameSocket.disconnect();
        gameSocket = null;
      }
      set({
        isJoined: false,
        room: null,
        playerColor: null,
        selected: null,
        validMoves: [],
      });
    },
  };
});
