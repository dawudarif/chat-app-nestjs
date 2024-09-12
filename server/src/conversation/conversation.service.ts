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

  async checkConversationWithParticipant(
    userId: string,
    conversationId: string,
  ) {
    const conversation = await this.prisma.conversation.findUnique({
      where: {
        id: conversationId,
        participants: {
          some: {
            userId: userId,
          },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException('Invalid conversation or participant');
    }

    return conversation;
  }

  async getAllConversations(userId: string) {
    const conversations = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: userId,
          },
        },
      },
      include: {
        latestMessage: {
          select: {
            senderId: true,
            body: true,
          },
        },
        participants: {
          where: {
            userId: {
              not: userId,
            },
          },
          include: {
            user: {
              select: {
                username: true,
                id: true,
                email: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!conversations) {
      throw new InternalServerErrorException('Internal server error');
    }

    return conversations;
  }

  async searchConversations(userId: string, text: string) {
    const search = await this.prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            user: {
              id: userId,
              AND: [
                { name: { contains: text } },
                { username: { contains: text } },
              ],
            },
          },
        },
      },
      include: {
        participants: {
          where: {
            userId: {
              not: userId,
            },
          },
          include: {
            user: {
              select: {
                id: true,
                name: true,
                username: true,
              },
            },
          },
        },
      },
    });

    if (!search) {
      throw new InternalServerErrorException('Internal server error');
    }

    return search;
  }
}
