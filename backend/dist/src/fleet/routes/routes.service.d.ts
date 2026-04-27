import { Repository, DataSource } from 'typeorm';
import { Route } from '../entities/route.entity';
import { Stop } from '../entities/stop.entity';
import { RoutePath } from '../entities/route-path.entity';
import { CreateRouteDto, ReorderStopsDto } from './dto/route.dto';
export declare class RoutesService {
    private readonly routeRepository;
    private readonly stopRepository;
    private readonly routePathRepository;
    private readonly dataSource;
    constructor(routeRepository: Repository<Route>, stopRepository: Repository<Stop>, routePathRepository: Repository<RoutePath>, dataSource: DataSource);
    create(createDto: CreateRouteDto, currentUser: any): Promise<{
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
    findAll(currentUser: any): Promise<Route[]>;
    findOne(id: string, currentUser: any): Promise<{
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
    reorderStops(id: string, reorderDto: ReorderStopsDto, currentUser: any): Promise<{
        message: string;
    }>;
    remove(id: string, currentUser: any): Promise<void>;
}
