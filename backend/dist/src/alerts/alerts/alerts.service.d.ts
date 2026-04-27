import { DataSource, Repository } from 'typeorm';
import { Alert } from '../entities/alert.entity';
import { CreateAlertDto } from './dto/alert.dto';
export declare class AlertsService {
    private readonly alertRepository;
    private readonly dataSource;
    constructor(alertRepository: Repository<Alert>, dataSource: DataSource);
    create(createDto: CreateAlertDto): Promise<any>;
    findAll(currentUser: any, query: any): Promise<{
        data: Alert[];
        total: number;
        page: any;
        limit: number;
    }>;
    markAsResolved(id: string, currentUser: any): Promise<Alert>;
}
