import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { handleSocketConnections } from './socket/socket';
import * as Routers from './routes';
import { setupSwagger } from './swagger/swagger';
import cors from 'cors';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';

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


app.use(cors({
  origin: '*',  // Make sure the frontend URL is correct
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

setupSwagger(app);
app.use(express.json());

Object.values(Routers).forEach(router => {
  app.use('/', router);  // Mount each router under the base path `/`
});

handleSocketConnections(io)
httpServer.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// db configuration
export const prisma = new PrismaClient();
// console.log(prisma)
