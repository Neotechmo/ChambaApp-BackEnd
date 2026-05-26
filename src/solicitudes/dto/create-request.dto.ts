import { Type } from 'class-transformer';
import {
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRequestDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  serviceId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  providerId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  categoryId?: number;

  @IsString()
  titulo!: string;

  @IsString()
  descripcion!: string;

  @IsOptional()
  @IsIn(['normal', 'urgent'])
  prioridad?: string;

  @IsDateString()
  fechaSolicitada!: string;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  duracionEstimadaMin!: number;

  @IsOptional()
  @IsString()
  direccion?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  direccionId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioEstimado?: number;
}
