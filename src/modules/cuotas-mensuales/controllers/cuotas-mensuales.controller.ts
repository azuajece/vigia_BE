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
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CuotasMensualesService } from '../services/cuotas-mensuales.service';
import {
  CreateCuotaMensualDetalleDto,
  UpdateCuotaMensualDetalleDto,
  CuotaMensualDetalleResponseDto,
} from '../dto/cuota-mensual-detalle.dto';

@ApiTags('Cuotas Mensuales')
@Controller('cuotas-mensuales')
export class CuotasMensualesController {
  constructor(private readonly cuotasMensualesService: CuotasMensualesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva cuota mensual' })
  @ApiResponse({
    status: 201,
    description: 'Cuota mensual creada exitosamente',
    type: CuotaMensualDetalleResponseDto,
  })
  create(@Body() createCuotaMensualDetalleDto: CreateCuotaMensualDetalleDto) {
    return this.cuotasMensualesService.create(createCuotaMensualDetalleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de cuotas mensuales' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuotas mensuales obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasMensualesService.findAll(skip, take);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener cuota mensual por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cuota mensual encontrada',
    type: CuotaMensualDetalleResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.cuotasMensualesService.findById(id);
  }

  @Get('jugador/:id_jugador')
  @ApiOperation({ summary: 'Obtener cuotas mensuales de un jugador' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas mensuales del jugador obtenidas',
  })
  findByJugador(
    @Param('id_jugador') id_jugador: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasMensualesService.findByJugador(id_jugador, skip, take);
  }

  @Get('mes-anio/:mes/:anio')
  @ApiOperation({ summary: 'Obtener cuotas mensuales por mes y año' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas mensuales obtenidas',
  })
  findByMesAnio(
    @Param('mes') mes: number,
    @Param('anio') anio: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasMensualesService.findByMesAnio(mes, anio, skip, take);
  }

  @Get('anio/:anio')
  @ApiOperation({ summary: 'Obtener cuotas mensuales de un año' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas mensuales del año obtenidas',
  })
  findByYear(
    @Param('anio') anio: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasMensualesService.findByYear(anio, skip, take);
  }

  @Get('pendientes/list')
  @ApiOperation({ summary: 'Obtener cuotas mensuales pendientes de pago' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas pendientes obtenidas',
  })
  findPendientes(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasMensualesService.findPendientes(skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cuota mensual' })
  @ApiResponse({
    status: 200,
    description: 'Cuota mensual actualizada exitosamente',
    type: CuotaMensualDetalleResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateCuotaMensualDetalleDto: UpdateCuotaMensualDetalleDto,
  ) {
    return this.cuotasMensualesService.update(id, updateCuotaMensualDetalleDto);
  }

  @Put(':id/marcar-pagada')
  @ApiOperation({ summary: 'Marcar cuota mensual como pagada' })
  @ApiResponse({
    status: 200,
    description: 'Cuota marcada como pagada',
    type: CuotaMensualDetalleResponseDto,
  })
  marcarComoPagada(@Param('id') id: number) {
    return this.cuotasMensualesService.marcarComoPagada(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar cuota mensual' })
  @ApiResponse({
    status: 204,
    description: 'Cuota mensual eliminada exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.cuotasMensualesService.remove(id);
  }
}
