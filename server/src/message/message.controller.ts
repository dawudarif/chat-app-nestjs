import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CookieGuard } from '../auth/cookie.guard';
import { MessageService } from './message.service';

@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @UseGuards(CookieGuard)
  @Get()
  async getMessages(
    @Query('count', ParseIntPipe) count: number,
    @Query('conversationId') conversationId: string,
    @Req() req: Request,
  ) {
    if (!conversationId) return;

    const retreive = await this.messageService.retreiveMessages(
      conversationId,
      count,
      req,
    );

    return retreive;
  }
}
