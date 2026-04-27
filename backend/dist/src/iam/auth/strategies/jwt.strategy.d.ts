import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../../entities/user.entity';
import { Repository } from 'typeorm';
declare const JwtStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtStrategy extends JwtStrategy_base {
    private readonly configService;
    private readonly userRepository;
    constructor(configService: ConfigService, userRepository: Repository<User>);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        role: import("../../enums/user-role.enum").UserRole;
        organizationId: string;
    }>;
}
export {};
