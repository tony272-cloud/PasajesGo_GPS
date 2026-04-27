import { UsersService } from './users.service';
import { CreateUserDto, ChangeRoleDto } from './dto/user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    create(createDto: CreateUserDto, user: any): Promise<Omit<import("../entities/user.entity").User, "passwordHash">>;
    findAll(user: any): Promise<import("../entities/user.entity").User[]>;
    findOne(id: string, user: any): Promise<import("../entities/user.entity").User>;
    changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<void>;
    remove(id: string, user: any): Promise<void>;
}
