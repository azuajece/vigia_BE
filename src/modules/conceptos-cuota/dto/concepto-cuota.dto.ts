import { IsString, IsNotEmpty, IsEnum, IsOptional, IsBoolean } from 'class-validator';

export enum ConceptoTipoDto {
  INSCRIPCION = 'INSCRIPCION',
  MENSUAL = 'MENSUAL',
  UNIFORME = 'UNIFORME',
  TORNEO = 'TORNEO',
  OTRO = 'OTRO',
}

export class CreateConceptoCuotaDto {
  @IsString()
  @IsNotEmpty()
  nombre_concepto!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(ConceptoTipoDto)
  @IsOptional()
  tipo?: ConceptoTipoDto;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class UpdateConceptoCuotaDto {
  @IsString()
  @IsOptional()
  nombre_concepto?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsEnum(ConceptoTipoDto)
  @IsOptional()
  tipo?: ConceptoTipoDto;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}

export class ConceptoCuotaResponseDto {
  id_concepto!: number;
  nombre_concepto!: string;
  descripcion?: string;
  tipo!: ConceptoTipoDto;
  activo!: boolean;
  fecha_creacion!: Date;
}
