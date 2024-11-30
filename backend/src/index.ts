import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleSocketConnections } from './socket/socket';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import * as Routers from './routes';
import { setupSwagger } from './swagger/swagger';


const app = express();
const PORT = 3000;
// Create HTTP server and integrate with Socket.IO
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

setupSwagger(app);
app.use(express.json());

Object.values(Routers).forEach(router => {
  app.use('/', router);  // Mount each router under the base path `/`
});

handleSocketConnections(io)
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
