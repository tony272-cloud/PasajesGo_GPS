import { Controller, Get, Post, Body, Patch, Param, UseGuards, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TripsService } from './trips.service';
import { StartTripDto, EndTripDto } from './dto/trip.dto';
import { JwtAuthGuard } from '../../iam/auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../iam/auth/guards/roles.guard';
import { Roles } from '../../iam/auth/decorators/roles.decorator';
import { UserRole } from '../../iam/enums/user-role.enum';
import { CurrentUser } from '../../iam/auth/decorators/current-user.decorator';
import { TripStatus } from '../enums/trip-status.enum';

@ApiTags('Trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('api/v1/trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post('start')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Iniciar un viaje validando que el bus y conductor no estén en curso' })
  startTrip(@Body() startDto: StartTripDto, @CurrentUser() user: any) {
    return this.tripsService.startTrip(startDto, user);
  }

  @Patch(':id/end')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.DRIVER)
  @ApiOperation({ summary: 'Finalizar un viaje y calcular métricas' })
  endTrip(@Param('id', ParseUUIDPipe) id: string, @Body() endDto: EndTripDto, @CurrentUser() user: any) {
    return this.tripsService.endTrip(id, endDto, user);
  }

  @Get()
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Historial de viajes con filtros' })
  @ApiQuery({ name: 'busId', required: false })
  @ApiQuery({ name: 'routeId', required: false })
  @ApiQuery({ name: 'driverId', required: false })
  @ApiQuery({ name: 'status', enum: TripStatus, required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  findAll(@CurrentUser() user: any, @Query() query: any) {
    return this.tripsService.findAll(user, query);
  }

  @Get(':id')
  @Roles(UserRole.SUPERADMIN, UserRole.ORG_ADMIN, UserRole.OPERATOR)
  @ApiOperation({ summary: 'Detalle de un viaje' })
  findOne(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.tripsService.findOne(id, user);
  }
}
