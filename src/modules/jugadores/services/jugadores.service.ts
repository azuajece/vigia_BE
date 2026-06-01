import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateJugadorDto, UpdateJugadorDto } from '../dto/jugador.dto';
import { JugadorMapper } from '../mapper/jugador.mapper';

@Injectable()
export class JugadoresService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: JugadorMapper,
  ) {}

  async create(createJugadorDto: CreateJugadorDto) {
    // Verificar si la cédula ya existe
    const existingJugador = await this.prisma.jugador.findUnique({
      where: { cedula: createJugadorDto.cedula },
    });

    if (existingJugador) {
      throw new ConflictException(`El jugador con cédula ${createJugadorDto.cedula} ya existe`);
    }

    const jugador = await this.prisma.jugador.create({
      data: createJugadorDto,
    });

    return this.mapper.toResponseDto(jugador);
  }

  async findAll(skip = 0, take = 10) {
    const [jugadores, total] = await Promise.all([
      this.prisma.jugador.findMany({
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
      }),
      this.prisma.jugador.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(jugadores),
      total,
      skip,
      take,
    };
  }

  async findByCedula(cedula: string) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { cedula },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con cédula ${cedula} no encontrado`);
    }

    return this.mapper.toResponseDto(jugador);
  }

  async findById(id: number) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: id },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    return this.mapper.toResponseDto(jugador);
  }

  async findByCategoria(categoria: string, skip = 0, take = 10) {
    const [jugadores, total] = await Promise.all([
      this.prisma.jugador.findMany({
        where: { categoria },
        skip,
        take,
        orderBy: { nombre_apellido: 'asc' },
      }),
      this.prisma.jugador.count({ where: { categoria } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(jugadores),
      total,
      skip,
      take,
    };
  }

  async findByStatus(status: string, skip = 0, take = 10) {
    const [jugadores, total] = await Promise.all([
      this.prisma.jugador.findMany({
        where: { status: status as 'NUEVO_INGRESO' | 'ACTIVO' | 'INACTIVO' },
        skip,
        take,
        orderBy: { fecha_registro: 'desc' },
      }),
      this.prisma.jugador.count({ where: { status: status as 'NUEVO_INGRESO' | 'ACTIVO' | 'INACTIVO' } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(jugadores),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateJugadorDto: UpdateJugadorDto) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: id },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    const updatedJugador = await this.prisma.jugador.update({
      where: { id_jugador: id },
      data: updateJugadorDto,
    });

    return this.mapper.toResponseDto(updatedJugador);
  }

  async remove(id: number) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: id },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    await this.prisma.jugador.delete({
      where: { id_jugador: id },
    });

    return { message: `Jugador ${jugador.nombre_apellido} eliminado exitosamente` };
  }

  async getEstadoCuenta(id: number) {
    const jugador = await this.prisma.jugador.findUnique({
      where: { id_jugador: id },
      include: {
        cuotas_conceptos: true,
        cuotas_mensuales: true,
      },
    });

    if (!jugador) {
      throw new NotFoundException(`Jugador con ID ${id} no encontrado`);
    }

    const totalConceptoPendiente = jugador.cuotas_conceptos
      .filter((c) => !c.pagado)
      .reduce((sum, c) => sum + c.monto.toNumber(), 0);

    const totalMensualPendiente = jugador.cuotas_mensuales
      .filter((c) => !c.pagado)
      .reduce((sum, c) => sum + c.monto.toNumber(), 0);

    const saldoTotal =
      jugador.deuda_2025.toNumber() + totalConceptoPendiente + totalMensualPendiente;

    return {
      jugador: this.mapper.toResponseDto(jugador),
      deuda_2025: jugador.deuda_2025.toNumber(),
      total_concepto_pendiente: totalConceptoPendiente,
      total_mensual_pendiente: totalMensualPendiente,
      saldo_total: saldoTotal,
    };
  }
}
