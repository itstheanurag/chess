export enum GameEvents {
  // Room Management
  JOIN_ROOM = 'join_room',
  CREATE_ROOM = 'create_room',
  ROOMS_LIST = 'rooms_list',
  REFRESH_ROOMS = 'refresh_rooms',
  ROOM_CREATED = 'room_created',

  // Game State
  GAME_STATE = 'game_state',
  MAKE_MOVE = 'make_move',

  // Player/Spectator Events
  PLAYER_JOINED = 'player_joined',
  SPECTATOR_JOINED = 'spectator_joined',
  PLAYER_LEFT = 'player_left',
  SPECTATOR_LEFT = 'spectator_left',

  // Game Lifecycle
  GAME_END = 'game_end',

  // Error Handling
  ERROR = 'error'
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