import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateIngresoDto, UpdateIngresoDto } from '../dto/ingreso.dto';
import { IngresoMapper } from '../mapper/ingreso.mapper';

@Injectable()
export class IngresosService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: IngresoMapper,
  ) {}

  async create(createIngresoDto: CreateIngresoDto) {
    // Validar que el jugador existe
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: createIngresoDto.id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(
        `Jugador con ID ${createIngresoDto.id_jugador} no encontrado`,
      );
    }

    // Validar que la forma de pago existe
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id_forma_pago: createIngresoDto.id_forma_pago },
    });

    if (!formaPago) {
      throw new NotFoundException(
        `Forma de pago con ID ${createIngresoDto.id_forma_pago} no encontrada`,
      );
    }

    const ingreso = await this.prisma.ingreso.create({
      data: createIngresoDto,
    });

    return this.mapper.toResponseDto(ingreso);
  }

  async findAll(skip = 0, take = 10) {
    const [ingresos, total] = await Promise.all([
      this.prisma.ingreso.findMany({
        skip,
        take,
        orderBy: { fecha_pago: 'desc' },
      }),
      this.prisma.ingreso.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(ingresos),
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const ingreso = await this.prisma.ingreso.findUnique({
      where: { id_ingreso: id },
    });

    if (!ingreso) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    return this.mapper.toResponseDto(ingreso);
  }

  async findByJugador(id_jugador: number, skip = 0, take = 10) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id_jugador} no encontrado`);
    }

    const [ingresos, total] = await Promise.all([
      this.prisma.ingreso.findMany({
        where: { id_jugador },
        skip,
        take,
        orderBy: { fecha_pago: 'desc' },
      }),
      this.prisma.ingreso.count({ where: { id_jugador } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(ingresos),
      total,
      skip,
      take,
    };
  }

  async findByReferencia(referencia: string, skip = 0, take = 10) {
    const [ingresos, total] = await Promise.all([
      this.prisma.ingreso.findMany({
        where: { referencia },
        skip,
        take,
        orderBy: { fecha_pago: 'desc' },
      }),
      this.prisma.ingreso.count({ where: { referencia } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(ingresos),
      total,
      skip,
      take,
    };
  }

  async findByFechaPago(fechaInicio: Date, fechaFin: Date, skip = 0, take = 10) {
    const [ingresos, total] = await Promise.all([
      this.prisma.ingreso.findMany({
        where: {
          fecha_pago: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
        skip,
        take,
        orderBy: { fecha_pago: 'desc' },
      }),
      this.prisma.ingreso.count({
        where: {
          fecha_pago: {
            gte: fechaInicio,
            lte: fechaFin,
          },
        },
      }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(ingresos),
      total,
      skip,
      take,
    };
  }

  async findByFormaPago(id_forma_pago: number, skip = 0, take = 10) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id_forma_pago },
    });

    if (!formaPago) {
      throw new NotFoundException(`Forma de pago con ID ${id_forma_pago} no encontrada`);
    }

    const [ingresos, total] = await Promise.all([
      this.prisma.ingreso.findMany({
        where: { id_forma_pago },
        skip,
        take,
        orderBy: { fecha_pago: 'desc' },
      }),
      this.prisma.ingreso.count({ where: { id_forma_pago } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(ingresos),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateIngresoDto: UpdateIngresoDto) {
    const ingreso = await this.prisma.ingreso.findUnique({
      where: { id_ingreso: id },
    });

    if (!ingreso) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    const updatedIngreso = await this.prisma.ingreso.update({
      where: { id_ingreso: id },
      data: updateIngresoDto,
    });

    return this.mapper.toResponseDto(updatedIngreso);
  }

  async remove(id: number) {
    const ingreso = await this.prisma.ingreso.findUnique({
      where: { id_ingreso: id },
    });

    if (!ingreso) {
      throw new NotFoundException(`Ingreso con ID ${id} no encontrado`);
    }

    await this.prisma.ingreso.delete({
      where: { id_ingreso: id },
    });

    return { message: 'Ingreso eliminado exitosamente' };
  }

  async getIngresosTotalesPorJugador(id_jugador: number) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id_jugador} no encontrado`);
    }

    const ingresos = await this.prisma.ingreso.findMany({
      where: { id_jugador },
    });

    const totalBsf = ingresos.reduce((sum, ing) => {
      return sum + (ing.monto_bsf?.toNumber() || 0);
    }, 0);

    const totalUsd = ingresos.reduce((sum, ing) => {
      return sum + (ing.monto_usd?.toNumber() || 0);
    }, 0);

    return {
      id_jugador,
      nombre_jugador: jugador.nombre_apellido,
      cantidad_ingresos: ingresos.length,
      total_bsf: totalBsf,
      total_usd: totalUsd,
      ingresos: this.mapper.toResponseDtoList(ingresos),
    };
  }
}
