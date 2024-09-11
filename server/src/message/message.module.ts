import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ConversationService],
})
export class MessageModule {}
