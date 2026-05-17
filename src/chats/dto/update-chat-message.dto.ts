import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdateChatMessageDto {
  @IsOptional()
  @IsString()
  message?: string;

  @IsOptional()
  @IsBoolean()
  read?: boolean;
}
