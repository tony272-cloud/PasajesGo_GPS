import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto, UpdateOrganizationDto } from './dto/organization.dto';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(createDto: CreateOrganizationDto): Promise<import("../entities/organization.entity").Organization>;
    findAll(): Promise<import("../entities/organization.entity").Organization[]>;
    findOne(id: string): Promise<import("../entities/organization.entity").Organization>;
    update(id: string, updateDto: UpdateOrganizationDto): Promise<import("../entities/organization.entity").Organization>;
    remove(id: string): Promise<void>;
}
