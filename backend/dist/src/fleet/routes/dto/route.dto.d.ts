export declare class StopDto {
    name: string;
    sequenceOrder: number;
    lng: number;
    lat: number;
    radiusMeters?: number;
}
export declare class CreateRouteDto {
    name: string;
    colorHex?: string;
    organizationId?: string;
    stops?: StopDto[];
    pathCoordinates?: number[][];
}
export declare class ReorderStopsDto {
    stopIds: string[];
}
