import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';

@ApiTags('Organizations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Crear una organización (Solo SUPERADMIN)' })
  create(@Body() createDto: CreateOrganizationDto) {
    return this.organizationsService.create(createDto);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Listar organizaciones activas (Solo SUPERADMIN)' })
  findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Obtener detalles de una organización' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Actualizar organización (Solo SUPERADMIN)' })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateOrganizationDto) {
    return this.organizationsService.update(id, updateDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Eliminar organización (Soft delete, Solo SUPERADMIN)' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.organizationsService.remove(id);
  }
}
