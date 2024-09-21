import { UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { CookieGuard } from '../auth/cookie.guard';

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:3000/',
    credentials: true,
  },
})
export class ConversationGateway {
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
}
