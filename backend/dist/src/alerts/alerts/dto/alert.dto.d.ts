import { AlertType } from '../../enums/alert-type.enum';
export declare class CreateAlertDto {
    busId: string;
    tripId?: string;
    type: AlertType;
    message: string;
    geomWkt?: string;
    organizationId?: string;
}
