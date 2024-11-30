import { Server, Socket } from 'socket.io';
import { GameEvents, SocketEventsEnum } from '../enums/';

export const handleSocketConnections = (io: Server) => {
  
  io.on(SocketEventsEnum.CONNECTION, (userSocket: Socket) => {
    userSocket.on(GameEvents.JOIN_ROOM, (data) => {


    })
  })
}