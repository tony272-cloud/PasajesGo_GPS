import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto, UpdateUserDto, ChangeRoleDto } from './dto/user.dto';
import { UserRole } from '../enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDto: CreateUserDto, currentUser: any): Promise<Omit<User, 'passwordHash'>> {
    // Only SUPERADMIN can create users for any org or without org
    if (currentUser.role !== UserRole.SUPERADMIN) {
      if (!createDto.organizationId || createDto.organizationId !== currentUser.organizationId) {
        throw new ForbiddenException('Solo puedes crear usuarios para tu propia organización');
      }
      // ORG_ADMIN cannot create another ORG_ADMIN or SUPERADMIN
      if (createDto.role === UserRole.SUPERADMIN || createDto.role === UserRole.ORG_ADMIN) {
         throw new ForbiddenException('No tienes permisos para crear este rol');
      }
    }

    try {
      const { password, ...rest } = createDto;
      const salt = await bcrypt.genSalt(12);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = this.userRepository.create({ ...rest, passwordHash });
      const savedUser = await this.userRepository.save(user);

      const { passwordHash: _, ...result } = savedUser;
      return result as any;
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('El correo ya está registrado');
      }
      throw error;
    }
  }

  async findAll(currentUser: any): Promise<User[]> {
    const where: any = { isActive: true };
    if (currentUser.role !== UserRole.SUPERADMIN) {
      where.organizationId = currentUser.organizationId;
    }
    
    // Do not return passwords
    return this.userRepository.find({
      where,
      select: ['id', 'email', 'role', 'organizationId', 'isActive', 'createdAt', 'updatedAt'],
    });
  }

  async findOne(id: string, currentUser: any): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id, isActive: true },
      select: ['id', 'email', 'role', 'organizationId', 'isActive', 'createdAt', 'updatedAt'],
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (currentUser.role !== UserRole.SUPERADMIN && user.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No puedes acceder a este usuario');
    }

    return user;
  }

  async changeRole(id: string, changeRoleDto: ChangeRoleDto): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id, isActive: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    user.role = changeRoleDto.role;
    await this.userRepository.save(user);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const user = await this.findOne(id, currentUser); // Reuse to check permissions
    user.isActive = false;
    await this.userRepository.save(user);
  }
}
