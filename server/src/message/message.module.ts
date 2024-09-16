import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { ConversationService } from '../conversation/conversation.service';
import { UserService } from '../user/user.service';
import { MessageGateway } from './message.gateway';

@Module({
  controllers: [MessageController],
  providers: [MessageService, ConversationService, UserService, MessageGateway],
})
export class MessageModule {}
