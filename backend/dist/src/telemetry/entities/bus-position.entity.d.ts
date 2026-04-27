import { Bus } from '../../fleet/entities/bus.entity';
import { Trip } from '../../fleet/entities/trip.entity';
export declare class BusPosition {
    id: string;
    ts: Date;
    busId: string;
    bus: Bus;
    tripId: string;
    trip: Trip;
    geom: string;
    speedKmh: number;
    headingDeg: number;
    accuracyM: number;
}
