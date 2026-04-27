import { User } from './user.entity';
export declare class AuditLog {
    id: string;
    userId: string;
    user: User;
    action: string;
    entityType: string;
    entityId: string;
    ipAddress: string;
    metadata: Record<string, any>;
    createdAt: Date;
}
