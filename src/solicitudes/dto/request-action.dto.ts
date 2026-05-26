import { IsIn, IsOptional, IsString } from 'class-validator';

export class RejectRequestDto {
  @IsOptional()
  @IsString()
  motivo?: string;
}

export class UpdateJobStatusDto {
  @IsString()
  @IsIn(['on_the_way', 'in_progress', 'completed'])
  status!: string;
}
