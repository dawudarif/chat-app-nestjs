import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateConversation {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
