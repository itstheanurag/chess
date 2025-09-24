import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectSockets } from "@/lib/sockets";
import { Chess, Square, Move } from "chess.js";

interface GameContextValue {
  gameState: any;
  selected: Square | null;
  validMoves: Move[];
  isJoined: boolean; // <── added
  joinGame: (room: string, playerName: string, isSpectator?: boolean) => void;
  makeMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  selectPiece: (square: Square) => void;
  clearSelection: () => void;
}

const SocketContext = createContext<GameContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useMemo(() => connectSockets("your-auth-token"), []);
  const [gameState, setGameState] = useState<any>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [isJoined, setIsJoined] = useState(false); // <── track join status
  const chess = useMemo(() => new Chess(), []);

  useEffect(() => {
    const { game } = sockets;

    game.on("moveMade", ({ gameState }) => {
      setGameState(gameState);
      chess.load(gameState.fen);
    });

    game.on("gameReset", ({ gameState }) => {
      setGameState(gameState);
      chess.reset();
      setIsJoined(false); // reset join state on reset if needed
    });

    game.on("gameJoined", ({ gameState }) => {
      setGameState(gameState);
      chess.load(gameState.fen);
      setIsJoined(true); // <── mark as joined
    });

    // Optional: handle disconnects
    game.on("disconnect", () => {
      setIsJoined(false);
    });

    return () => {
      game.off("moveMade");
      game.off("gameReset");
      game.off("gameJoined");
      game.off("disconnect");
    };
  }, [sockets, chess]);

  const joinGame = (room: string, playerName: string, isSpectator = false) => {
    sockets.game.emit("joinGame", { room, playerName, isSpectator });
  };

  const selectPiece = (square: Square) => {
    const moves = chess.moves({ square, verbose: true }) as Move[];
    setSelected(square);
    setValidMoves(moves);
  };

    const makeMove = (move: { from: Square; to: Square; promotion?: string }) => {
      const isValid = validMoves.some((m) => m.to === move.to);
      if (!isValid) return console.warn("Invalid move locally");
      sockets.game.emit("makeMove", { room: gameState?.room, move });
    };

  const clearSelection = () => {
    setSelected(null);
    setValidMoves([]);
  };

  return (
    <SocketContext.Provider
      value={{
        gameState,
        selected,
        validMoves,
        isJoined, // <── expose
        joinGame,
        makeMove,
        selectPiece,
        clearSelection,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSockets = () => {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSockets must be used within a SocketProvider");
  return ctx;
};
