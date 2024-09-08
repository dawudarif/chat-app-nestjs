import { IsNotEmpty, IsString } from 'class-validator';

export class CreateConversation {
  @IsNotEmpty()
  @IsString()
  participant: string;
}
