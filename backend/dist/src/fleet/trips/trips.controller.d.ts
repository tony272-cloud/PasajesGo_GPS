import { TripsService } from './trips.service';
import { StartTripDto, EndTripDto } from './dto/trip.dto';
export declare class TripsController {
    private readonly tripsService;
    constructor(tripsService: TripsService);
    startTrip(startDto: StartTripDto, user: any): Promise<import("../entities/trip.entity").Trip>;
    endTrip(id: string, endDto: EndTripDto, user: any): Promise<{
        message: string;
        tripId: string;
        durationMinutes: number;
        totalDistanceKm: number;
    }>;
    findAll(user: any, query: any): Promise<{
        data: import("../entities/trip.entity").Trip[];
        total: number;
        page: any;
        limit: number;
    }>;
    findOne(id: string, user: any): Promise<import("../entities/trip.entity").Trip>;
}
