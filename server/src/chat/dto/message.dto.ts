import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  messageBody: string;
}
