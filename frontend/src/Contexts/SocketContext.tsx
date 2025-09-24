import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectSockets } from "@/lib/sockets";
import { Chess, Square, Move } from "chess.js";
import { PieceColor } from "@/types/chess";

interface GameContextValue {
  gameState: any;
  selected: Square | null;
  validMoves: Move[];
  isJoined: boolean;
  joinGame: (room: string, playerName: string, isSpectator?: boolean) => void;
  makeMove: (
    playerName: string,
    move: { from: Square; to: Square; promotion?: string }
  ) => void;
  selectPiece: (square: Square) => void;
  clearSelection: () => void;
  room: string | null;
  playerColor: PieceColor;
}

const SocketContext = createContext<GameContextValue | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const sockets = useMemo(() => connectSockets("your-auth-token"), []);
  const [gameState, setGameState] = useState<any>(null);
  const [selected, setSelected] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [isJoined, setIsJoined] = useState(false);
  const chess = useMemo(() => new Chess(), []);
  const [room, setRoom] = useState<string | null>(null);
  const [playerColor, setPlayerColor] = useState<PieceColor>(null);

  useEffect(() => {
    const { game } = sockets;

    game.on("gameJoined", ({ gameState, playerColor, roomId }) => {
      setGameState(gameState);
      chess.load(gameState.fen);
      setRoom(roomId);
      setPlayerColor(playerColor);
      setIsJoined(true);
    });

    game.on("moveMade", ({ gameState }) => {
      setGameState(gameState);
      chess.load(gameState.fen);
    });

    game.on("gameReset", ({ gameState }) => {
      setGameState(gameState);
      chess.reset();
      setIsJoined(false);
      setRoom(null);
      setPlayerColor(null);
    });

    game.on("disconnect", () => {
      setIsJoined(false);
      setRoom(null);
      setPlayerColor(null);
    });

    return () => {
      game.off("gameJoined");
      game.off("moveMade");
      game.off("gameReset");
      game.off("disconnect");
    };
  }, [sockets, chess]);

  const joinGame = (
    room: string,
    playerName: string,
    isSpectator: boolean = false
  ) => {
    sockets.game.emit("joinGame", { room, playerName, isSpectator });
  };

  const selectPiece = (square: Square) => {
    const moves = chess.moves({ square, verbose: true }) as Move[];
    setSelected(square);
    setValidMoves(moves);
  };

  const makeMove = (
    playerName: string,
    move: { from: Square; to: Square; promotion?: string }
  ) => {
    const isValid = validMoves.some((m) => m.to === move.to);
    if (!isValid) return console.warn("Invalid move locally");
    sockets.game.emit("makeMove", { room: room, move, playerName });
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
        isJoined,
        joinGame,
        makeMove,
        selectPiece,
        clearSelection,
        room,
        playerColor,
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
