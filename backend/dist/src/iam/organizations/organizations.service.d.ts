import { Repository } from 'typeorm';
import { Organization } from '../entities/organization.entity';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
export declare class OrganizationsService {
    private readonly orgRepository;
    constructor(orgRepository: Repository<Organization>);
    create(createDto: CreateOrganizationDto): Promise<Organization>;
    findAll(): Promise<Organization[]>;
    findOne(id: string): Promise<Organization>;
    update(id: string, updateDto: UpdateOrganizationDto): Promise<Organization>;
    remove(id: string): Promise<void>;
}
