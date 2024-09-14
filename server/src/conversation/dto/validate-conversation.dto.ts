import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateConversation {
  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
