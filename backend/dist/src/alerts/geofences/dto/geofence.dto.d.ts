import { AlertType } from '../../enums/alert-type.enum';
export declare class CreateGeofenceDto {
    name: string;
    organizationId?: string;
    polygonCoordinates: number[][][];
    alertType: AlertType;
}
export declare class UpdateGeofenceDto {
    name?: string;
    polygonCoordinates?: number[][][];
    alertType?: AlertType;
}
