import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateConceptoCuotaDto, UpdateConceptoCuotaDto } from '../dto/concepto-cuota.dto';
import { ConceptoCuotaMapper } from '../mapper/concepto-cuota.mapper';

@Injectable()
export class ConceptosCuotaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: ConceptoCuotaMapper,
  ) {}

  async create(createConceptoCuotaDto: CreateConceptoCuotaDto) {
    const existingConcepto = await this.prisma.conceptoCuota.findUnique({
      where: { nombre_concepto: createConceptoCuotaDto.nombre_concepto },
    });

    if (existingConcepto) {
      throw new ConflictException(
        `El concepto de cuota ${createConceptoCuotaDto.nombre_concepto} ya existe`,
      );
    }

    const concepto = await this.prisma.conceptoCuota.create({
      data: createConceptoCuotaDto,
    });

    return this.mapper.toResponseDto(concepto);
  }

  async findAll(skip = 0, take = 10) {
    const [conceptos, total] = await Promise.all([
      this.prisma.conceptoCuota.findMany({
        skip,
        take,
        orderBy: { fecha_creacion: 'desc' },
      }),
      this.prisma.conceptoCuota.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(conceptos),
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto: id },
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto de cuota con ID ${id} no encontrado`);
    }

    return this.mapper.toResponseDto(concepto);
  }

  async findByNombre(nombre: string) {
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { nombre_concepto: nombre },
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto de cuota ${nombre} no encontrado`);
    }

    return this.mapper.toResponseDto(concepto);
  }

  async findActivos(skip = 0, take = 10) {
    const [conceptos, total] = await Promise.all([
      this.prisma.conceptoCuota.findMany({
        where: { activo: true },
        skip,
        take,
        orderBy: { nombre_concepto: 'asc' },
      }),
      this.prisma.conceptoCuota.count({ where: { activo: true } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(conceptos),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateConceptoCuotaDto: UpdateConceptoCuotaDto) {
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto: id },
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto de cuota con ID ${id} no encontrado`);
    }

    const updatedConcepto = await this.prisma.conceptoCuota.update({
      where: { id_concepto: id },
      data: updateConceptoCuotaDto,
    });

    return this.mapper.toResponseDto(updatedConcepto);
  }

  async remove(id: number) {
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto: id },
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto de cuota con ID ${id} no encontrado`);
    }

    await this.prisma.conceptoCuota.delete({
      where: { id_concepto: id },
    });

    return { message: `Concepto de cuota ${concepto.nombre_concepto} eliminado exitosamente` };
  }
}
