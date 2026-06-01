import { IsInt, IsNotEmpty, IsOptional, IsBoolean, IsDate, IsNumber } from 'class-validator';

export class CreateCuotaConceptoDto {
  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  id_jugador!: number;

  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  id_concepto!: number;

  @IsInt()
  @IsNotEmpty()
  @IsNumber()
  anio!: number;

  @IsNotEmpty()
  @IsNumber()
  monto!: number;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;
}

export class UpdateCuotaConceptoDto {
  @IsInt()
  @IsOptional()
  @IsNumber()
  id_concepto?: number;

  @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  monto?: number;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;
}

export class CuotaConceptoResponseDto {
  id_cuota_concepto!: number;
  id_jugador!: number;
  nombre_jugador?: string;
  cedula_jugador?: string;
  id_concepto!: number;
  nombre_concepto?: string;
  anio!: number;
  monto!: number;
  pagado!: boolean;
  fecha_pago?: Date;
  fecha_registro!: Date;
}
