import { IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreatePagoDto {
  @IsNumber()
  @Min(0)
  monto!: number;

  @IsOptional()
  @IsString()
  metodo?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsInt()
  @Min(1)
  solicitud_id!: number;
}
