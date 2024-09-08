import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
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
import { Request } from 'express';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';

@WebSocketGateway({
  cors: { origin: '*', withCredentials: true },
})
export class ChatGateway implements OnModuleInit {
  constructor(private chatService: ChatService) {}

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
  async handleMessage(@MessageBody() data: MessageDTO, @Req() req: Request) {
    const messageHandler = await this.chatService.handleMessage(req, {
      conversationId: data.conversationId,
      messageBody: data.messageBody,
    });

    return messageHandler;
  }
}
