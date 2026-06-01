import { Injectable } from '@nestjs/common';
import { Ingreso } from '@prisma/client';
import { IngresoResponseDto } from '../dto/ingreso.dto';

@Injectable()
export class IngresoMapper {
  toResponseDto(entity: Ingreso): IngresoResponseDto {
    return {
      id_ingreso: entity.id_ingreso,
      id_jugador: entity.id_jugador,
      concepto: entity.concepto,
      mes_deuda: entity.mes_deuda,
      fecha_pago: entity.fecha_pago,
      id_forma_pago: entity.id_forma_pago,
      divisas: entity.divisas?.toNumber(),
      tasa_cambio: entity.tasa_cambio?.toNumber(),
      monto_bsf: entity.monto_bsf?.toNumber(),
      monto_usd: entity.monto_usd?.toNumber(),
      referencia: entity.referencia!,
      notas: entity.notas!,
      fecha_registro: entity.fecha_registro!,
    };
  }

  toResponseDtoList(entities: Ingreso[]): IngresoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
