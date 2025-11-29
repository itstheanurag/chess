import { Move, Square } from "chess.js";
import { AuthUser } from "./auth";

export type PieceType =
  | "pawn"
  | "rook"
  | "knight"
  | "bishop"
  | "queen"
  | "king";

export type PieceColor = "w" | "b" | null;

export interface Piece {
  type: PieceType;
  color: PieceColor;
}

export type ChessBoardProps = {
  board: (Piece | null)[][];
};

export interface PieceProps {
  type: PieceType;
  color: PieceColor;
}

export interface SquareProps {
  piece: PieceProps | null;
  isLight: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  highlight?: boolean;
}

export interface GameStateData {
  fen: string;
  board: (Piece | null)[][];
  turn?: PieceColor;
  [key: string]: unknown;
}

export interface GameSpectator {
  id: string;
  gameId: bigint;
  spectatorId: bigint;
  joinedAt: Date;
  game: Game;
  spectator: AuthUser;
}

export interface GameMove {
  id: string;
  gameId: bigint;
  moveNumber: number;
  playerId?: bigint | null;
  fromSquare: string;
  toSquare: string;
  promotion?: string | null;
  fen: string;
  createdAt: Date;
  game: Game;
  player?: AuthUser | null;
}

export interface Game {
  id: string;
  name?: string;
  notes?: string;
  whitePlayerId?: bigint | null;
  blackPlayerId?: bigint | null;
  status: string;
  result?: string | null;
  type: GameType;
  passcode?: string | null;
  isVisible: boolean;
  fen: string;
  startedAt?: Date | null;
  endedAt?: Date | null;
  createdAt: Date;
  whitePlayer?: AuthUser | null;
  blackPlayer?: AuthUser | null;
  moves: GameMove[];
  spectators: GameSpectator[];
}

export interface GameStoreState {
  gameName: string;
  gameType: GameType;
  notes: string;
  userGames: Game[];
  pages: number;
  currentPage: number;
  total: number;

  joinGame: (data: JoinGameData) => Promise<boolean>;
  createGame: (data?: { passcode?: string; blackPlayerId?: string }) => void;
  listGames: (filters?: SearchGame) => Promise<void>;
  setGameName: (name: string) => void;
  setGameType: (type: GameType) => void;
  setNotes: (notes: string) => void;
  findOne: (id: string) => Promise<Game | null>;
}

export interface GameSocketState {
  gameState: GameStateData | null;
  selected: Square | null;
  validMoves: Move[];
  isJoined: boolean;
  room: string | null;
  playerColor: PieceColor | null;
  connect: () => void;
  selectPiece: (square: Square) => void;
  makeMove: (move: Move) => void;
  clearSelection: () => void;
  resetGame: () => void;
  disconnect: () => void;
  joinGame: (data: {
    room: string;
    playerName: string;
    isSpectator?: boolean;
  }) => void;
}

export enum GameType {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
}

export type GameStatus =
  | "active"
  | "checkmate"
  | "draw"
  | "stalemate"
  | "threefold"
  | "insufficient"
  | "50move";

export interface Player {
  id: string;
  name: string;
  color?: "w" | "b";
}

export interface CreateGameData {
  type: GameType;
  gameName: string;
  note: string;
  passcode?: string;
  blackPlayerId?: string;
}

export interface JoinGameData {
  gameId: string;
  passcode?: string;
  isSpectator?: boolean;
}

export interface SearchGame {
  q?: string;
  type?: GameType | null;
  status?: GameStatusEnum | null;
  page?: number;
  size: number;
}

export enum GameStatusEnum {
  WAITING = "waiting",
  IN_PROGRESS = "in_progress",
  FINISHED = "finished",
  CANCELLED = "cancelled",
  RESIGNED = "resigned",
  DRAW = "draw",
  CHECKMATE = "checkmate",
  THREE_FOLD = "threefold",
  STALEMATE = "stalemate;",
}

export enum ChessResult {
  WHITE_WIN = "white_win",
  BLACK_WIN = "black_win",
  DRAW = "draw",
  STALEMATE = "stalemate",
  RESIGNATION = "resignation",
  TIMEOUT = "timeout",
}

export interface GameStatsProps {
  stats: Stats | null;
  loading?: boolean;
}

export interface Stats {
  total: number;
  wins: number;
  losses: number;
  draws: number;
}
