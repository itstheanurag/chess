import { create } from "zustand";
import { callCreateGameApi, callJoinGameApi, callListGameApi } from "@/utils";
import {
  CreateGameData,
  GameStoreState,
  GameType,
  JoinGameData,
  SearchGame,
} from "@/types";

export const useGameStore = create<GameStoreState>((set, get) => {
  return {
    gameType: GameType.PUBLIC,
    gameName: "",
    notes: "",
    userGames: [],
    pages: 1,
    currentPage: 1,
    total: 1,
    setGameName: (name: string) => set({ gameName: name }),
    setGameType: (type: GameType) => set({ gameType: type }),
    setNotes: (notes: string) => set({ notes }),

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

      await callCreateGameApi(payload);
    },

    listGames: async (filters?: SearchGame) => {
      const result = await callListGameApi(filters);
      if (result) {
        set({
          userGames: result.games,
          currentPage: result.page,
          pages: Math.ceil(result.total / result.size),
          total: result.total,
        });
      }
    },

    joinGame: async (data: JoinGameData) => {
      await callJoinGameApi(data);
    },
  };
});
