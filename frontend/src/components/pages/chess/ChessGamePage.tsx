import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useGameStore, useUIStore } from "@/stores";
import ChessBoard from "./ChessBoard";
import ChatWindow from "../chat/Chat";
import GameInfo from "./GameInfo";
import { motion } from "framer-motion";

const ChessGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { findOne } = useGameStore();
  const { setCollapsed } = useUIStore();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Auto-collapse sidebar to give maximum space to the board
    setCollapsed(true);
  }, [setCollapsed]);

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
    <div className="relative w-full h-full overflow-hidden flex flex-col lg:flex-row">
      {/* Main Board Area - Prioritized on Left */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-h-full overflow-hidden border-8 border-card rounded-lg p-4"
          style={{ maxWidth: "calc(100vh - 180px)" }}
        >
          <ChessBoard board={game.board} />
        </motion.div>
      </div>

      {/* Right Sidebar: Game Info & Moves */}
      <div className="w-full lg:w-[400px] bg-card border-l border-border/50 flex flex-col h-auto lg:h-full z-10 shadow-xl">
        <div className="p-4 lg:p-6 border-b border-border/50">
          <GameInfo game={game} />
        </div>

        {/* Move History */}
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto bg-secondary/5">
          <h3 className="font-bold mb-4 text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
            Move History
          </h3>
          <div className="text-center text-muted-foreground text-sm py-10 bg-background/50 rounded-xl border border-border/50 border-dashed">
            Moves will appear here
          </div>
        </div>
      </div>

      {/* Floating Chat Bubble - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-50">
        <ChatWindow />
      </div>
    </div>
  );
};

export default ChessGamePage;
