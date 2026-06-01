import { Injectable } from '@nestjs/common';
import { CuotaMensualDetalle } from '@prisma/client';
import { CuotaMensualDetalleResponseDto } from '../dto/cuota-mensual-detalle.dto';

@Injectable()
export class CuotaMensualDetalleMapper {
  toResponseDto(entity: CuotaMensualDetalle): CuotaMensualDetalleResponseDto {
    return {
      id_cuota_mes: entity.id_cuota_mes,
      id_jugador: entity.id_jugador,
      id_concepto: entity.id_concepto,
      mes: entity.mes,
      anio: entity.anio,
      monto: entity.monto.toNumber(),
      pagado: entity.pagado,
      fecha_pago: entity.fecha_pago!,
      fecha_registro: entity.fecha_registro,
    };
  }

  toResponseDtoList(entities: CuotaMensualDetalle[]): CuotaMensualDetalleResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
