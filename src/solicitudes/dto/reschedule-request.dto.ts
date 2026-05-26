import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class RescheduleRequestDto {
  @IsDateString()
  fechaSolicitada!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  duracionEstimadaMin?: number;
}

export class ProposeDateDto {
  @IsDateString()
  fechaPropuesta!: string;
}
