import { IsNotEmpty, IsString } from 'class-validator';

export class CreateMessage {
  @IsNotEmpty()
  @IsString()
  senderId: string;

  @IsNotEmpty()
  @IsString()
  messageBody: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
