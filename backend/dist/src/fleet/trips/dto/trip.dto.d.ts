import { TripStatus } from '../../enums/trip-status.enum';
export declare class StartTripDto {
    busId: string;
    routeId: string;
    driverId?: string;
}
export declare class EndTripDto {
    status: TripStatus;
}
