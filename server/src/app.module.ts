import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserService } from './user/user.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { ConversationModule } from './conversation/conversation.module';
import { MessageService } from './message/message.service';
import { ConversationService } from './conversation/conversation.service';
import { EventsModule } from './events/events.module';
import { MessageController } from './message/message.controller';
import { MessageModule } from './message/message.module';
import { ConversationController } from './conversation/conversation.controller';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ConversationModule,
    EventsModule,
    MessageModule,
  ],
  controllers: [AppController, MessageController, ConversationController],
  providers: [
    AppService,
    PrismaService,
    UserService,
    ChatGateway,
    ChatService,
    MessageService,
    ConversationService,
  ],
})
export class AppModule {}
