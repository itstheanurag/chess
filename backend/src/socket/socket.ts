import { Server, Socket } from 'socket.io';
import { GameEvents, SocketEventsEnum } from '../enums/';
import { verifyAccessToken } from 'src/utils';

export const handleSocketConnections = (io: Server) => {
  io.on(SocketEventsEnum.CONNECTION, async (userSocket: Socket) => {
    const authHeader = userSocket.handshake.headers?.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];

      try {
        const userData = verifyAccessToken(token);
        userSocket.data.user = userData;
        console.log('Authorized user connected:', userData);
        handleAuthorizedSockets(userSocket);
      } catch (error: any) {
        console.error('Token verification failed:', error.message);
        handleUnauthorizedSockets(userSocket); 
        return;
      }
    } else {
      handleUnauthorizedSockets(userSocket); 
    }
  });
};

export const handleAuthorizedSockets = (userSocket: Socket) => {
  userSocket.on(GameEvents.JOIN_ROOM, (data) => {
    console.log(`Authorized user ${userSocket.data.user?.id} joined room: ${data.roomId}`);
  });

};

export const handleUnauthorizedSockets = (unauthorizedUserSocket: Socket) => {
  console.log('Unauthorized user connected');
  unauthorizedUserSocket.disconnect(); 
};
