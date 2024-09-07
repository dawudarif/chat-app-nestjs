import { OnModuleInit, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { Server } from 'socket.io';
import { CookieGuard } from '../auth/cookie.guard';

@WebSocketGateway({
  cors: { origin: '*', withCredentials: true },
})
export class ChatGateway implements OnModuleInit {
  @WebSocketServer()
  server: Server;

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log('socket id' + socket.id);
      console.log('socket.connected' + socket.connected);
    });
  }

  @UseGuards(CookieGuard)
  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any): Observable<WsResponse<any>> {
    console.log('message', data);
    return of({
      event: 'message',
      data: { 'MESSAGE RETURNED FROM SERVER': data },
    });
  }

  @UseGuards(CookieGuard)
  @SubscribeMessage('event')
  handleEvent(@MessageBody() data: any): Observable<WsResponse<any>> {
    console.log('event', data);
    return of({ event: 'event', data: 'EVENT RETURNED FROM SERVER' });
  }
}
