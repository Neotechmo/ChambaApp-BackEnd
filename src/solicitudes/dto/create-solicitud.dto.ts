import { IsInt, IsOptional, IsString, Min } from 'class-validator';

export class CreateSolicitudDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  direccion_servicio?: string;

  @IsInt()
  @Min(1)
  servicio_id!: number;
}
