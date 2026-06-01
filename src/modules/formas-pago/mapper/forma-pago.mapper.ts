import { Injectable } from '@nestjs/common';
import { FormaPago } from '@prisma/client';
import { FormaPagoResponseDto } from '../dto/forma-pago.dto';

@Injectable()
export class FormaPagoMapper {
  toResponseDto(entity: FormaPago): FormaPagoResponseDto {
    return {
      id_forma_pago: entity.id_forma_pago,
      nombre_forma: entity.nombre_forma,
      descripcion: entity.descripcion!,
      activa: entity.activa,
      fecha_creacion: entity.fecha_creacion,
    };
  }

  toResponseDtoList(entities: FormaPago[]): FormaPagoResponseDto[] {
    return entities.map((entity) => this.toResponseDto(entity));
  }
}
