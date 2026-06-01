import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { IngresosService } from '../services/ingresos.service';
import {
  CreateIngresoDto,
  UpdateIngresoDto,
  IngresoResponseDto,
} from '../dto/ingreso.dto';

@ApiTags('Ingresos/Pagos')
@Controller('ingresos')
export class IngresosController {
  constructor(private readonly ingresosService: IngresosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar un nuevo ingreso/pago' })
  @ApiResponse({
    status: 201,
    description: 'Ingreso registrado exitosamente',
    type: IngresoResponseDto,
  })
  create(@Body() createIngresoDto: CreateIngresoDto) {
    return this.ingresosService.create(createIngresoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de ingresos/pagos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de ingresos obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.ingresosService.findAll(skip, take);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener ingreso por ID' })
  @ApiResponse({
    status: 200,
    description: 'Ingreso encontrado',
    type: IngresoResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.ingresosService.findById(id);
  }

  @Get('jugador/:id_jugador')
  @ApiOperation({ summary: 'Obtener ingresos de un jugador' })
  @ApiResponse({
    status: 200,
    description: 'Ingresos del jugador obtenidos',
  })
  findByJugador(
    @Param('id_jugador') id_jugador: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.ingresosService.findByJugador(id_jugador, skip, take);
  }

  @Get('referencia/:referencia')
  @ApiOperation({ summary: 'Obtener ingresos por referencia' })
  @ApiResponse({
    status: 200,
    description: 'Ingresos encontrados',
  })
  findByReferencia(
    @Param('referencia') referencia: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.ingresosService.findByReferencia(referencia, skip, take);
  }

  @Get('fecha-rango/:fechaInicio/:fechaFin')
  @ApiOperation({ summary: 'Obtener ingresos por rango de fechas' })
  @ApiResponse({
    status: 200,
    description: 'Ingresos en el rango obtenidos',
  })
  findByFechaPago(
    @Param('fechaInicio') fechaInicio: string,
    @Param('fechaFin') fechaFin: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.ingresosService.findByFechaPago(
      new Date(fechaInicio),
      new Date(fechaFin),
      skip,
      take,
    );
  }

  @Get('forma-pago/:id_forma_pago')
  @ApiOperation({ summary: 'Obtener ingresos por forma de pago' })
  @ApiResponse({
    status: 200,
    description: 'Ingresos obtenidos',
  })
  findByFormaPago(
    @Param('id_forma_pago') id_forma_pago: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.ingresosService.findByFormaPago(id_forma_pago, skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar ingreso' })
  @ApiResponse({
    status: 200,
    description: 'Ingreso actualizado exitosamente',
    type: IngresoResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateIngresoDto: UpdateIngresoDto,
  ) {
    return this.ingresosService.update(id, updateIngresoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar ingreso' })
  @ApiResponse({
    status: 204,
    description: 'Ingreso eliminado exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.ingresosService.remove(id);
  }

  @Get('totales/:id_jugador')
  @ApiOperation({ summary: 'Obtener ingresos totales por jugador' })
  @ApiResponse({
    status: 200,
    description: 'Totales obtenidos',
  })
  getIngresosTotalesPorJugador(@Param('id_jugador') id_jugador: number) {
    return this.ingresosService.getIngresosTotalesPorJugador(id_jugador);
  }
}
