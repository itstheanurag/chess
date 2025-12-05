import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
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
import { Flag } from "lucide-react";

const ChessGamePage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const { findOne } = useGameStore();
  const { setCollapsed } = useUIStore();
  const {
    connect,
    joinGame,
    disconnect,
    resignGame,
    gameState,
    isJoined,
    lastMove,
  } = useGameSocketStore();
  const { authUser } = useAuthStore();

  const navigate = useNavigate();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showResignModal, setShowResignModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  useEffect(() => {
    if (gameState) {
      setGame((prev: any) => {
        if (!prev) return null;
        return { ...prev, ...gameState };
      });
    }
  }, [gameState]);

  useEffect(() => {
    if (lastMove) {
      setGame((prev: any) => {
        if (!prev) return null;
        // Check if move already exists to prevent duplicates
        const lastPrevMove = prev.moves?.[prev.moves.length - 1];
        if (
          lastPrevMove &&
          lastPrevMove.san === lastMove.san &&
          lastPrevMove.to === lastMove.to
        ) {
          return prev;
        }

        return {
          ...prev,
          moves: [
            ...(prev.moves || []),
            { ...lastMove, fromSquare: lastMove.from, toSquare: lastMove.to },
          ],
        };
      });
    }
  }, [lastMove]);

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
    if (game && authUser && gameId && !isJoined) {
      const isPlayer =
        game.whitePlayer?.id === authUser.id ||
        game.blackPlayer?.id === authUser.id;

      joinGame({
        room: gameId,
        playerName: authUser.username,
        isSpectator: !isPlayer,
      });
    }
  }, [game, authUser, gameId, joinGame, isJoined]);

  useEffect(() => {
    if (game?.resignedBy || game?.result || game?.status === "checkmate") {
      setShowGameOverModal(true);
    }
  }, [game]);

  const handleResign = () => {
    setShowResignModal(true);
  };

  const confirmResign = () => {
    resignGame();
    setShowResignModal(false);
  };

  const isPlayer =
    authUser &&
    game &&
    (game.whitePlayer?.id === authUser.id ||
      game.blackPlayer?.id === authUser.id);

  const isOngoing =
    game?.status === "ONGOING" ||
    game?.status === "active" ||
    game?.status === "IN_PROGRESS";

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
          className="w-full max-h-full aspect-square rounded-lg overflow-hidden border-8 border-card"
          style={{ maxWidth: "calc(100vh - 200px)" }}
        >
          <ChessBoard board={game.board} />
        </motion.div>
      </div>

      {/* Resign Button - Bottom Left */}
      {isPlayer && isOngoing && (
        <button
          onClick={handleResign}
          className="absolute bottom-6 left-6 z-50 flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow-lg transition-all hover:scale-105 font-bold"
        >
          <Flag size={20} />
          <span>Resign</span>
        </button>
      )}

      {/* Floating Chat Bubble - Bottom Right */}
      <div className="absolute bottom-6 right-6 z-50">
        <ChatWindow />
      </div>

      {/* Resign Confirmation Modal */}
      {showResignModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold mb-2">Resign Game?</h3>
            <p className="text-muted-foreground mb-6">
              Are you sure you want to resign? This will count as a loss.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowResignModal(false)}
                className="px-4 py-2 rounded-lg hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmResign}
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-medium transition-colors"
              >
                Confirm Resign
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOverModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border p-6 rounded-xl shadow-xl max-w-sm w-full mx-4 animate-in fade-in zoom-in duration-200 text-center">
            <h3 className="text-2xl font-bold mb-2">Game Over</h3>
            <p className="text-muted-foreground mb-6">
              {game.resignedBy
                ? `${game.resignedBy === "w" ? "White" : "Black"} resigned.`
                : "Game finished."}
              <br />
              {game.winner
                ? `${game.winner === "w" ? "White" : "Black"} wins!`
                : ""}
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChessGamePage;
