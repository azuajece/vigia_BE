import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateFormaPagoDto, UpdateFormaPagoDto } from '../dto/forma-pago.dto';
import { FormaPagoMapper } from '../mapper/forma-pago.mapper';

@Injectable()
export class FormasPagoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mapper: FormaPagoMapper,
  ) {}

  async create(createFormaPagoDto: CreateFormaPagoDto) {
    const existingFormaPago = await this.prisma.formaPago.findUnique({
      where: { nombre_forma: createFormaPagoDto.nombre_forma },
    });

    if (existingFormaPago) {
      throw new ConflictException(
        `La forma de pago ${createFormaPagoDto.nombre_forma} ya existe`,
      );
    }

    const formaPago = await this.prisma.formaPago.create({
      data: createFormaPagoDto,
    });

    return this.mapper.toResponseDto(formaPago);
  }

  async findAll(skip = 0, take = 10) {
    const [formasPago, total] = await Promise.all([
      this.prisma.formaPago.findMany({
        skip,
        take,
        orderBy: { fecha_creacion: 'desc' },
      }),
      this.prisma.formaPago.count(),
    ]);

    return {
      data: this.mapper.toResponseDtoList(formasPago),
      total,
      skip,
      take,
    };
  }

  async findById(id: number) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id_forma_pago: id },
    });

    if (!formaPago) {
      throw new NotFoundException(`Forma de pago con ID ${id} no encontrada`);
    }

    return this.mapper.toResponseDto(formaPago);
  }

  async findByNombre(nombre: string) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { nombre_forma: nombre },
    });

    if (!formaPago) {
      throw new NotFoundException(`Forma de pago ${nombre} no encontrada`);
    }

    return this.mapper.toResponseDto(formaPago);
  }

  async findActivas(skip = 0, take = 10) {
    const [formasPago, total] = await Promise.all([
      this.prisma.formaPago.findMany({
        where: { activa: true },
        skip,
        take,
        orderBy: { nombre_forma: 'asc' },
      }),
      this.prisma.formaPago.count({ where: { activa: true } }),
    ]);

    return {
      data: this.mapper.toResponseDtoList(formasPago),
      total,
      skip,
      take,
    };
  }

  async update(id: number, updateFormaPagoDto: UpdateFormaPagoDto) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id_forma_pago: id },
    });

    if (!formaPago) {
      throw new NotFoundException(`Forma de pago con ID ${id} no encontrada`);
    }

    const updatedFormaPago = await this.prisma.formaPago.update({
      where: { id_forma_pago: id },
      data: updateFormaPagoDto,
    });

    return this.mapper.toResponseDto(updatedFormaPago);
  }

  async remove(id: number) {
    const formaPago = await this.prisma.formaPago.findUnique({
      where: { id_forma_pago: id },
    });

    if (!formaPago) {
      throw new NotFoundException(`Forma de pago con ID ${id} no encontrada`);
    }

    await this.prisma.formaPago.delete({
      where: { id_forma_pago: id },
    });

    return { message: `Forma de pago ${formaPago.nombre_forma} eliminada exitosamente` };
  }
}
