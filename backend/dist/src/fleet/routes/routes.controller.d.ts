import { RoutesService } from './routes.service';
import { CreateRouteDto, ReorderStopsDto } from './dto/route.dto';
export declare class RoutesController {
    private readonly routesService;
    constructor(routesService: RoutesService);
    create(createRouteDto: CreateRouteDto, user: any): Promise<{
        stops: any;
        path: any;
        id: string;
        organizationId: string;
        organization: import("../../iam/entities/organization.entity").Organization;
        name: string;
        colorHex: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    findAll(user: any): Promise<import("../entities/route.entity").Route[]>;
    findOne(id: string, user: any): Promise<{
        stops: any;
        path: any;
        id: string;
        organizationId: string;
        organization: import("../../iam/entities/organization.entity").Organization;
        name: string;
        colorHex: string;
        isActive: boolean;
        createdAt: Date;
    }>;
    reorderStops(id: string, reorderDto: ReorderStopsDto, user: any): Promise<{
        message: string;
    }>;
    remove(id: string, user: any): Promise<void>;
}
