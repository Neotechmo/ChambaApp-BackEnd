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
  @IsIn([
    'pending',
    'accepted',
    'on_the_way',
    'in_progress',
    'completed',
    'cancelled',
    'rejected',
    'pendiente',
    'aceptada',
    'rechazada',
    'completada',
    'cancelada',
  ])
  estado?: string;
}
