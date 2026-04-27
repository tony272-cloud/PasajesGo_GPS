import { Route } from './route.entity';
export declare class Stop {
    id: string;
    routeId: string;
    route: Route;
    name: string;
    sequenceOrder: number;
    geom: string;
    radiusMeters: number;
    createdAt: Date;
}
