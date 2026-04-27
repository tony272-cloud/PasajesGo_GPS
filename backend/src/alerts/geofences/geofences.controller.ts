import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GeofencesService } from './geofences.service';
import { CreateGeofenceDto, UpdateGeofenceDto } from './dto/geofence.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UserRole } from '../../iam/enums/user-role.enum';
import { CurrentUser } from '../../iam/auth/decorators/current-user.decorator';

@ApiTags('Geofences')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/geofences')
export class GeofencesController {
  constructor(private readonly geofencesService: GeofencesService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Crear geocerca poligonal' })
  create(@Body() createDto: CreateGeofenceDto, @CurrentUser() user: any) {
    return this.geofencesService.create(createDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Listar todas las geocercas' })
  findAll(@CurrentUser() user: any) {
    return this.geofencesService.findAll(user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Detalle de geocerca' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.geofencesService.findOne(id, user);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Editar geocerca' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateGeofenceDto, @CurrentUser() user: any) {
    return this.geofencesService.update(id, updateDto, user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Eliminar geocerca' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.geofencesService.remove(id, user);
  }
}
