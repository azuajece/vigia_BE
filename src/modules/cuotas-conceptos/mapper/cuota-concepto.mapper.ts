import { Injectable } from '@nestjs/common';
import { CuotaConcepto } from '@prisma/client';
import { CuotaConceptoResponseDto } from '../dto/cuota-concepto.dto';

@Injectable()
export class CuotaConceptoMapper {
  toResponseDto(entity: any): CuotaConceptoResponseDto {
    return {
      id_cuota_concepto: entity.id_cuota_concepto,
      id_jugador: entity.id_jugador,
      nombre_jugador: entity.jugador?.nombre_apellido,
      cedula_jugador: entity.jugador?.cedula,
      id_concepto: entity.id_concepto,
      nombre_concepto: entity.concepto?.nombre_concepto,
      anio: entity.anio,
      monto: entity.monto.toNumber(),
      pagado: entity.pagado,
      fecha_pago: entity.fecha_pago!,
      fecha_registro: entity.fecha_registro,
    };
  }

  toResponseDtoList(entities: CuotaConcepto[]): CuotaConceptoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
