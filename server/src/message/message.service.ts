import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessage } from './dto/create-message.dto';

@Injectable()
export class MessageService {
  constructor(private prisma: PrismaService) {}

  async createMessage(data: CreateMessage) {
    const message = await this.prisma.message.create({
      data: {
        body: data.messageBody,
        conversationId: data.conversationId,
        senderId: data.senderId,
      },
    });

    return message;
  }
}
