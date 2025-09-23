import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectSockets } from "@/sockets";
import { Chess, Square, Move } from "chess.js";

interface GameContextValue {
  gameState: any;
  selected: Square | null;
  validMoves: Move[];
  joinGame: (room: string, playerName: string, isSpectator?: boolean) => void;
  makeMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  selectPiece: (square: Square) => void;
}

const SocketContext = createContext<GameContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useMemo(() => connectSockets("your-auth-token"), []);
  const [gameState, setGameState] = useState<any>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const chess = useMemo(() => new Chess(), []);
  
  useEffect(() => {
    const { game } = sockets;

    game.on("moveMade", ({ gameState }) => {
      setGameState(gameState);
      chess.load(gameState.fen); // sync local chess.js
    });

    game.on("gameReset", ({ gameState }) => {
      setGameState(gameState);
      chess.reset();
    });

    game.on("gameJoined", ({ gameState }) => {
      setGameState(gameState);
      chess.load(gameState.fen);
    });

    return () => {
      game.off("moveMade");
      game.off("gameReset");
      game.off("gameJoined");
    };
  }, [sockets, chess]);

  const joinGame = (room: string, playerName: string, isSpectator = false) => {
    sockets.game.emit("joinGame", { room, playerName, isSpectator });
  };

  const selectPiece = (square: Square) => {
    // calculate valid moves client-side
    const moves = chess.moves({ square, verbose: true }) as Move[];
    setSelected(square);
    setValidMoves(moves);
  };

  const makeMove = (move: { from: Square; to: Square; promotion?: string }) => {
    // Client-side validation before emitting
    const isValid = validMoves.some((m) => m.to === move.to);
    if (!isValid) return console.warn("Invalid move locally");
    sockets.game.emit("makeMove", { room: gameState?.room, move });
  };

  return (
    <SocketContext.Provider
      value={{
        gameState,
        selected,
        validMoves,
        joinGame,
        makeMove,
        selectPiece,
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
