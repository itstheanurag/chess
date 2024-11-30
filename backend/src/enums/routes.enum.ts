export enum AuthRoutesEnums {
    REGISTER = '/api/v1/auth/register',
    LOGIN = '/api/v1/auth/login',
    REFRESH_TOKEN_LOGIN = '/api/v1/auth/refresh-login'
}

export enum GameRoutesEnums {
    GET_ALL_ROOMS = '/api/v1/games',               
    CREATE_ROOM = '/api/v1/games/create',          
    GET_ROOM_DETAILS = '/api/v1/games/:roomId',    
    JOIN_ROOM = '/api/v1/games/:gameId/join',    
}
