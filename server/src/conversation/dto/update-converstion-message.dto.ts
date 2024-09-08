import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateConversationMessage {
  @IsString()
  @IsNotEmpty()
  messageId: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsString()
  @IsNotEmpty()
  senderId: string;
}
