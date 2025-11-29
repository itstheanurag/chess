import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  useGameStore,
  useUIStore,
  useGameSocketStore,
  useAuthStore,
} from "@/stores";
import ChessBoard from "./ChessBoard";
import ChatWindow from "../chat/Chat";
import GameInfo from "./GameInfo";
import { motion } from "framer-motion";

const ChessGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { findOne } = useGameStore();
  const { setCollapsed } = useUIStore();
  const { connect, joinGame, disconnect } = useGameSocketStore();
  const { authUser } = useAuthStore();

  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-collapse sidebar to give maximum space to the board
    setCollapsed(true);
    connect();

    return () => {
      disconnect();
    };
  }, [setCollapsed, connect, disconnect]);

  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      try {
        const g = await findOne(gameId);
        setGame(g);
      } catch (error) {
        console.error("Failed to fetch game", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId, findOne]);

  useEffect(() => {
    if (game && authUser && gameId) {
      const isPlayer =
        game.whitePlayer?.id === authUser.id ||
        game.blackPlayer?.id === authUser.id;

      joinGame({
        room: gameId,
        playerName: authUser.username,
        isSpectator: !isPlayer,
      });
    }
  }, [game, authUser, gameId, joinGame]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-100px)] text-muted-foreground">
        Game not found
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Floating Game Info - Top Right */}
      <div className="absolute top-5 right-5 z-50">
        <GameInfo game={game} />
      </div>

      {/* Main Board Area - Centered */}
      <div className="w-full h-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-h-full aspect-square rounded-lg overflow-hidden border-8 border-card bg-neutral-600"
          style={{ maxWidth: "calc(100vh - 140px)" }}
        >
          <ChessBoard board={game.board} />
        </motion.div>
      </div>

      {/* Floating Chat Bubble - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-50">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChessGamePage;
