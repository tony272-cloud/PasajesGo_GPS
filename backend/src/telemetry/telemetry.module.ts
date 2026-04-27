import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BusPosition } from './entities/bus-position.entity';
import { Bus } from '../fleet/entities/bus.entity';
import { TelemetryService } from './telemetry.service';
import { TelemetryController } from './telemetry.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([BusPosition, Bus]),
  ],
  controllers: [TelemetryController],
  providers: [TelemetryService],
  exports: [TypeOrmModule, TelemetryService],
})
export class TelemetryModule {}
