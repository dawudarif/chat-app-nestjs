import { IsNotEmpty, IsString } from 'class-validator';

export class MessageBodyDTO {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsNotEmpty()
  @IsString()
  conversationId: string;
}
