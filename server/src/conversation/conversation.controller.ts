import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieGuard } from '../auth/guard/cookie.guard';
import { CreateConversation } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @UseGuards(CookieGuard)
  @Get('all')
  async getConversations(@Req() req: any) {
    return this.conversationService.getAllConversations(req.user.userId);
  }

  @UseGuards(CookieGuard)
  @Post('search')
  async searchConverations(@Req() req: any, @Body() body: { text: string }) {
    return this.conversationService.searchConversations(
      req.user.userId,
      body.text,
    );
  }

  @UseGuards(CookieGuard)
  @Post('create')
  async createConversation(
    @Req() req: any,
    @Body()
    body: {
      id: string;
    },
  ) {
    return this.conversationService.createConversation(req, {
      participant: body?.id,
    });
  }
}
