import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  nombre!: string;

  @IsOptional()
  @IsString()
  apellido?: string;

  @IsEmail()
  correo!: string;

  @IsString()
  @MinLength(6)
  password!: string;

  @IsOptional()
  @IsString()
  telefono?: string;

  @IsOptional()
  @IsInt()
  @IsIn([2, 3])
  rol_id?: number;

  @IsOptional()
  @IsString()
  @IsIn(['cliente', 'prestador'])
  rol?: string;
}
