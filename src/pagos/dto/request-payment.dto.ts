import { IsOptional, IsString } from 'class-validator';

export class CreateRequestPaymentDto {
  @IsString()
  method!: string;

  @IsOptional()
  @IsString()
  reference?: string;
}
