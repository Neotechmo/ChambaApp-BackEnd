import { IsInt, IsString, Min } from 'class-validator';

export class CreateNotificationDto {
  @IsInt()
  @Min(1)
  userId!: number;

  @IsString()
  title!: string;

  @IsString()
  message!: string;
}
