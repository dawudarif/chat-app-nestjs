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
import { UserService } from '../user/user.service';

@Injectable()
export class ConversationService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

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
              userId_conversationId: {
                userId: data.senderId,
                conversationId: data.conversationId,
              },
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

  async getConversationById(data: ValidateConversation) {
    const checkConversation = await this.prisma.conversation.findUnique({
      where: {
        id: data.conversationId,
      },
    });

    return checkConversation;
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
    const getUser = await this.userService.getUser(userId);

    const findUsers = await this.userService.findUsersByQuery(
      text,
      getUser.username,
    );

    if (!findUsers) {
      throw new InternalServerErrorException('Internal server error');
    }

    return findUsers;
  }

  async findConversationByParticipants(participants: string[]) {
    const conversation = await this.prisma.conversation.findFirst({
      where: {
        participants: {
          every: {
            userId: {
              in: participants,
            },
          },
        },
      },
    });

    return conversation;
  }

  async validateConversation(req: any, id: string) {
    const findById = await this.getConversationById({ conversationId: id });

    if (findById) return { created: false, data: findById };

    const participants: string[] = [req.user.userId, id];

    const findByParticipants =
      await this.findConversationByParticipants(participants);

    if (findByParticipants) return { created: false, data: findByParticipants };

    const createNewConversation = this.createConversation(req, {
      participant: id,
    });

    if (!createNewConversation) {
      throw new InternalServerErrorException('Internal server error');
    }

    return { created: true, data: createNewConversation };
  }
}
