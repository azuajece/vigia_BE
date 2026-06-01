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
import { FormasPagoService } from '../services/formas-pago.service';
import {
  CreateFormaPagoDto,
  UpdateFormaPagoDto,
  FormaPagoResponseDto,
} from '../dto/forma-pago.dto';

@ApiTags('Formas de Pago')
@Controller('formas-pago')
export class FormasPagoController {
  constructor(private readonly formasPagoService: FormasPagoService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva forma de pago' })
  @ApiResponse({
    status: 201,
    description: 'Forma de pago creada exitosamente',
    type: FormaPagoResponseDto,
  })
  create(@Body() createFormaPagoDto: CreateFormaPagoDto) {
    return this.formasPagoService.create(createFormaPagoDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de formas de pago' })
  @ApiResponse({
    status: 200,
    description: 'Lista de formas de pago obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.formasPagoService.findAll(skip, take);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener forma de pago por ID' })
  @ApiResponse({
    status: 200,
    description: 'Forma de pago encontrada',
    type: FormaPagoResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.formasPagoService.findById(id);
  }

  @Get('nombre/:nombre')
  @ApiOperation({ summary: 'Obtener forma de pago por nombre' })
  @ApiResponse({
    status: 200,
    description: 'Forma de pago encontrada',
    type: FormaPagoResponseDto,
  })
  findByNombre(@Param('nombre') nombre: string) {
    return this.formasPagoService.findByNombre(nombre);
  }

  @Get('activas/list')
  @ApiOperation({ summary: 'Obtener formas de pago activas' })
  @ApiResponse({
    status: 200,
    description: 'Formas de pago activas obtenidas',
  })
  findActivas(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.formasPagoService.findActivas(skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar forma de pago' })
  @ApiResponse({
    status: 200,
    description: 'Forma de pago actualizada exitosamente',
    type: FormaPagoResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateFormaPagoDto: UpdateFormaPagoDto,
  ) {
    return this.formasPagoService.update(id, updateFormaPagoDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar forma de pago' })
  @ApiResponse({
    status: 204,
    description: 'Forma de pago eliminada exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.formasPagoService.remove(id);
  }
}
