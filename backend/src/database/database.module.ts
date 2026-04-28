import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PartitionMaintenanceService } from './partition-maintenance.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: false, // We use migrations for DB schema
        logging: process.env.NODE_ENV === 'development',
      }),
    }),
  ],
  providers: [PartitionMaintenanceService],
})
export class DatabaseModule {}
