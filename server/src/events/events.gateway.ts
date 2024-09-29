import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { CookieGuard } from '../auth/guard/cookie.guard';

@UseGuards(CookieGuard)
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

  @UseGuards(CookieGuard)
  @SubscribeMessage('join')
  async handleMessage(@Req() req: any, @ConnectedSocket() client: Socket) {
    client.join(req.user?.userId);
    console.log(`User ${req.user.name} joined room: ${req.user.userId}`);
  }
}
