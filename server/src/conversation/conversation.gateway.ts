import { Req, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CookieGuard } from '../auth/cookie.guard';
import { ConversationService } from './conversation.service';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000/',
    credentials: true,
  },
})
export class ConversationGateway {
  constructor(private conversationService: ConversationService) {}

  @UseGuards(CookieGuard)
  @SubscribeMessage('joinConversation')
  async joinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;
    client.join(conversationId);
  }

  @UseGuards(CookieGuard)
  @SubscribeMessage('leaveConversation')
  async leaveConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;
    client.leave(conversationId);
  }

  @UseGuards(CookieGuard)
  @SubscribeMessage('markRead')
  async markRead(
    @MessageBody() data: { conversationId: string },

    @Req() req: any,
  ) {
    const { conversationId } = data;

    this.conversationService.markConversationAsRead(
      conversationId,
      req?.user?.userId,
    );
  }
}
