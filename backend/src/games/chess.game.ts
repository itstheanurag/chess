import { Chess, Move, Square, Piece, PieceSymbol, Color } from 'chess.js';

type GameStatus = 'active' | 'checkmate' | 'draw' | 'stalemate' | 'threefold' | 'insufficient' | '50move';

interface GameMoveResult extends Move {
  success: boolean;
  error?: string;
  fen: string;
  pgn: string;
  status: GameStatus;
  turn: Color;
  inCheck: boolean;
  inCheckmate: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  insufficientMaterial: boolean;
  inThreefoldRepetition: boolean;
  // Add missing methods from Move interface
  isCapture(): boolean;
  isPromotion(): boolean;
  isEnPassant(): boolean;
  isKingsideCastle(): boolean;
  isQueensideCastle(): boolean;
  isBigPawn(): boolean;
}

interface GameState {
  fen: string;
  pgn: string;
  turn: Color;
  gameOver: boolean;
  status: GameStatus;
  board: ({
    square: string;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  inCheck: boolean;
  inCheckmate: boolean;
  inDraw: boolean;
  inStalemate: boolean;
  insufficientMaterial: boolean;
  inThreefoldRepetition: boolean;
  moveHistory: Move[];
  whitePlayer?: string;
  blackPlayer?: string;
  spectators: string[];
}

export class ChessGame extends Chess {
  private gameHistory: string[] = [];
  private players: { white?: string; black?: string } = {};
  private spectators: Set<string> = new Set();

  constructor(fen?: string) {
    super(fen);
    if (fen) {
      this.gameHistory.push(fen);
    } else {
      this.gameHistory.push(this.fen());
    }
  }

  /**
   * Join a player to the game
   * @param playerName - Name of the player
   * @returns The color assigned to the player
   */
  public joinPlayer(playerName: string): Color {
    if (!this.players.white) {
      this.players.white = playerName;
      return 'w';
    } else if (!this.players.black) {
      this.players.black = playerName;
      return 'b';
    }
    throw new Error('Game is full');
  }

  /**
   * Add a spectator to the game
   * @param spectatorId - ID of the spectator
   */
  public addSpectator(spectatorId: string): void {
    this.spectators.add(spectatorId);
  }

  /**
   * Remove a player or spectator from the game
   * @param playerName - Name of the player or spectator ID
   */
  public removePlayer(playerName: string): void {
    if (this.players.white === playerName) {
      delete this.players.white;
    } else if (this.players.black === playerName) {
      delete this.players.black;
    } else {
      this.spectators.delete(playerName);
    }
  }

  /**
   * Check if the game is empty (no players or spectators)
   */
  public isEmpty(): boolean {
    return !this.players.white && !this.players.black && this.spectators.size === 0;
  }

  /**
   * Get the current game state
   */
  public getState(): GameState {
    return {
      fen: this.fen(),
      pgn: this.pgn(),
      turn: this.turn(),
      gameOver: this.isGameOver(),
      status: this.getGameStatus(),
      board: this.board(),
      inCheck: this.isCheck(),
      inCheckmate: this.isCheckmate(),
      inDraw: this.isDraw(),
      inStalemate: this.isStalemate(),
      insufficientMaterial: this.isInsufficientMaterial(),
      inThreefoldRepetition: this.isThreefoldRepetition(),
      moveHistory: this.history({ verbose: true }),
      whitePlayer: this.players.white,
      blackPlayer: this.players.black,
      spectators: Array.from(this.spectators)
    };
  }

  /**
   * Get the current game status
   */
  public getStatus(): GameStatus {
    if (this.isCheckmate()) return 'checkmate';
    if (this.isDraw()) {
      if (this.isInsufficientMaterial()) return 'insufficient';
      if (this.isThreefoldRepetition()) return 'threefold';
      if (this.isStalemate()) return 'stalemate';
      return 'draw';
    }
    return 'active';
  }

  /**
   * Make a move on the board
   * @param move - Move in SAN or UCI format
   * @returns Object containing move result and game state
   */
  public makeMove(move: string | { from: string; to: string; promotion?: string }): GameMoveResult {
    try {
      const result = super.move(move);
      this.gameHistory.push(this.fen());
      
      // Create a new object that includes all Move methods and our custom properties
      const moveResult: GameMoveResult = {
        ...result,
        success: true,
        fen: this.fen(),
        pgn: this.pgn(),
        status: this.getGameStatus(),
        turn: this.turn(),
        inCheck: this.isCheck(),
        inCheckmate: this.isCheckmate(),
        inDraw: this.isDraw(),
        inStalemate: this.isStalemate(),
        insufficientMaterial: this.isInsufficientMaterial(),
        inThreefoldRepetition: this.isThreefoldRepetition(),
        // Bind all methods from the result
        isCapture: () => result.isCapture(),
        isPromotion: () => result.isPromotion(),
        isEnPassant: () => result.isEnPassant(),
        isKingsideCastle: () => result.isKingsideCastle(),
        isQueensideCastle: () => result.isQueensideCastle(),
        isBigPawn: () => result.isBigPawn()
      };
      
      return moveResult;
    } catch (error) {
      // For invalid moves, we'll create a minimal valid Move object
      const dummyMove = {
        color: (this.turn() === 'w' ? 'b' : 'w') as Color,
        from: 'a1' as Square,
        to: 'a1' as Square,
        piece: 'p' as PieceSymbol,
        san: '',
        lan: '',
        before: this.fen(),
        after: this.fen(),
        flags: '',
        captured: undefined,
        promotion: undefined,
        isCapture: () => false,
        isPromotion: () => false,
        isEnPassant: () => false,
        isKingsideCastle: () => false,
        isQueensideCastle: () => false,
        isBigPawn: () => false,
      };
      
      return {
        ...dummyMove,
        success: false,
        error: error instanceof Error ? error.message : 'Invalid move',
        fen: this.fen(),
        pgn: this.pgn(),
        status: this.getGameStatus(),
        turn: this.turn(),
        inCheck: this.isCheck(),
        inCheckmate: this.isCheckmate(),
        inDraw: this.isDraw(),
        inStalemate: this.isStalemate(),
        insufficientMaterial: this.isInsufficientMaterial(),
        inThreefoldRepetition: this.isThreefoldRepetition(),
      };
    }
  }

  /**
   * Get the current board state
   * @returns 2D array representing the board
   */
  public getBoard(): ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][] {
    return this.board();
  }

  /**
   * Get all valid moves for a piece at a given square
   * @param square - The square to get moves for (e.g., 'e2', 'g8')
   * @returns Array of valid move objects
   */
  public getValidMoves(square?: Square): Move[] {
    return this.moves({ square, verbose: true }) as Move[];
  }

  /**
   * Get the current game status
   * @returns Current game status
   */
  public getGameStatus(): GameStatus {
    if (this.isCheckmate()) return 'checkmate';
    if (this.isDraw()) {
      if (this.isStalemate()) return 'stalemate';
      if (this.isThreefoldRepetition()) return 'threefold';
      if (this.isInsufficientMaterial()) return 'insufficient';
      if (this.isDraw()) return 'draw';
    }
    return 'active';
  }

  /**
   * Get the current FEN string
   */
  public getFen(): string {
    return this.fen();
  }

  /**
   * Get the current PGN string
   */
  public getPgn(): string {
    return this.pgn();
  }

  /**
   * Get the current player's turn
   */
  public getTurn(): Color {
    return this.turn();
  }

  /**
   * Get the game history as an array of FEN strings
   */
  public getMoveHistory(): string[] {
    return [...this.gameHistory];
  }

  /**
   * Check if the current position is a check
   */
  public isInCheck(): boolean {
    return this.isCheck();
  }

  /**
   * Check if the current position is a checkmate
   */
  public isInCheckmate(): boolean {
    return this.isCheckmate();
  }

  /**
   * Check if the current position is a draw
   */
  public isGameDrawn(): boolean {
    return this.isDraw();
  }

  /**
   * Reset the game to the initial position
   */
  public resetGame(): void {
    this.reset();
    this.gameHistory = [this.fen()];
  }

  /**
   * Load a game from a FEN string
   * @param fen - The FEN string to load
   */
  public loadFen(fen: string): void {
    this.load(fen);
    this.gameHistory = [fen];
  }

  /**
   * Get the piece at a specific square
   * @param square - The square to check (e.g., 'e2', 'g8')
   * @returns The piece at the square or null if empty
   */
  public getPieceAt(square: Square): Piece | null {
    try {
      return this.get(square) || null;
    } catch {
      return null;
    }
  }
}
