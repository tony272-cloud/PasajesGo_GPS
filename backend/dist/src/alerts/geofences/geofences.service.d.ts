import { Repository } from 'typeorm';
import { Geofence } from '../entities/geofence.entity';
import { CreateGeofenceDto, UpdateGeofenceDto } from './dto/geofence.dto';
export declare class GeofencesService {
    private readonly geofenceRepository;
    constructor(geofenceRepository: Repository<Geofence>);
    private extractWKT;
    create(createDto: CreateGeofenceDto, currentUser: any): Promise<Geofence>;
    findAll(currentUser: any): Promise<any>;
    findOne(id: string, currentUser: any): Promise<any>;
    update(id: string, updateDto: UpdateGeofenceDto, currentUser: any): Promise<Geofence>;
    remove(id: string, currentUser: any): Promise<void>;
}
