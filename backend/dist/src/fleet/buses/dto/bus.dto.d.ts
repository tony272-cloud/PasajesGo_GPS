import { BusStatus } from '../../enums/bus-status.enum';
export declare class CreateBusDto {
    plate: string;
    model?: string;
    capacity?: number;
    organizationId?: string;
}
export declare class UpdateBusDto {
    plate?: string;
    model?: string;
    capacity?: number;
    status?: BusStatus;
}
