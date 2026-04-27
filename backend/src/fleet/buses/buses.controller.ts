import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { BusesService } from './buses.service';
import { CreateBusDto, UpdateBusDto } from './dto/bus.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UserRole } from '../../iam/enums/user-role.enum';
import { CurrentUser } from '../../iam/auth/decorators/current-user.decorator';

@ApiTags('Buses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/buses')
export class BusesController {
  constructor(private readonly busesService: BusesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Registrar un bus nuevo (retorna token una sola vez)' })
  create(@Body() createDto: CreateBusDto, @CurrentUser() user: any) {
    return this.busesService.create(createDto, user);
  }

  @Post(':id/rotate-token')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Genera un nuevo token para el dispositivo GPS' })
  rotateToken(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.busesService.rotateToken(id, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Listar buses con paginación y filtros' })
  @ApiQuery({ name: 'status', required: false, description: 'Filtrar por ACTIVE, MAINTENANCE, OUT_OF_SERVICE' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@CurrentUser() user: any, @Query() query: any) {
    return this.busesService.findAll(user, query);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Obtener bus por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.busesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Actualizar info del bus' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateBusDto, @CurrentUser() user: any) {
    return this.busesService.update(id, updateDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Eliminar bus del sistema' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.busesService.remove(id, user);
  }
}
