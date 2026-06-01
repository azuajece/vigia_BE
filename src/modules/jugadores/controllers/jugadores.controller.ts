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
import { JugadoresService } from '../services/jugadores.service';
import { CreateJugadorDto, UpdateJugadorDto, JugadorResponseDto } from '../dto/jugador.dto';

@ApiTags('Jugadores')
@Controller('jugadores')
export class JugadoresController {
  constructor(private readonly jugadoresService: JugadoresService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo jugador' })
  @ApiResponse({
    status: 201,
    description: 'Jugador creado exitosamente',
    type: JugadorResponseDto,
  })
  create(@Body() createJugadorDto: CreateJugadorDto) {
    return this.jugadoresService.create(createJugadorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener lista de jugadores' })
  @ApiResponse({
    status: 200,
    description: 'Lista de jugadores obtenida',
  })
  findAll(
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.jugadoresService.findAll(skip, take);
  }

  @Get('cedula/:cedula')
  @ApiOperation({ summary: 'Obtener jugador por cédula' })
  @ApiResponse({
    status: 200,
    description: 'Jugador encontrado',
    type: JugadorResponseDto,
  })
  findByCedula(@Param('cedula') cedula: string) {
    return this.jugadoresService.findByCedula(cedula);
  }

  @Get('id/:id')
  @ApiOperation({ summary: 'Obtener jugador por ID' })
  @ApiResponse({
    status: 200,
    description: 'Jugador encontrado',
    type: JugadorResponseDto,
  })
  findById(@Param('id') id: number) {
    return this.jugadoresService.findById(id);
  }

  @Get('categoria/:categoria')
  @ApiOperation({ summary: 'Obtener jugadores por categoría' })
  @ApiResponse({
    status: 200,
    description: 'Jugadores encontrados',
  })
  findByCategoria(
    @Param('categoria') categoria: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.jugadoresService.findByCategoria(categoria, skip, take);
  }

  @Get('status/:status')
  @ApiOperation({ summary: 'Obtener jugadores por estado' })
  @ApiResponse({
    status: 200,
    description: 'Jugadores encontrados',
  })
  findByStatus(
    @Param('status') status: string,
    @Query('skip') skip?: number,
    @Query('take') take?: number,
  ) {
    return this.jugadoresService.findByStatus(status, skip, take);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar jugador' })
  @ApiResponse({
    status: 200,
    description: 'Jugador actualizado exitosamente',
    type: JugadorResponseDto,
  })
  update(
    @Param('id') id: number,
    @Body() updateJugadorDto: UpdateJugadorDto,
  ) {
    return this.jugadoresService.update(id, updateJugadorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar jugador' })
  @ApiResponse({
    status: 204,
    description: 'Jugador eliminado exitosamente',
  })
  remove(@Param('id') id: number) {
    return this.jugadoresService.remove(id);
  }

  @Get(':id/estado-cuenta')
  @ApiOperation({ summary: 'Obtener estado de cuenta del jugador' })
  @ApiResponse({
    status: 200,
    description: 'Estado de cuenta obtenido',
  })
  getEstadoCuenta(@Param('id') id: number) {
    return this.jugadoresService.getEstadoCuenta(id);
  }
}
