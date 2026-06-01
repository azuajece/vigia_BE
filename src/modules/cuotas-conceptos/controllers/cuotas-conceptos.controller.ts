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
import { CuotasConceptosService } from '../services/cuotas-conceptos.service';
import {
  CreateCuotaConceptoDto,
  UpdateCuotaConceptoDto,
  CuotaConceptoResponseDto,
} from '../dto/cuota-concepto.dto';

@ApiTags('Cuotas por Concepto')
@Controller('cuotas-conceptos')
export class CuotasConceptosController {
  constructor(private readonly cuotasConceptosService: CuotasConceptosService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva cuota por concepto' })
  @ApiResponse({
    status: 201,
    description: 'Cuota por concepto creada exitosamente',
    type: CuotaConceptoResponseDto,
  })
  create(@Body() createCuotaConceptoDto: CreateCuotaConceptoDto) {
    return this.cuotasConceptosService.create(createCuotaConceptoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de cuotas por concepto' })
  @ApiResponse({
    status: 200,
    description: 'Lista de cuotas por concepto obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasConceptosService.findAll(skip, take);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener cuota por concepto por ID' })
  @ApiResponse({
    status: 200,
    description: 'Cuota por concepto encontrada',
    type: CuotaConceptoResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.cuotasConceptosService.findById(id);
  }

  @Get('jugador/:id_jugador')
  @ApiOperation({ summary: 'Obtener cuotas por concepto de un jugador' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas por concepto del jugador obtenidas',
  })
  findByJugador(
    @Param('id_jugador') id_jugador: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasConceptosService.findByJugador(id_jugador, skip, take);
  }

  @Get('concepto/:id_concepto')
  @ApiOperation({ summary: 'Obtener cuotas por un concepto específico' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas obtenidas',
  })
  findByConcepto(
    @Param('id_concepto') id_concepto: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasConceptosService.findByConcepto(id_concepto, skip, take);
  }

  @Get('anio/:anio')
  @ApiOperation({ summary: 'Obtener cuotas por concepto de un año' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas por concepto del año obtenidas',
  })
  findByYear(
    @Param('anio') anio: number,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasConceptosService.findByYear(anio, skip, take);
  }

  @Get('pendientes/list')
  @ApiOperation({ summary: 'Obtener cuotas por concepto pendientes de pago' })
  @ApiResponse({
    status: 200,
    description: 'Cuotas pendientes obtenidas',
  })
  findPendientes(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.cuotasConceptosService.findPendientes(skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar cuota por concepto' })
  @ApiResponse({
    status: 200,
    description: 'Cuota por concepto actualizada exitosamente',
    type: CuotaConceptoResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateCuotaConceptoDto: UpdateCuotaConceptoDto,
  ) {
    return this.cuotasConceptosService.update(id, updateCuotaConceptoDto);
  }

  @Put(':id/marcar-pagada')
  @ApiOperation({ summary: 'Marcar cuota por concepto como pagada' })
  @ApiResponse({
    status: 200,
    description: 'Cuota marcada como pagada',
    type: CuotaConceptoResponseDto,
  })
  marcarComoPagada(@Param('id') id: number) {
    return this.cuotasConceptosService.marcarComoPagada(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar cuota por concepto' })
  @ApiResponse({
    status: 204,
    description: 'Cuota por concepto eliminada exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.cuotasConceptosService.remove(id);
  }
}
