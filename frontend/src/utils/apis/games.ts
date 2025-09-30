import api from "@/lib/axios";
import { CreateGameData, Game, JoinGameData, SearchGame, Stats } from "@/types";

export const callListGameApi = async (
  filters?: SearchGame
): Promise<{
  games: Game[];
  total: number;
  page: number;
  size: number;
} | null> => {
  try {
    const response = await api.get("/games/list", { params: filters });
    return response.data.data ?? [];
  } catch (error) {
    console.error("Error listing games:", error);
    return null;
  }
};

export const callCreateGameApi = async (
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

export const callJoinGameApi = async (
  data: JoinGameData
): Promise<Game | null> => {
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

export const callGetGameApi = async (gameId: string): Promise<Game | null> => {
  try {
    const response = await api.get(`/games/${gameId}`);
    return response.data.data ?? null;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
};

export const callGetAllGameStatsApi = async (): Promise<{
  stats: Stats;
} | null> => {
  try {
    const response = await api.get(`/games/stats`);
    return response.data?.data ?? null;
  } catch (error) {
    console.error("Error fetching game:", error);
    return null;
  }
};
