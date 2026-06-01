import { IsInt, IsNotEmpty, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateCuotaMensualDetalleDto {
  @IsInt()
  @IsNotEmpty()
  id_jugador!: number;

  @IsInt()
  @IsNotEmpty()
  id_concepto!: number;

  @IsInt()
  @IsNotEmpty()
  mes!: number;

  @IsInt()
  @IsNotEmpty()
  anio!: number;

  @IsNotEmpty()
  monto!: number;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;
}

export class UpdateCuotaMensualDetalleDto {
  @IsInt()
  @IsOptional()
  id_concepto?: number;

  @IsNotEmpty()
  @IsOptional()
  monto?: number;

  @IsBoolean()
  @IsOptional()
  pagado?: boolean;

  @IsOptional()
  @IsDate()
  fecha_pago?: Date;
}

export class CuotaMensualDetalleResponseDto {
  id_cuota_mes!: number;
  id_jugador!: number;
  id_concepto!: number;
  mes!: number;
  anio!: number;
  monto!: number;
  pagado!: boolean;
  fecha_pago?: Date;
  fecha_registro!: Date;
}
