import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TramitesService } from './tramites.service';
import { CreateTramiteDto } from './dto/create-tramite.dto';
import { UpdateTramiteDto } from './dto/update-tramite.dto';

@ApiTags('tramites')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('tramites')
export class TramitesController {
  constructor(private readonly tramitesService: TramitesService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Estadísticas por estado' })
  getStats() {
    return this.tramitesService.getStats();
  }

  @Get()
  @ApiOperation({ summary: 'Listar trámites con filtros y paginación' })
  @ApiQuery({ name: 'estado', required: false })
  @ApiQuery({ name: 'tipo', required: false })
  @ApiQuery({ name: 'fechaDesde', required: false })
  @ApiQuery({ name: 'fechaHasta', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('estado') estado?: string,
    @Query('tipo') tipo?: string,
    @Query('fechaDesde') fechaDesde?: string,
    @Query('fechaHasta') fechaHasta?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.tramitesService.findAll({
      estado, tipo, fechaDesde, fechaHasta,
      page: page ? +page : 1,
      limit: limit ? +limit : 10,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un trámite por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.tramitesService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo trámite' })
  @ApiResponse({ status: 201 })
  create(@Body() dto: CreateTramiteDto) {
    return this.tramitesService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar trámite' })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTramiteDto) {
    return this.tramitesService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar trámite' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.tramitesService.remove(id);
  }
}
