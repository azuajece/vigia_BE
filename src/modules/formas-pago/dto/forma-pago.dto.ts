import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateFormaPagoDto {
  @IsString()
  @IsNotEmpty()
  nombre_forma!: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}

export class UpdateFormaPagoDto {
  @IsString()
  @IsOptional()
  nombre_forma?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsBoolean()
  @IsOptional()
  activa?: boolean;
}

export class FormaPagoResponseDto {
  id_forma_pago!: number;
  nombre_forma!: string;
  descripcion?: string;
  activa!: boolean;
  fecha_creacion!: Date;
}
