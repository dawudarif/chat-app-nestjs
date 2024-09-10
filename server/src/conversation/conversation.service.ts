import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateConversation } from './dto/create-conversation.dto';
import { UpdateConversationMessage } from './dto/update-converstion-message.dto';
import { ValidateConversation } from './dto/validate-conversation.dto';

@Injectable()
export class ConversationService {
  constructor(private prisma: PrismaService) {}

  async updateConversationMessage(data: UpdateConversationMessage) {
    const updateConversation = await this.prisma.conversation.update({
      where: {
        id: data.conversationId,
      },
      data: {
        latestMessageId: data.messageId,
        participants: {
          update: {
            where: {
              userId: data.senderId,
            },
            data: {
              hasSeenLatestMessage: true,
            },
          },
        },
      },
    });

    if (!updateConversation) {
      throw new InternalServerErrorException('Internal server error');
    }

    return updateConversation;
  }

  async validateConversation(data: ValidateConversation) {
    const checkConversation = await this.prisma.conversation.findUnique({
      where: {
        id: data.conversationId,
      },
    });

    if (checkConversation) {
      return checkConversation;
    } else {
      throw new NotFoundException('Invalid conversation');
    }
  }

  async createConversation(req: any, data: CreateConversation) {
    const participantIds: Array<string> = [req.user.userId, data.participant];

    const conversation = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: { in: participantIds },
          },
          some: {
            userId: { in: participantIds },
          },
        },
      },
      include: {
        participants: true,
      },
    });

    if (conversation) {
      throw new ConflictException('Conversation with the user exists');
    }

    const createConversation = await this.prisma.conversation.create({
      data: {
        participants: {
          create: participantIds.map((id) => ({
            userId: id,
          })),
        },
      },
    });

    return createConversation;
  }
}
