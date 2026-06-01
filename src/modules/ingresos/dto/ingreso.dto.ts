import { IsInt, IsNotEmpty, IsOptional, IsNumber, IsDate } from 'class-validator';

export class CreateIngresoDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  id_jugador!: number;

  @IsNotEmpty()
  concepto!: string;

  @IsInt()
  @IsOptional()
  @IsNumber()
  mes_deuda?: number;

  @IsNotEmpty()
  @IsDate()
  fecha_pago!: Date;

  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  id_forma_pago!: number;

  @IsOptional()
  @IsNumber()
  divisas?: number;

  @IsOptional()
  @IsNumber()
  tasa_cambio?: number;

  @IsOptional()
  @IsNumber()
  monto_bsf?: number;

  @IsOptional()
  @IsNumber()
  monto_usd?: number;

  @IsOptional()
  referencia?: string;

  @IsOptional()
  notas?: string;
}

export class UpdateIngresoDto {
  @IsInt()
  @IsOptional()
  @IsNumber()
  id_forma_pago?: number;

  @IsOptional()
  concepto?: string;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;

  @IsOptional()
  @IsNumber()
  divisas?: number;

  @IsOptional()
  @IsNumber()
  tasa_cambio?: number;

  @IsOptional()
  @IsNumber()
  monto_bsf?: number;

  @IsOptional()
  @IsNumber()
  monto_usd?: number;

  @IsOptional()
  referencia?: string;

  @IsOptional()
  notas?: string;
}

export class IngresoResponseDto {
  id_ingreso!: number;
  id_jugador!: number;
  concepto!: string;
  mes_deuda!: number;
  fecha_pago!: Date;
  id_forma_pago!: number;
  divisas?: number;
  tasa_cambio?: number;
  monto_bsf?: number;
  monto_usd?: number;
  referencia?: string;
  notas?: string;
  fecha_registro!: Date;
}
