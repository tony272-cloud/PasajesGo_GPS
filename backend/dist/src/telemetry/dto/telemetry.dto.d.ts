export declare class PositionDto {
    ts: Date;
    lng: number;
    lat: number;
    speedKmh?: number;
    headingDeg?: number;
    accuracyM?: number;
}
export declare class TelemetryBatchDto {
    busId: string;
    tripId?: string;
    positions: PositionDto[];
}
