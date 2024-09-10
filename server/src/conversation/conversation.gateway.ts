import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CookieGuard } from '../auth/cookie.guard';
import { UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class ConversationGateway {
  @UseGuards(CookieGuard)
  @SubscribeMessage('joinConversation')
  async joinConversation(
    @MessageBody() data: { conversationId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const { conversationId } = data;

    client.join(conversationId);

    console.log(`Client ${client.id} joined conversation ${conversationId}`);
  }
}
