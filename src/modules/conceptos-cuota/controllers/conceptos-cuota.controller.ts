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
import { ConceptosCuotaService } from '../services/conceptos-cuota.service';
import {
  CreateConceptoCuotaDto,
  UpdateConceptoCuotaDto,
  ConceptoCuotaResponseDto,
} from '../dto/concepto-cuota.dto';

@ApiTags('Conceptos de Cuota')
@Controller('conceptos-cuota')
export class ConceptosCuotaController {
  constructor(private readonly conceptosCuotaService: ConceptosCuotaService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo concepto de cuota' })
  @ApiResponse({
    status: 201,
    description: 'Concepto de cuota creado exitosamente',
    type: ConceptoCuotaResponseDto,
  })
  create(@Body() createConceptoCuotaDto: CreateConceptoCuotaDto) {
    return this.conceptosCuotaService.create(createConceptoCuotaDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de conceptos de cuota' })
  @ApiResponse({
    status: 200,
    description: 'Lista de conceptos de cuota obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.conceptosCuotaService.findAll(skip, take);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener concepto de cuota por ID' })
  @ApiResponse({
    status: 200,
    description: 'Concepto de cuota encontrado',
    type: ConceptoCuotaResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.conceptosCuotaService.findById(id);
  }

  @Get('nombre/:nombre')
  @ApiOperation({ summary: 'Obtener concepto de cuota por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Concepto de cuota encontrado',
    type: ConceptoCuotaResponseDto,
  })
  findByNombre(@Param('nombre') nombre: string) {
    return this.conceptosCuotaService.findByNombre(nombre);
  }

  @Get('activos/list')
  @ApiOperation({ summary: 'Obtener conceptos de cuota activos' })
  @ApiResponse({
    status: 200,
    description: 'Conceptos de cuota activos obtenidos',
  })
  findActivos(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.conceptosCuotaService.findActivos(skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar concepto de cuota' })
  @ApiResponse({
    status: 200,
    description: 'Concepto de cuota actualizado exitosamente',
    type: ConceptoCuotaResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateConceptoCuotaDto: UpdateConceptoCuotaDto,
  ) {
    return this.conceptosCuotaService.update(id, updateConceptoCuotaDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar concepto de cuota' })
  @ApiResponse({
    status: 204,
    description: 'Concepto de cuota eliminado exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.conceptosCuotaService.remove(id);
  }
}
