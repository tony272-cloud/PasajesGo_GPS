import { Controller, Get, Post, Body, Param, Delete, UseGuards, ParseUUIDPipe, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto, ChangeRoleDto } from './dto/user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../enums/user-role.enum';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Crear un usuario nuevo' })
  create(@Body() createDto: CreateUserDto, @CurrentUser() user: any) {
    return this.usersService.create(createDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Listar usuarios (filtrado automáticamente por org si no es SUPERADMIN)' })
  findAll(@CurrentUser() user: any) {
    return this.usersService.findAll(user);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Obtener usuario por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.usersService.findOne(id, user);
  }

  @Patch(':id/role')
  @Roles(UserRole.SUPERADMIN)
  @ApiOperation({ summary: 'Cambiar rol de un usuario (Solo SUPERADMIN)' })
  changeRole(@Param('id', ParseUUIDPipe) id: string, @Body() changeRoleDto: ChangeRoleDto) {
    return this.usersService.changeRole(id, changeRoleDto);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN)
  @ApiOperation({ summary: 'Desactivar un usuario (Soft Delete)' })
  remove(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.usersService.remove(id, user);
  }
}
