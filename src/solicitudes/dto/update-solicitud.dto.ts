import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateSolicitudDto {
  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsOptional()
  @IsString()
  direccion_servicio?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'aceptada', 'rechazada', 'completada', 'cancelada'])
  estado?: string;
}
