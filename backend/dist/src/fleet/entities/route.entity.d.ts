import { Organization } from '../../iam/entities/organization.entity';
export declare class Route {
    id: string;
    organizationId: string;
    organization: Organization;
    name: string;
    colorHex: string;
    isActive: boolean;
    createdAt: Date;
}
