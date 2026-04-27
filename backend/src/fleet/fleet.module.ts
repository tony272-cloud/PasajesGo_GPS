import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bus } from './entities/bus.entity';
import { Route } from './entities/route.entity';
import { Stop } from './entities/stop.entity';
import { RoutePath } from './entities/route-path.entity';
import { Trip } from './entities/trip.entity';
import { TelemetryModule } from '../telemetry/telemetry.module';
import { BusesService } from './buses/buses.service';
import { BusesController } from './buses/buses.controller';
import { RoutesService } from './routes/routes.service';
import { RoutesController } from './routes/routes.controller';
import { TripsService } from './trips/trips.service';
import { TripsController } from './trips/trips.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Bus, Route, Stop, RoutePath, Trip]),
    TelemetryModule,
  ],
  controllers: [BusesController, RoutesController, TripsController],
  providers: [BusesService, RoutesService, TripsService],
  exports: [TypeOrmModule, BusesService, RoutesService, TripsService],
})
export class FleetModule {}
