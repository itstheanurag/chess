import { PieceType, Piece, Game, GameStateData } from "@/types/chess";
import { Chess, PieceSymbol } from "chess.js";

export const getInitialBoard = (): (Piece | null)[][] => {
  const chess = new Chess();
  const rawBoard = chess.board();
  return rawBoard.map((row) =>
    row.map((piece) =>
      piece
        ? {
            type: convertPieceType(piece.type),
            color: piece.color,
          }
        : null
    )
  );
};

export function normalizeBoard(
  boardData: ReturnType<Chess["board"]>
): (Piece | null)[][] {
  return boardData.map((row) =>
    row.map((p) =>
      p ? { type: convertPieceType(p.type), color: p.color as "w" | "b" } : null
    )
  );
}

const convertPieceType = (symbol: PieceSymbol): PieceType => {
  switch (symbol) {
    case "p":
      return "pawn";
    case "r":
      return "rook";
    case "n":
      return "knight";
    case "b":
      return "bishop";
    case "q":
      return "queen";
    case "k":
      return "king";
    default:
      throw new Error(`Unknown piece type: ${symbol}`);
  }
};

export function mapBackendGameToGameState(game: Game): GameStateData {
  const chess = new Chess(game.fen);

  return {
    fen: game.fen,
    board: normalizeBoard(chess.board()),
    turn: chess.turn() as "w" | "b",
    status: game.status,
    result: game.result,
    moves: game.moves.map((m) => ({
      id: m.id,
      fromSquare: m.fromSquare,
      toSquare: m.toSquare,
      promotion: m.promotion,
      fen: m.fen,
      playerId: m.playerId,
      createdAt: m.createdAt,
    })),
    spectators: game.spectators,
    whitePlayer: game.whitePlayer,
    blackPlayer: game.blackPlayer,
    type: game.type,
  };
}
