import { Injectable } from '@nestjs/common';
import { Jugador } from '@prisma/client';
import { JugadorResponseDto } from '../dto/jugador.dto';

@Injectable()
export class JugadorMapper {
  toResponseDto(entity: Jugador): JugadorResponseDto {
    return {
      id_jugador: entity.id_jugador,
      cedula: entity.cedula,
      nombre_apellido: entity.nombre_apellido,
      categoria: entity.categoria,
      status: entity.status as any,
      mes_ingreso: entity.mes_ingreso!,
      fecha_egreso: entity.fecha_egreso!,
      torneo: entity.torneo,
      anio_ingreso: entity.anio_ingreso!,
      deuda_2025: entity.deuda_2025.toNumber(),
      fecha_registro: entity.fecha_registro,
      fecha_actualizacion: entity.fecha_actualizacion,
    };
  }

  toResponseDtoList(entities: Jugador[]): JugadorResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
