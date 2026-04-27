import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthService {
    private readonly userRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, jwtService: JwtService, configService: ConfigService);
    login(loginDto: LoginDto): Promise<{
        access_token: string;
        user: {
            id: string;
            email: string;
            role: import("../enums/user-role.enum").UserRole;
            organizationId: string;
        };
    }>;
}
