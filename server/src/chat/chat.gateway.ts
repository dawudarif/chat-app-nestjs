import { OnModuleInit, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { Observable, of } from 'rxjs';
import { Server, Socket } from 'socket.io';
import { CookieGuard } from '../auth/cookie.guard';
import { Request } from 'express';
import { ChatService } from './chat.service';
import { MessageDTO } from './dto/message.dto';

@WebSocketGateway({
  cors: { origin: '*', withCredentials: true },
})
export class ChatGateway {
  constructor(private chatService: ChatService) {}

  @UseGuards(CookieGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: MessageDTO,
    @Req() req: Request,
    @ConnectedSocket() client: Socket,
  ) {
    const messageHandler = await this.chatService.handleMessage(req, {
      conversationId: data.conversationId,
      messageBody: data.messageBody,
    });

    client.broadcast.to(data.conversationId).emit('message', messageHandler);
  }
}
