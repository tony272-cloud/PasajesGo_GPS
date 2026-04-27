import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { BusPosition } from './entities/bus-position.entity';
import { TelemetryBatchDto } from './dto/telemetry.dto';
import { Bus } from '../fleet/entities/bus.entity';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import * as crypto from 'crypto';

@Injectable()
export class TelemetryService {
  constructor(
    @InjectRepository(BusPosition)
    private readonly positionRepository: Repository<BusPosition>,
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
    private readonly dataSource: DataSource,
  ) {}

  async ingestBatch(deviceToken: string, batchUrl: TelemetryBatchDto) {
    // 1. Authenticate Device Context via Token
    const hash = crypto.createHash('sha256').update(deviceToken).digest('hex');
    const bus = await this.busRepository.findOne({ where: { deviceTokenHash: hash, id: batchUrl.busId } });
    
    if (!bus) {
      throw new UnauthorizedException('Token de dispositivo inválido para este bus');
    }

    // 2. Filter & Validate Positions
    // Descartar precisión pobre (accuracy > 50m) según requerimientos, o if not provided accept
    const validPositions = batchUrl.positions.filter(
      p => p.accuracyM === undefined || p.accuracyM <= 50
    );

    if (validPositions.length === 0) return { inserted: 0 };
    
    // Convert to Entity array
    const newPositions = validPositions.map(p => {
      const pos = new BusPosition();
      // Need ID since we mapped as BigInt but DB uses BIGSERIAL? 
      // Actually DB uses BIGSERIAL and primary key (id, ts)
      pos.ts = p.ts;
      pos.busId = bus.id;
      pos.tripId = batchUrl.tripId || null as any;
      
      // Use GeoJSON object for TypeORM geometry column
      pos.geom = {
        type: 'Point',
        coordinates: [p.lng, p.lat]
      } as any;
      
      pos.speedKmh = p.speedKmh as number;
      pos.headingDeg = p.headingDeg as number;
      pos.accuracyM = p.accuracyM as number;
      return pos;
    });

    try {
      await this.positionRepository
        .createQueryBuilder()
        .insert()
        .into(BusPosition)
        .values(newPositions)
        .execute();

      // 4. Redis Publish latest position and Cache
      // We only care about the latest one in the batch for Real-time
      const latestPos = validPositions.reduce((latest, current) => 
        new Date(current.ts) > new Date(latest.ts) ? current : latest
      );

      const redisPayload = {
        busId: bus.id,
        orgId: bus.organizationId,
        tripId: batchUrl.tripId,
        lat: latestPos.lat,
        lng: latestPos.lng,
        speed: latestPos.speedKmh,
        heading: latestPos.headingDeg,
        ts: latestPos.ts,
      };

      // Cache latest position
      await this.redis.set(`bus:${bus.id}:latest`, JSON.stringify(redisPayload));

      // Publish to Pub/Sub
      await this.redis.publish('telemetry:bus_position', JSON.stringify({
        event: 'bus:position',
        data: redisPayload
      }));

    } catch (e) {
      console.error('Error inserting telemetry', e);
      throw e;
    }

    return { inserted: validPositions.length };
  }
}
