import { Chess } from 'chess.js';

interface GameStatus {
  winner?: 'white' | 'black' | 'draw';
  reason?: string;
}

export class GameRoom {
  private players: string[];
  private spectators: string[];
  private game: Chess;
  private currentPlayerTurn: 'white' | 'black';

  constructor() {
    this.players = [];
    this.spectators = [];
    this.game = new Chess();
    this.currentPlayerTurn = 'white';
  }

  joinAsPlayer(playerId: string): boolean {
    if (this.players.includes(playerId)) {
      return false;
    }

    if (this.players.length < 2) {
      this.players.push(playerId);
      return true;
    }
    return false; 
  }

  joinAsSpectator(spectatorId: string): void {
    if (!this.spectators.includes(spectatorId)) {
      this.spectators.push(spectatorId);
    }
  }

  makeMove(move: string, playerId: string): boolean {
    if (!this.players.includes(playerId)) {
      throw new Error('Only players can make moves');
    }

    const playerIndex = this.players.indexOf(playerId);
    const expectedColor = playerIndex === 0 ? 'white' : 'black';
    
    if (this.game.turn() !== expectedColor[0]) {
      throw new Error('Not your turn');
    }

    try {
      const moveResult = this.game.move(move);
      
      if (moveResult) {
        this.currentPlayerTurn = this.game.turn() === 'w' ? 'white' : 'black';
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  }

  getGameState(): string {
    return this.game.fen();
  }

  getCurrentTurn(): 'white' | 'black' {
    return this.currentPlayerTurn;
  }

  getGameStatus(): GameStatus | null {
    if (this.game.isCheckmate()) {
      return {
        winner: this.game.turn() === 'w' ? 'black' : 'white',
        reason: 'Checkmate'
      };
    }

    if (this.game.isDraw()) {
      return {
        winner: 'draw',
        reason: 'Draw'
      };
    }

    return null;
  }

  removePlayer(playerId: string): void {
    this.players = this.players.filter((id) => id !== playerId);
  }

  removeSpectator(spectatorId: string): void {
    this.spectators = this.spectators.filter((id) => id !== spectatorId);
  }

  isPlayerInRoom(playerId: string): boolean {
    return this.players.includes(playerId);
  }

  isSpectatorInRoom(spectatorId: string): boolean {
    return this.spectators.includes(spectatorId);
  }

  getPlayers(): string[] {
    return this.players;
  }

  getSpectators(): string[] {
    return this.spectators;
  }
}