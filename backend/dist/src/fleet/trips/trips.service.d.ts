import { Repository } from 'typeorm';
import { Trip } from '../entities/trip.entity';
import { Bus } from '../entities/bus.entity';
import { BusPosition } from '../../telemetry/entities/bus-position.entity';
import { StartTripDto, EndTripDto } from './dto/trip.dto';
export declare class TripsService {
    private readonly tripRepository;
    private readonly busRepository;
    private readonly positionRepository;
    constructor(tripRepository: Repository<Trip>, busRepository: Repository<Bus>, positionRepository: Repository<BusPosition>);
    startTrip(startDto: StartTripDto, currentUser: any): Promise<Trip>;
    endTrip(id: string, endDto: EndTripDto, currentUser: any): Promise<{
        message: string;
        tripId: string;
        durationMinutes: number;
        totalDistanceKm: number;
    }>;
    findAll(currentUser: any, query: any): Promise<{
        data: Trip[];
        total: number;
        page: any;
        limit: number;
    }>;
    findOne(id: string, currentUser: any): Promise<Trip>;
}
