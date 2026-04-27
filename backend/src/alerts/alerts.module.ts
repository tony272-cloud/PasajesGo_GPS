import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geofence } from './entities/geofence.entity';
import { Alert } from './entities/alert.entity';
import { GeofencesService } from './geofences/geofences.service';
import { GeofencesController } from './geofences/geofences.controller';
import { AlertsService } from './alerts/alerts.service';
import { AlertsController } from './alerts/alerts.controller';
import { AlertEngineService } from './alert-engine.service';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Geofence, Alert]),
    RedisModule,
  ],
  controllers: [GeofencesController, AlertsController],
  providers: [GeofencesService, AlertsService, AlertEngineService],
  exports: [TypeOrmModule, GeofencesService, AlertsService, AlertEngineService],
})
export class AlertsModule {}
