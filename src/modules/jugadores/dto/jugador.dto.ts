import { IsString, IsNotEmpty, IsEnum, IsOptional, IsInt, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export enum JugadorStatusDto {
  NUEVO_INGRESO = 'NUEVO_INGRESO',
  ACTIVO = 'ACTIVO',
  INACTIVO = 'INACTIVO',
}

export class CreateJugadorDto {
  @IsString()
  @IsNotEmpty()
  cedula!: string;

  @IsString()
  @IsNotEmpty()
  nombre_apellido!: string;

  @IsString()
  @IsNotEmpty()
  categoria!: string;

  @IsEnum(JugadorStatusDto)
  @IsOptional()
  status?: JugadorStatusDto;

  @IsString()
  @IsOptional()
  mes_ingreso?: string;

  @IsString()
  @IsNotEmpty()
  torneo!: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  anio_ingreso?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deuda_2025?: number;
}

export class UpdateJugadorDto {
  @IsString()
  @IsOptional()
  nombre_apellido?: string;

  @IsString()
  @IsOptional()
  categoria?: string;

  @IsEnum(JugadorStatusDto)
  @IsOptional()
  status?: JugadorStatusDto;

  @IsString()
  @IsOptional()
  mes_ingreso?: string;

  @IsString()
  @IsOptional()
  torneo?: string;

  @IsInt()
  @IsOptional()
  @Type(() => Number)
  anio_ingreso?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  deuda_2025?: number;

  @IsOptional()
  @Type(() => Date)
  fecha_egreso?: Date;
}

export class JugadorResponseDto {
  id_jugador!: number;
  cedula!: string;
  nombre_apellido!: string;
  categoria!: string;
  status!: JugadorStatusDto;
  mes_ingreso?: string;
  fecha_egreso?: Date;
  torneo!: string;
  anio_ingreso?: number;
  deuda_2025?: number;
  fecha_registro!: Date;
  fecha_actualizacion!: Date;
}
