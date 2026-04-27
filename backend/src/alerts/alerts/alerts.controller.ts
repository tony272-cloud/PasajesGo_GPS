import { Controller, Get, Patch, Param, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UserRole } from '../../iam/enums/user-role.enum';
import { CurrentUser } from '../../iam/auth/decorators/current-user.decorator';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Listar alertas con filtros' })
  @ApiQuery({ name: 'type', required: false })
  @ApiQuery({ name: 'busId', required: false })
  @ApiQuery({ name: 'status', enum: ['OPEN', 'RESOLVED'], required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@CurrentUser() user: any, @Query() query: any) {
    return this.alertsService.findAll(user, query);
  }

  @Patch(':id/resolve')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Marcar alerta como resuelta' })
  resolve(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.alertsService.markAsResolved(id, user);
  }
}
