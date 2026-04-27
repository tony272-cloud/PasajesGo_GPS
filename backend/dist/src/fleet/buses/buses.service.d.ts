import { Repository } from 'typeorm';
import { Bus } from '../entities/bus.entity';
import { CreateBusDto, UpdateBusDto } from './dto/bus.dto';
export declare class BusesService {
    private readonly busRepository;
    constructor(busRepository: Repository<Bus>);
    private generateToken;
    create(createDto: CreateBusDto, currentUser: any): Promise<{
        deviceToken: string;
        id: string;
        organizationId: string;
        organization: import("../../iam/entities/organization.entity").Organization;
        plate: string;
        model: string;
        capacity: number;
        deviceTokenHash: string;
        status: import("../enums/bus-status.enum").BusStatus;
        createdAt: Date;
    }>;
    rotateToken(id: string, currentUser: any): Promise<{
        message: string;
        newDeviceToken: string;
    }>;
    findAll(currentUser: any, query: any): Promise<Bus[]>;
    findOne(id: string, currentUser: any): Promise<Bus>;
    update(id: string, updateDto: UpdateBusDto, currentUser: any): Promise<Bus>;
    remove(id: string, currentUser: any): Promise<void>;
}
