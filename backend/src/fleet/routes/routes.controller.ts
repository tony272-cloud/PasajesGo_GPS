import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoutesService } from './routes.service';
import { CreateRouteDto, ReorderStopsDto } from './dto/route.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UserRole } from '../../iam/enums/user-role.enum';
import { CurrentUser } from '../../iam/auth/decorators/current-user.decorator';

@ApiTags('Routes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/routes')
export class RoutesController {
  constructor(private readonly routesService: RoutesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Crear ruta, con paradas y polilínea opcional' })
  create(@Body() createRouteDto: CreateRouteDto, @CurrentUser() user: any) {
    return this.routesService.create(createRouteDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Listar todas las rutas activas' })
  findAll(@CurrentUser() user: any) {
    return this.routesService.findAll(user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR, UserRole.DRIVER)
  @ApiOperation({ summary: 'Detalle de la ruta con paradas y trayecto en GeoJSON' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.routesService.findOne(id, user);
  }

  @Patch(':id/stops/reorder')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Reordenar secuencialmente paradas de una ruta' })
  reorderStops(@Param('id', ParseUUIDPipe) id: string, @Body() reorderDto: ReorderStopsDto, @CurrentUser() user: any) {
    return this.routesService.reorderStops(id, reorderDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Desactivar ruta (Soft Delete)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.routesService.remove(id, user);
  }
}
