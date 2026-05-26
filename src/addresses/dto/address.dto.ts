import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class AddressDto {
  @IsOptional()
  @IsString()
  etiqueta?: string;

  @IsString()
  calle!: string;

  @IsString()
  ciudad!: string;

  @IsString()
  estado!: string;

  @IsOptional()
  @IsString()
  codigoPostal?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  lng?: number;
}
