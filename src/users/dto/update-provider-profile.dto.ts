import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdateProviderProfileDto {
  @IsOptional()
  @IsString()
  especialidad?: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  experienciaAnios?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  precioHora?: number;

  @IsOptional()
  @IsString()
  zonaCobertura?: string;

  @IsOptional()
  @IsBoolean()
  disponible?: boolean;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  etiquetas?: string[];
}
