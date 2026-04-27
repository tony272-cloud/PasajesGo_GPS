import { Organization } from '../../iam/entities/organization.entity';
import { Bus } from '../../fleet/entities/bus.entity';
import { Trip } from '../../fleet/entities/trip.entity';
import { AlertType } from '../enums/alert-type.enum';
export declare class Alert {
    id: string;
    organizationId: string;
    organization: Organization;
    busId: string;
    bus: Bus;
    tripId: string;
    trip: Trip;
    type: AlertType;
    message: string;
    ts: Date;
    geom: string;
    resolvedAt: Date;
    createdAt: Date;
}
