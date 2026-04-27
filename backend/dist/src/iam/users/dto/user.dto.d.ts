import { UserRole } from '../../enums/user-role.enum';
export declare class CreateUserDto {
    email: string;
    password: string;
    role?: UserRole;
    organizationId?: string;
}
export declare class UpdateUserDto {
    email?: string;
    password?: string;
    organizationId?: string;
}
export declare class ChangeRoleDto {
    role: UserRole;
}
