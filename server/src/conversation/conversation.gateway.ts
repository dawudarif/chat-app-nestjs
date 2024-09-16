import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { CookieGuard } from '../auth/cookie.guard';
import { Req, UseGuards } from '@nestjs/common';
import { Socket } from 'socket.io';

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
    @Req() req: any,
  ) {
    const { conversationId } = data;
    client.join(conversationId);
  }
}
