import { Server } from 'socket.io';
import { initSocketHandlers } from './socket.handlers';

let io: Server;

export function initSocketIO(httpServer: any): Server {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  initSocketHandlers(io);
  return io;
}

export { io };
