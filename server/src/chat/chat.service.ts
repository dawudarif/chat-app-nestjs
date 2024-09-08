import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MessageDTO } from './dto/message.dto';
import { Request } from 'express';
import { ConversationService } from '../conversation/conversation.service';
import { MessageService } from '../message/message.service';

@Injectable()
export class ChatService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
    private messageService: MessageService,
  ) {}

  async handleMessage(req: any, data: MessageDTO) {
    const senderId = req.user?.sub;

    await this.prisma.$transaction(async (prisma) => {
      await this.conversationService.validateConversation({
        conversationId: data.conversationId,
        senderId,
      });

      const newMessage = await this.messageService.createMessage({
        conversationId: data.conversationId,
        messageBody: data.messageBody,
        senderId,
      });

      await this.conversationService.updateConversationMessage({
        conversationId: data.conversationId,
        messageId: newMessage.id,
        senderId,
      });

      return newMessage;
    });
  }
}
