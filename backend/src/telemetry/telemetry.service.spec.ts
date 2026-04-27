import { Test, TestingModule } from '@nestjs/testing';
import { TelemetryService } from './telemetry.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BusPosition } from './entities/bus-position.entity';
import { Bus } from '../fleet/entities/bus.entity';
import { REDIS_CLIENT } from '../redis/redis.module';
import { DataSource } from 'typeorm';

describe('TelemetryService', () => {
  let service: TelemetryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TelemetryService,
        {
          provide: getRepositoryToken(BusPosition),
          useValue: {
            createQueryBuilder: jest.fn(() => ({
              insert: jest.fn().mockReturnThis(),
              into: jest.fn().mockReturnThis(),
              values: jest.fn().mockReturnThis(),
              orIgnore: jest.fn().mockReturnThis(),
              execute: jest.fn().mockResolvedValue({}),
            })),
          },
        },
        {
          provide: getRepositoryToken(Bus),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: REDIS_CLIENT,
          useValue: {
            set: jest.fn(),
            publish: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TelemetryService>(TelemetryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
