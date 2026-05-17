import { IsNumber, IsString, Min } from 'class-validator';

export class CreateServiceDto {
  @IsString()
  titulo!: string;

  @IsString()
  descripcion!: string;

  @IsNumber()
  @Min(0)
  precio_base!: number;
}
