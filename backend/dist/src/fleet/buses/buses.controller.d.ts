import { BusesService } from './buses.service';
import { CreateBusDto, UpdateBusDto } from './dto/bus.dto';
export declare class BusesController {
    private readonly busesService;
    constructor(busesService: BusesService);
    create(createDto: CreateBusDto, user: any): Promise<{
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
    rotateToken(id: string, user: any): Promise<{
        message: string;
        newDeviceToken: string;
    }>;
    findAll(user: any, query: any): Promise<import("../entities/bus.entity").Bus[]>;
    findOne(id: string, user: any): Promise<import("../entities/bus.entity").Bus>;
    update(id: string, updateDto: UpdateBusDto, user: any): Promise<import("../entities/bus.entity").Bus>;
    remove(id: string, user: any): Promise<void>;
}
