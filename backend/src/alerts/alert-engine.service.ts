import { Injectable, Inject, Logger, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Geofence } from './entities/geofence.entity';
import { Alert } from './entities/alert.entity';
import { AlertType } from './enums/alert-type.enum';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';

@Injectable()
export class AlertEngineService implements OnModuleInit, OnModuleDestroy {
  private logger = new Logger('AlertEngineService');
  private subscriber: Redis;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    @InjectRepository(Geofence) private readonly geofenceRepo: Repository<Geofence>,
    @InjectRepository(Alert) private readonly alertRepo: Repository<Alert>,
    private readonly dataSource: DataSource,
  ) {
    this.subscriber = this.redisClient.duplicate();
  }

  onModuleInit() {
    this.subscriber.subscribe('telemetry:bus_position', (err) => {
      if (err) this.logger.error(`Error subscribing to telemetry: ${err.message}`);
      else this.logger.log('Alert Engine subscribed to telemetry stream');
    });

    this.subscriber.on('message', async (channel, message) => {
      if (channel === 'telemetry:bus_position') {
        try {
          const payload = JSON.parse(message);
          if (payload.event === 'bus:position') {
            await this.processTelemetry(payload.data);
          }
        } catch (e) {
          this.logger.error(`Error processing telemetry message: ${e.message}`);
        }
      }
    });
  }

  onModuleDestroy() {
    this.subscriber.disconnect();
  }

  private async processTelemetry(data: { busId: string, orgId: string, tripId?: string, lat: number, lng: number, speed: number, ts: string }) {
    // Basic Overspeeding Rule (Hardcoded 90km/h for MVP)
    if (data.speed > 90) {
      await this.triggerAlertIfNew(
        data.busId, 
        data.orgId, 
        'SPEEDING', 
        `Exceso de Velocidad: ${data.speed} km/h`, 
        data.lat, 
        data.lng,
        data.tripId
      );
    } else {
      // Clear speeding state if below 90
      await this.redisClient.del(`alert:state:${data.busId}:SPEEDING`);
    }

    // Geofencing intersection check using PostGIS
    // Fetch all active geofences for this organization
    // Query builder to check ST_Intersects
    const intersectedFences = await this.geofenceRepo.createQueryBuilder('g')
      .where('g.organization_id = :orgId', { orgId: data.orgId })
      .andWhere(`ST_Intersects(g.geom::geometry, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326))`, { 
        lng: data.lng, 
        lat: data.lat 
      })
      .getMany();

    const currentFencesIds = intersectedFences.map(f => f.id);

    // Get previous state from Redis to detect transitions (Enter / Exit)
    const stateKey = `bus:${data.busId}:geofences`;
    const previousStateRaw = await this.redisClient.get(stateKey);
    const previousFencesIds: string[] = previousStateRaw ? JSON.parse(previousStateRaw) : [];

    // Analyze transitions
    for (const fence of intersectedFences) {
      if (!previousFencesIds.includes(fence.id)) {
        // ENTERED GEOFENCE
        if (fence.alertType === AlertType.GEOFENCE_ENTER) {
          await this.triggerAlert(data.busId, data.orgId, AlertType.GEOFENCE_ENTER, `Entró a zona restringida: ${fence.name}`, data.lat, data.lng, data.tripId);
        }
      }
    }

    // Check for exits (was in previous, not in current)
    for (const prevId of previousFencesIds) {
      if (!currentFencesIds.includes(prevId)) {
        // Find the fence to get its name and config
        const fence = await this.geofenceRepo.findOne({ where: { id: prevId }});
        if (fence && fence.alertType === AlertType.GEOFENCE_EXIT) {
          await this.triggerAlert(data.busId, data.orgId, AlertType.GEOFENCE_EXIT, `Salió de zona designada: ${fence.name}`, data.lat, data.lng, data.tripId);
        }
      }
    }

    // Save current state for next processing tick
    await this.redisClient.set(stateKey, JSON.stringify(currentFencesIds));
  }

  /**
   * Triggers an alert only if one isn't already active to prevent spam
   */
  private async triggerAlertIfNew(busId: string, orgId: string, alertType: string, msg: string, lat: number, lng: number, tripId?: string) {
    const key = `alert:state:${busId}:${alertType}`;
    const active = await this.redisClient.get(key);
    if (!active) {
      await this.triggerAlert(busId, orgId, alertType as AlertType, msg, lat, lng, tripId);
      // Set a cooloff period or flag meaning "currently speeding"
      // We set it to 1, and only clear it when speed drops below threshold
      await this.redisClient.set(key, '1');
    }
  }

  private async triggerAlert(busId: string, orgId: string, type: AlertType, message: string, lat: number, lng: number, tripId?: string) {
    this.logger.warn(`ALERT [${type}]: Bus ${busId} - ${message}`);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    
    try {
        const result = await queryRunner.manager.query(`
          INSERT INTO alerts (organization_id, bus_id, trip_id, type, message, geom)
          VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))
          RETURNING *;
        `, [
          orgId, 
          busId, 
          tripId || null, 
          type, 
          message,
          lng,
          lat
        ]);

        const savedAlert = result[0];

        // Broadcast alert directly to all frontend clients through Redis Pub/Sub
        await this.redisClient.publish('telemetry:bus_position', JSON.stringify({
          event: 'alert:new',
          data: {
            id: savedAlert.id,
            busId,
            type,
            message,
            lat,
            lng,
            ts: savedAlert.ts
          }
        }));

    } catch (e) {
      this.logger.error(`Error saving alert: ${e.message}`);
    } finally {
        await queryRunner.release();
    }
  }
}
