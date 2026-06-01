import { Injectable } from '@nestjs/common';
import { ConceptoCuota } from '@prisma/client';
import { ConceptoCuotaResponseDto } from '../dto/concepto-cuota.dto';

@Injectable()
export class ConceptoCuotaMapper {
  toResponseDto(entity: ConceptoCuota): ConceptoCuotaResponseDto {
    return {
      id_concepto: entity.id_concepto,
      nombre_concepto: entity.nombre_concepto,
      descripcion: entity.descripcion!,
      tipo: entity.tipo as any,
      activo: entity.activo,
      fecha_creacion: entity.fecha_creacion,
    };
  }

  toResponseDtoList(entities: ConceptoCuota[]): ConceptoCuotaResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
