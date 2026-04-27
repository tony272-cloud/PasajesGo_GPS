import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as crypto from 'crypto';
import { Bus } from '../entities/bus.entity';
import { CreateBusDto, UpdateBusDto } from './dto/bus.dto';
import { UserRole } from '../../iam/enums/user-role.enum';

@Injectable()
export class BusesService {
  constructor(
    @InjectRepository(Bus)
    private readonly busRepository: Repository<Bus>,
  ) {}

  private generateToken() {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
    return { rawToken, hash };
  }

  async create(createDto: CreateBusDto, currentUser: any) {
    if (currentUser.role !== UserRole.SUPERADMIN) {
      if (!createDto.organizationId || createDto.organizationId !== currentUser.organizationId) {
        throw new ForbiddenException('Solo puedes registrar buses en tu organización');
      }
    }

    const { rawToken, hash } = this.generateToken();

    try {
      const bus = this.busRepository.create({
        ...createDto,
        deviceTokenHash: hash,
      });
      const savedBus = await this.busRepository.save(bus);

      // Return raw token exactly once
      return {
        ...savedBus,
        deviceToken: rawToken, // Visible only upon creation
      };
    } catch (error: any) {
      if (error.code === '23505') {
        throw new ConflictException('La placa o el bus ya existe');
      }
      throw error;
    }
  }

  async rotateToken(id: string, currentUser: any) {
    const bus = await this.findOne(id, currentUser);
    
    if (currentUser.role !== UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
       throw new ForbiddenException('No tienes permisos sobre este bus');
    }

    const { rawToken, hash } = this.generateToken();
    bus.deviceTokenHash = hash;
    await this.busRepository.save(bus);

    return { message: 'Token rotado exitosamente', newDeviceToken: rawToken };
  }

  async findAll(currentUser: any, query: any): Promise<Bus[]> {
    const where: any = {};
    if (currentUser.role !== UserRole.SUPERADMIN) {
      where.organizationId = currentUser.organizationId;
    }

    if (query.status) {
      where.status = query.status;
    }
    
    // Support pagination (skip/take) simply
    const take = query.limit || 20;
    const skip = query.page ? (query.page - 1) * take : 0;

    return this.busRepository.find({
      where,
      take,
      skip,
    });
  }

  async findOne(id: string, currentUser: any): Promise<Bus> {
    const bus = await this.busRepository.findOne({ where: { id } });
    if (!bus) throw new NotFoundException('Bus no encontrado');

    if (currentUser.role !== UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
      throw new ForbiddenException('No puedes acceder a este bus');
    }

    return bus;
  }

  async update(id: string, updateDto: UpdateBusDto, currentUser: any): Promise<Bus> {
    const bus = await this.findOne(id, currentUser);
    Object.assign(bus, updateDto);
    return this.busRepository.save(bus);
  }

  async remove(id: string, currentUser: any): Promise<void> {
    const bus = await this.findOne(id, currentUser);
    // Hard delete or status change, prompt says CRUD but doesn't specify soft delete for buses
    // We will do a hard delete or let DB handle it if trips exist (foreign key constraints)
    await this.busRepository.delete(id);
  }
}
