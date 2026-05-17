import {
  IsDateString,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class UpdatePagoDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  monto?: number;

  @IsOptional()
  @IsString()
  metodo?: string;

  @IsOptional()
  @IsString()
  referencia?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pendiente', 'pagado', 'fallido', 'reembolsado'])
  estado?: string;

  @IsOptional()
  @IsDateString()
  fecha_pago?: string;
}
