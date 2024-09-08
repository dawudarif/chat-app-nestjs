import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ValidateConversation } from './dto/validate-conversation.dto';
import { UpdateConversationMessage } from './dto/update-converstion-message.dto';

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

    if (updateConversation) {
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
}
