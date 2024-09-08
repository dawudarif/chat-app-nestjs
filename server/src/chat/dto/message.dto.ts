import { IsNotEmpty, IsString } from 'class-validator';

export class MessageDTO {
  @IsNotEmpty()
  @IsString()
  sender: string;

  @IsNotEmpty()
  @IsString()
  receiver: string;

  @IsString()
  @IsNotEmpty()
  conversationId: string;

  @IsNotEmpty()
  @IsString()
  messageBody: string;
}
