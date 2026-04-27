import { GeofencesService } from './geofences.service';
import { CreateGeofenceDto, UpdateGeofenceDto } from './dto/geofence.dto';
export declare class GeofencesController {
    private readonly geofencesService;
    constructor(geofencesService: GeofencesService);
    create(createDto: CreateGeofenceDto, user: any): Promise<import("../entities/geofence.entity").Geofence>;
    findAll(user: any): Promise<any>;
    findOne(id: string, user: any): Promise<any>;
    update(id: string, updateDto: UpdateGeofenceDto, user: any): Promise<import("../entities/geofence.entity").Geofence>;
    remove(id: string, user: any): Promise<void>;
}
