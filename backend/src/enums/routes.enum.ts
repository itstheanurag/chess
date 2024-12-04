export enum AuthRoutesEnums {
    REGISTER = '/api/v1/auth/register',
    LOGIN = '/api/v1/auth/login',
    REFRESH_TOKEN_LOGIN = '/api/v1/auth/refresh-login'
}

export enum GameRoutesEnums {
    GET_ALL_GAMES = '/api/v1/games',               
    CREATE_GAME = '/api/v1/games',          
    GET_GAME_DETAILS = '/api/v1/games/:gameId',    
    JOIN_GAME = '/api/v1/games/:gameId/join',    
}
