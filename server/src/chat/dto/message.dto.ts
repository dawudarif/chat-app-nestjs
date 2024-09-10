import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  messageBody: string;
}
