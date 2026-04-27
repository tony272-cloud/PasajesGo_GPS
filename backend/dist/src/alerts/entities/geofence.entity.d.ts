import { Organization } from '../../iam/entities/organization.entity';
import { AlertType } from '../enums/alert-type.enum';
export declare class Geofence {
    id: string;
    organizationId: string;
    organization: Organization;
    name: string;
    geom: string;
    alertType: AlertType;
    createdAt: Date;
}
