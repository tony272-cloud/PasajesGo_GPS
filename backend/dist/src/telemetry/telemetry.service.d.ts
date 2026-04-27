import { Repository, DataSource } from 'typeorm';
import { BusPosition } from './entities/bus-position.entity';
import { TelemetryBatchDto } from './dto/telemetry.dto';
import { Bus } from '../fleet/entities/bus.entity';
import Redis from 'ioredis';
export declare class TelemetryService {
    private readonly positionRepository;
    private readonly busRepository;
    private readonly redis;
    private readonly dataSource;
    constructor(positionRepository: Repository<BusPosition>, busRepository: Repository<Bus>, redis: Redis, dataSource: DataSource);
    ingestBatch(deviceToken: string, batchUrl: TelemetryBatchDto): Promise<{
        inserted: number;
    }>;
}
