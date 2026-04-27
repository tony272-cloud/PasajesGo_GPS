import { OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Geofence } from './entities/geofence.entity';
import { Alert } from './entities/alert.entity';
import Redis from 'ioredis';
export declare class AlertEngineService implements OnModuleInit, OnModuleDestroy {
    private readonly redisClient;
    private readonly geofenceRepo;
    private readonly alertRepo;
    private readonly dataSource;
    private logger;
    private subscriber;
    constructor(redisClient: Redis, geofenceRepo: Repository<Geofence>, alertRepo: Repository<Alert>, dataSource: DataSource);
    onModuleInit(): void;
    onModuleDestroy(): void;
    private processTelemetry;
    private triggerAlertIfNew;
    private triggerAlert;
}
