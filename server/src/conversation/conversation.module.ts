import { Module } from '@nestjs/common';
import { ConversationController } from './conversation.controller';
import { ConversationService } from './conversation.service';
import { ConversationGateway } from './conversation.gateway';
import { UserService } from '../user/user.service';

@Module({
  controllers: [ConversationController],
  providers: [ConversationService, UserService, ConversationGateway],
})
export class ConversationModule {}
