import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto, ChangeRoleDto } from './dto/user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<User>);
    create(createDto: CreateUserDto, currentUser: any): Promise<Omit<User, 'passwordHash'>>;
    findAll(currentUser: any): Promise<User[]>;
    findOne(id: string, currentUser: any): Promise<User>;
    changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<void>;
    remove(id: string, currentUser: any): Promise<void>;
}
