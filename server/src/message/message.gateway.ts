import { Req, Request, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CookieGuard } from '../auth/cookie.guard';
import { MessageService } from './message.service';
import { MessageBodyDTO } from './dto/message-body.dto';
import { Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000/',
    credentials: true,
  },
})
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}

  @UseGuards(CookieGuard)
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: MessageBodyDTO,
    @Req() req: any,
    @ConnectedSocket() client: Socket,
  ) {
    const message = await this.messageService.createMessage({
      senderId: req.user.userId,
      conversationId: data.conversationId,
      messageBody: data.message,
    });

    client.broadcast.to(message.conversationId).emit('message', message);
  }
}
