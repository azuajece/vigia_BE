import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import {
  CreateCuotaMensualDetalleDto,
  UpdateCuotaMensualDetalleDto,
} from '../dto/cuota-mensual-detalle.dto';
import { CuotaMensualDetalleMapper } from '../mapper/cuota-mensual-detalle.mapper';

@Injectable()
export class CuotasMensualesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: CuotaMensualDetalleMapper,
  ) {}

  async create(createCuotaMensualDetalleDto: CreateCuotaMensualDetalleDto) {
    // Validaciones
    if (createCuotaMensualDetalleDto.mes < 1 || createCuotaMensualDetalleDto.mes > 12) {
      throw new BadRequestException('El mes debe estar entre 1 y 12');
    }

    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: createCuotaMensualDetalleDto.id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(
        `Jugador con ID ${createCuotaMensualDetalleDto.id_jugador} no encontrado`,
      );
    }

    const concepto = await this.prisma.conceptoCuota.findUnique({
      where: { id_concepto: createCuotaMensualDetalleDto.id_concepto },
    });

    if (!concepto) {
      throw new NotFoundException(
        `Concepto con ID ${createCuotaMensualDetalleDto.id_concepto} no encontrado`,
      );
    }

    const existingCuota = await this.prisma.cuotaMensualDetalle.findFirst({
      where: {
          id_jugador: createCuotaMensualDetalleDto.id_jugador,
          id_concepto: createCuotaMensualDetalleDto.id_concepto,
          mes: createCuotaMensualDetalleDto.mes,
          anio: createCuotaMensualDetalleDto.anio,
      },
    });

    if (existingCuota) {
      throw new ConflictException(
        `La cuota mensual del jugador ${jugador.nombre_apellido} para el mes ${createCuotaMensualDetalleDto.mes} del año ${createCuotaMensualDetalleDto.anio} ya existe`,
      );
    }

    const cuota = await this.prisma.cuotaMensualDetalle.create({
      data: createCuotaMensualDetalleDto,
    });

    return this.mapper.toResponseDto(cuota);
  }

  async findAll(skip = 0, take = 10) {
    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaMensualDetalle.findMany({
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
      }),
      this.prisma.cuotaMensualDetalle.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const cuota = await this.prisma.cuotaMensualDetalle.findUnique({
      where: { id_cuota_mes: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota mensual con ID ${id} no encontrada`);
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
      this.prisma.cuotaMensualDetalle.findMany({
        where: { id_jugador },
        skip,
        take,
        orderBy: { anio: 'desc', mes: 'desc' },
      }),
      this.prisma.cuotaMensualDetalle.count({ where: { id_jugador } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async findByMesAnio(mes: number, anio: number, skip = 0, take = 10) {
    if (mes < 1 || mes > 12) {
      throw new BadRequestException('El mes debe estar entre 1 y 12');
    }

    const [cuotas, total] = await Promise.all([
      this.prisma.cuotaMensualDetalle.findMany({
        where: { mes, anio },
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
      }),
      this.prisma.cuotaMensualDetalle.count({ where: { mes, anio } }),
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
      this.prisma.cuotaMensualDetalle.findMany({
        where: { anio },
        skip,
        take,
        orderBy: { mes: 'asc' },
      }),
      this.prisma.cuotaMensualDetalle.count({ where: { anio } }),
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
      this.prisma.cuotaMensualDetalle.findMany({
        where: { pagado: false },
        skip,
        take,
        orderBy: { anio: 'desc', mes: 'desc' },
      }),
      this.prisma.cuotaMensualDetalle.count({ where: { pagado: false } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(cuotas),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateCuotaMensualDetalleDto: UpdateCuotaMensualDetalleDto) {
    const cuota = await this.prisma.cuotaMensualDetalle.findUnique({
      where: { id_cuota_mes: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota mensual con ID ${id} no encontrada`);
    }

    const updatedCuota = await this.prisma.cuotaMensualDetalle.update({
      where: { id_cuota_mes: id },
      data: updateCuotaMensualDetalleDto,
    });

    return this.mapper.toResponseDto(updatedCuota);
  }

  async marcarComoPagada(id: number) {
    const cuota = await this.prisma.cuotaMensualDetalle.findUnique({
      where: { id_cuota_mes: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota mensual con ID ${id} no encontrada`);
    }

    const updatedCuota = await this.prisma.cuotaMensualDetalle.update({
      where: { id_cuota_mes: id },
      data: {
        pagado: true,
        fecha_pago: new Date(),
      },
    });

    return this.mapper.toResponseDto(updatedCuota);
  }

  async remove(id: number) {
    const cuota = await this.prisma.cuotaMensualDetalle.findUnique({
      where: { id_cuota_mes: id },
    });

    if (!cuota) {
      throw new NotFoundException(`Cuota mensual con ID ${id} no encontrada`);
    }

    await this.prisma.cuotaMensualDetalle.delete({
      where: { id_cuota_mes: id },
    });

    return { message: 'Cuota mensual eliminada exitosamente' };
  }
}
