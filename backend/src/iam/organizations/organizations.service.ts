import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    @InjectRepository(Organization)
    private readonly orgRepository: Repository<Organization>,
  ) {}

  async create(createDto: CreateOrganizationDto): Promise<Organization> {
    try {
      const org = this.orgRepository.create(createDto);
      return await this.orgRepository.save(org);
    } catch (error: any) {
      if (error.code === '23505') { // Postgres unique constraint violation
        throw new ConflictException('La organización con este RUC ya existe');
      }
      throw error;
    }
  }

  async findAll(): Promise<Organization[]> {
    return this.orgRepository.find({ where: { isActive: true } });
  }

  async findOne(id: string): Promise<Organization> {
    const org = await this.orgRepository.findOne({ where: { id, isActive: true } });
    if (!org) {
      throw new NotFoundException(`Organización ${id} no encontrada`);
    }
    return org;
  }

  async update(id: string, updateDto: UpdateOrganizationDto): Promise<Organization> {
    const org = await this.findOne(id);
    Object.assign(org, updateDto);
    return this.orgRepository.save(org);
  }

  async remove(id: string): Promise<void> {
    const org = await this.findOne(id);
    org.isActive = false; // Soft delete
    await this.orgRepository.save(org);
  }
}
