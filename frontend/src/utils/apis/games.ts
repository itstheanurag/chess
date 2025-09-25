import api from "@/lib/axios";
import { CreateGameData, Game, JoinGameData, SearchGame } from "@/types";

export const listGames = async (
  filters?: SearchGame
): Promise<Game[] | null> => {
  try {
    const response = await api.get("/games/list", { params: filters });
    return response.data.data ?? [];
  } catch (error) {
    console.error("Error listing games:", error);
    return null;
  }
};


export const createGame = async (
  data: CreateGameData
): Promise<Game | null> => {
  try {
    const response = await api.post("/games", JSON.stringify(data));
    return response.data.data ?? null;
  } catch (error) {
    console.error("Error creating game:", error);
    return null;
  }
};


export const joinGame = async (data: JoinGameData): Promise<Game | null> => {
  try {
    const response = await api.post(
      `/games/${data.gameId}/join`,
      JSON.stringify({ passcode: data.passcode })
    );
    return response.data.data ?? null;
  } catch (error) {
    console.error("Error joining game:", error);
    return null;
  }
};


export const getGame = async (gameId: string): Promise<Game | null> => {
  try {
    const response = await api.get(`/games/${gameId}`);
    return response.data.data ?? null;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
};
