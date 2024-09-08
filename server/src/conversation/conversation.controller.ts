import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { CookieGuard } from '../auth/cookie.guard';
import { CreateConversation } from './dto/create-conversation.dto';
import { ConversationService } from './conversation.service';

@Controller('conversation')
export class ConversationController {
  constructor(private conversationService: ConversationService) {}

  @UseGuards(CookieGuard)
  @Post('create')
  async createConversation(@Req() req: any, @Body() data: CreateConversation) {
    return this.conversationService.createConversation(req, data);
  }
}
