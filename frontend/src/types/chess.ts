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
  id: bigint;
  gameId: bigint;
  spectatorId: bigint;
  joinedAt: Date;
  game: Game;
  spectator: AuthUser;
}

export interface GameMove {
  id: bigint;
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
  id: bigint;
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

export interface GameContext {
  gameState: GameStateData | null;
  selected: Square | null;
  validMoves: Move[];
  isJoined: boolean;
  room: string | null;
  playerColor: PieceColor | null;
  playerName: string;
  gameName: string;
  gameType: string;

  connect: () => void;
  disconnect: () => void;
  joinGame: (data: JoinGameData) => void;
  makeMove: (move: { from: Square; to: Square; promotion?: string }) => void;
  selectPiece: (square: Square) => void;
  clearSelection: () => void;
  resetGame: () => void;
  createGame: (data: CreateGameData) => void;
  listGames: (filters: SearchGame) => void;
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
  name: string;
  note: string;
}

export interface JoinGameData {
  gameId: string;
  passcode?: string;
  isSpectator?: boolean;
}

export interface SearchGame {
  type: GameType;
  status: GameStatus;
}
