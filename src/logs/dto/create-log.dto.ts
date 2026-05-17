import { IsInt, IsObject, IsOptional, IsString, Min } from 'class-validator';

export class CreateLogDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  userId?: number;

  @IsString()
  action!: string;

  @IsOptional()
  @IsString()
  entity?: string;

  @IsOptional()
  @IsString()
  entityId?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
