import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessage } from './dto/create-message.dto';
import { ConversationService } from '../conversation/conversation.service';

@Injectable()
export class MessageService {
  constructor(
    private prisma: PrismaService,
    private conversationService: ConversationService,
  ) {}

  async createMessage(data: CreateMessage) {
    const userId = data.senderId;
    const conversationId = data.conversationId;

    const userIsParticipant =
      await this.conversationService.checkConversationWithParticipant(
        userId,
        conversationId,
      );

    if (!userIsParticipant) {
      throw new UnauthorizedException("You're not a participant");
    }

    const message = await this.prisma.message.create({
      data: {
        body: data.messageBody,
        conversationId: data.conversationId,
        senderId: data.senderId,
      },
    });

    if (!message) {
      throw new InternalServerErrorException('Internal server error');
    }

    return message;
  }

  async retreiveMessages(conversationId: string, count: number, req: any) {
    const userId = req.user?.userId;

    const checkConversation =
      await this.conversationService.checkConversationWithParticipant(
        userId,
        conversationId,
      );

    const messages = await this.prisma.message.findMany({
      where: {
        conversationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: count,
    });

    return messages;
  }
}
