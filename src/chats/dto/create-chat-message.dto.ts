import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  roomId!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  senderId?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  receiverId?: number;

  @IsString()
  message!: string;
}
