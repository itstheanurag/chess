export enum GameEvents {
  GAME_STATE = 'game_state',
  MAKE_MOVE = 'make_move',
  PLAYER_JOINED = 'player_joined',
  SPECTATOR_JOINED = 'spectator_joined',
  PLAYER_LEFT = 'player_left',
  SPECTATOR_LEFT = 'spectator_left',
  GAME_END = 'game_end',
  ERROR = 'error',
  DRAW = 'draw',
  CHECK_MATE = 'checkmate',
  RESIGN = 'resign'
}

export enum GameType {
  PRIVATE = 'private',
  PUBLIC = 'public'
}

export enum GameRequestStatusEnum {
  ACCEPT = "accept",
  PENDING = 'pending',
  REJECT = 'reject'
}

export enum GameStatus {
  WAITING = 'waiting',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed'
}