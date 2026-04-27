import { Bus } from './bus.entity';
import { Route } from './route.entity';
import { User } from '../../iam/entities/user.entity';
import { TripStatus } from '../enums/trip-status.enum';
export declare class Trip {
    id: string;
    busId: string;
    bus: Bus;
    routeId: string;
    route: Route;
    driverId: string;
    driver: User;
    startedAt: Date;
    endedAt: Date;
    status: TripStatus;
    createdAt: Date;
}
