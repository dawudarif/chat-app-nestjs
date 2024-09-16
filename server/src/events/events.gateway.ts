import { OnModuleInit } from '@nestjs/common';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000/',
    credentials: true,
  },
})
export class MainGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('Socket connected with ID:', socket.id);
      console.log('Socket connected status:', socket.connected);

      socket.on('disconnect', () => {
        console.log('Socket disconnected with ID:', socket.id);
      });
    });
  }
}
