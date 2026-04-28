import { OnModuleInit } from '@nestjs/common';
import { DataSource } from 'typeorm';
export declare class PartitionMaintenanceService implements OnModuleInit {
    private readonly dataSource;
    private readonly logger;
    constructor(dataSource: DataSource);
    onModuleInit(): Promise<void>;
    handleMonthlyMaintenance(): Promise<void>;
    ensurePartitions(): Promise<void>;
    private createPartitionForMonth;
}
