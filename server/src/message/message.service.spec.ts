import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Message } from '@prisma/client';
import { ConversationService } from '../conversation/conversation.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessage } from './dto/create-message.dto';
import { MessageService } from './message.service';
import { request } from 'express';

describe('MessageService', () => {
  let messageService: MessageService;
  let conversationService: ConversationService;
  let prismaService: PrismaService;

  const mockRequest = () => {
    const req = {
      user: {
        id: '1',
      },
    };
    return req;
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: PrismaService,
          useValue: {
            message: {
              create: jest.fn(),
              findMany: jest.fn(),
            },
            $transaction: jest.fn(),
          },
        },
        {
          provide: ConversationService,
          useValue: {
            checkConversationWithParticipant: jest.fn(),
            updateConversationMessage: jest.fn(),
          },
        },
      ],
    }).compile();

    messageService = module.get<MessageService>(MessageService);
    conversationService = module.get<ConversationService>(ConversationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(messageService).toBeDefined();
  });

  describe('createMessageService', () => {
    it('createMessageService should be defined', () => {
      expect(messageService.createMessage).toBeDefined();
    });

    it('should throw UnauthorizedException if user is not a participant', async () => {
      const data: CreateMessage = {
        senderId: '1',
        conversationId: '2',
        messageBody: 'hello world',
      };

      jest
        .spyOn(conversationService, 'checkConversationWithParticipant')
        .mockResolvedValue(null);

      await expect(messageService.createMessage(data)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should create a message', async () => {
      const data: CreateMessage = {
        conversationId: '1',
        messageBody: 'Hello',
        senderId: '1',
      };

      const message: Message = {
        body: data.messageBody,
        senderId: data.senderId,
        conversationId: data.conversationId,
        id: '1',
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      };

      const participants = {
        conversationId: expect.any(String),
        hasSeenLatestMessage: expect.any(Boolean),
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        id: expect.any(String),
        userId: expect.any(String),
        user: {
          username: expect.any(String),
          id: expect.any(String),
          email: expect.any(String),
          name: expect.any(String),
        },
      };

      const conversation = {
        id: expect.any(String),
        participants: [participants],
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
        latestMessageId: expect.any(String),
        latestMessage: {
          senderId: data.senderId,
          body: data.messageBody,
        },
      };

      jest
        .spyOn(conversationService, 'checkConversationWithParticipant')
        .mockResolvedValue({
          id: '1',
          latestMessageId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

      jest.spyOn(prismaService.message, 'create').mockResolvedValue(message);

      jest
        .spyOn(conversationService, 'updateConversationMessage')
        .mockResolvedValue(conversation);

      jest
        .spyOn(prismaService, '$transaction')
        .mockImplementation(async (cb) => cb(prismaService));

      const result = await messageService.createMessage(data);

      expect(result).toEqual({
        message,
        updateConversation: conversation,
      });
    });
  });

  describe('retreiveMessages', () => {
    it('retreiveMessages should be defined', () => {
      expect(messageService.retreiveMessages).toBeDefined();
    });

    it('should throw UnauthorizedException if user is not a participant', async () => {
      const conversationId = expect.any(String);
      const count = expect.any(Number);
      const req = mockRequest();

      jest
        .spyOn(conversationService, 'checkConversationWithParticipant')
        .mockResolvedValue(null);

      await expect(
        messageService.retreiveMessages(conversationId, count, req),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should retreive messages', async () => {
      const conversationId = expect.any(String);
      const count = expect.any(Number);
      const req = mockRequest();

      const messages: Message[] = [
        {
          id: '1',
          body: 'hello',
          senderId: '1',
          conversationId: '1',
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        },
      ];

      jest
        .spyOn(conversationService, 'checkConversationWithParticipant')
        .mockResolvedValue({
          id: '1',
          latestMessageId: null,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
        });

      jest.spyOn(prismaService.message, 'findMany').mockResolvedValue(messages);

      const result = await messageService.retreiveMessages(
        conversationId,
        count,
        req,
      );

      expect(result).toBe(messages);
    });
  });
});
