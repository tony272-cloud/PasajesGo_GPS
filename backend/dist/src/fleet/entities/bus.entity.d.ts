import { Organization } from '../../iam/entities/organization.entity';
import { BusStatus } from '../enums/bus-status.enum';
export declare class Bus {
    id: string;
    organizationId: string;
    organization: Organization;
    plate: string;
    model: string;
    capacity: number;
    deviceTokenHash: string;
    status: BusStatus;
    createdAt: Date;
}
