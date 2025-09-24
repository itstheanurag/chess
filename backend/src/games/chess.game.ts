import { Chess, Move, Square, Color } from "chess.js";
import { GameState, GameMoveResult, GameStatus } from "@/types";

export const activeGames: Record<string, ChessGame> = {};

export class ChessGame extends Chess {
  private players: { white?: string; black?: string } = {};
  private spectators: Set<string> = new Set();

  constructor(fen?: string) {
    super(fen);
  }

  joinPlayer(playerName: string): Color {
    if (!this.players.white) return (this.players.white = playerName), "w";
    if (!this.players.black) return (this.players.black = playerName), "b";
    throw new Error("Game is full");
  }

  addSpectator(id: string) {
    this.spectators.add(id);
  }

  removePlayer(playerName: string) {
    if (this.players.white === playerName) delete this.players.white;
    else if (this.players.black === playerName) delete this.players.black;
    else this.spectators.delete(playerName);
  }

  isFull(): boolean {
    return !!this.players.white && !!this.players.black;
  }

  isEmpty(): boolean {
    return (
      !this.players.white && !this.players.black && this.spectators.size === 0
    );
  }

  makeMove(
    move: string | { from: string; to: string; promotion?: string }
  ): GameMoveResult {
    const result = this.move(move as any);

    if (!result) {
      return {
        success: false,
        error: "Invalid move",
        fen: this.fen(),
        pgn: this.pgn(),
        turn: this.turn(),
        status: this.getGameStatus(),
      };
    }

    return {
      success: true,
      fen: this.fen(),
      pgn: this.pgn(),
      turn: this.turn(),
      status: this.getGameStatus(),
    };
  }

  getState(): GameState {
    return {
      fen: this.fen(),
      pgn: this.pgn(),
      turn: this.turn(),
      board: this.board(),
      status: this.getGameStatus(),
      whitePlayer: this.players.white,
      blackPlayer: this.players.black,
      spectators: Array.from(this.spectators),
    };
  }

  getValidMoves(square: Square): Move[] {
    return this.moves({ square, verbose: true }) as Move[];
  }

  resetGame(): void {
    this.reset();
  }

  private getGameStatus(): GameStatus {
    if (this.isCheckmate()) return "checkmate";
    if (this.isDraw()) return "draw";
    return "active";
  }
}
