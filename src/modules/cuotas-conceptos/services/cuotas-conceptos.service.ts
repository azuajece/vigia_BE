import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateCuotaConceptoDto, UpdateCuotaConceptoDto } from '../dto/cuota-concepto.dto';
import { CuotaConceptoMapper } from '../mapper/cuota-concepto.mapper';

@Injectable()
export class CuotasConceptosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CuotaConceptoMapper,
  ) {}

  async create(createCuotaConceptoDto: CreateCuotaConceptoDto) {
    // Validar que el jugador existe
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: createCuotaConceptoDto.id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(
        `Jugador con ID ${createCuotaConceptoDto.id_jugador} no encontrado`,
      );
    }

    // Validar que el concepto existe
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto: createCuotaConceptoDto.id_concepto },
    });

    if (!concepto) {
      throw new NotFoundException(
        `Concepto con ID ${createCuotaConceptoDto.id_concepto} no encontrado`,
      );
    }

    // Verificar que no exista una cuota duplicada
    const existingCuota = await this.prisma.cuotaConcepto.findFirst({
      where: {
          id_jugador: createCuotaConceptoDto.id_jugador!,
          id_concepto: createCuotaConceptoDto.id_concepto!,
          anio: createCuotaConceptoDto.anio!,
      },
    });

    if (existingCuota) {
      throw new ConflictException(
        `La cuota del jugador ${jugador.nombre_apellido} para el concepto ${concepto.nombre_concepto} en el año ${createCuotaConceptoDto.anio} ya existe`,
      );
    }

    const cuota = await this.prisma.cuotaConcepto.create({
      data: createCuotaConceptoDto,
    });

    return this.mapper.toResponseDto(cuota);
  }

  async findAll(skip = 0, take = 10) {
    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaConcepto.findMany({
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
        include: {
          jugador: {
            select: {
              id_jugador: true,
              nombre_apellido: true,
              cedula: true,
            },
          },
          concepto: {
            select: {
              id_concepto: true,
              nombre_concepto: true,
            },
          },
        },
      }),
      this.prisma.cuotaConcepto.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const cuota = await this.prisma.cuotaConcepto.findUnique({
      where: { id_cuota_concepto: id },
      include: {
        jugador: {
          select: {
            id_jugador: true,
            nombre_apellido: true,
            cedula: true,
          },
        },        concepto: {
          select: {
            id_concepto: true,
            nombre_concepto: true,
          },
        },      },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota por concepto con ID ${id} no encontrada`);
    }

    return this.mapper.toResponseDto(cuota);
  }

  async findByJugador(id_jugador: number, skip = 0, take = 10) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id_jugador} no encontrado`);
    }

    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaConcepto.findMany({
        where: { id_jugador },
        skip,
        take,
        orderBy: { anio: 'desc' },
        include: {
          jugador: {
            select: {
              id_jugador: true,
              nombre_apellido: true,
              cedula: true,
            },
          },
          concepto: {
            select: {
              id_concepto: true,
              nombre_concepto: true,
            },
          },
        },
      }),
      this.prisma.cuotaConcepto.count({ where: { id_jugador } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findByConcepto(id_concepto: number, skip = 0, take = 10) {
    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto },
    });

    if (!concepto) {
      throw new NotFoundException(`Concepto con ID ${id_concepto} no encontrado`);
    }

    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaConcepto.findMany({
        where: { id_concepto },
        skip,
        take,
        orderBy: { anio: 'desc' },
        include: {
          jugador: {
            select: {
              id_jugador: true,
              nombre_apellido: true,
              cedula: true,
            },
          },
          concepto: {
            select: {
              id_concepto: true,
              nombre_concepto: true,
            },
          },
        },
      }),
      this.prisma.cuotaConcepto.count({ where: { id_concepto } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findByYear(anio: number, skip = 0, take = 10) {
    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaConcepto.findMany({
        where: { anio },
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
        include: {
          jugador: {
            select: {
              id_jugador: true,
              nombre_apellido: true,
              cedula: true,
            },
          },          concepto: {
            select: {
              id_concepto: true,
              nombre_concepto: true,
            },
          },
        },
      }),
      this.prisma.cuotaConcepto.count({ where: { anio } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findPendientes(skip = 0, take = 10) {
    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaConcepto.findMany({
        where: { pagado: false },
        skip,
        take,
        orderBy: { anio: 'desc' },
      }),
      this.prisma.cuotaConcepto.count({ where: { pagado: false } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateCuotaConceptoDto: UpdateCuotaConceptoDto) {
    const cuota = await this.prisma.cuotaConcepto.findUnique({
      where: { id_cuota_concepto: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota por concepto con ID ${id} no encontrada`);
    }

    const updatedCuota = await this.prisma.cuotaConcepto.update({
      where: { id_cuota_concepto: id },
      data: updateCuotaConceptoDto,
    });

    return this.mapper.toResponseDto(updatedCuota);
  }

  async marcarComoPagada(id: number) {
    const cuota = await this.prisma.cuotaConcepto.findUnique({
      where: { id_cuota_concepto: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota por concepto con ID ${id} no encontrada`);
    }

    const updatedCuota = await this.prisma.cuotaConcepto.update({
      where: { id_cuota_concepto: id },
      data: {
        pagado: true,
        fecha_pago: new Date(),
      },
    });

    return this.mapper.toResponseDto(updatedCuota);
  }

  async remove(id: number) {
    const cuota = await this.prisma.cuotaConcepto.findUnique({
      where: { id_cuota_concepto: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota por concepto con ID ${id} no encontrada`);
    }

    await this.prisma.cuotaConcepto.delete({
      where: { id_cuota_concepto: id },
    });

    return { message: 'Cuota por concepto eliminada exitosamente' };
  }
}
