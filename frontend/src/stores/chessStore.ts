import { create } from "zustand";
import { Chess, Square, Move } from "chess.js";
import {
  createGame,
  joinGame,
  listGames,
  mapBackendGameToGameState,
  normalizeBoard,
} from "@/utils";
import {
  CreateGameData,
  GameContext,
  GameType,
  JoinGameData,
  SearchGame,
} from "@/types";
import { connectSocket, NamedSocket } from "@/lib";

export const useGameStore = create<GameContext>((set, get) => {
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

    playerName: "",
    gameName: "",
    gameType: GameType.PUBLIC,
    notes: "",
    userGames: [],

    setGameName: (name: string) => set({ gameName: name }),
    setGameType: (type: GameType) => set({ gameType: type }),
    setNotes: (notes: string) => set({ notes }),
    setPlayerName: (name: string) => set({ playerName: name }),

    connect: () => initializeSocket(),

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
        gameName: "",
        gameType: GameType.PUBLIC,
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

    createGame: async (data?: {
      passcode?: string;
      blackPlayerId?: string;
    }) => {
      const payload: CreateGameData = {
        type: get().gameType,
        gameName: get().gameName,
        note: get().notes,
        passcode: data?.passcode ?? "",
        blackPlayerId: data?.blackPlayerId ?? "",
      };

      await createGame(payload);
    },

    listGames: async (filters?: SearchGame) => {
      const games = await listGames(filters);
      if (games) {
        set({ userGames: games });
      }
    },

    joinGame: async (data: JoinGameData) => {
      const game = await joinGame(data);

      if (game)
        set({
          gameState: mapBackendGameToGameState(game),
          room: game.id.toString(),
          gameType: game.type,
        });
    },
  };
});
