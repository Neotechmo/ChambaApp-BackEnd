import { Type } from 'class-transformer';
import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class LocationDto {
  @IsOptional()
  @IsString()
  ciudad?: string;

  @IsOptional()
  @IsString()
  estado?: string;

  @IsOptional()
  @IsNumber()
  lat?: number;

  @IsOptional()
  @IsNumber()
  lng?: number;
}

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsOptional()
  @IsEmail()
  correo?: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsString()
  avatar?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LocationDto)
  ubicacion?: LocationDto;

  @IsOptional()
  @IsObject()
  preferencias?: Record<string, boolean | string[]>;
}
