import { UserRole } from '../enums/user-role.enum';
import { Organization } from './organization.entity';
export declare class User {
    id: string;
    organizationId: string;
    organization: Organization;
    email: string;
    passwordHash: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
