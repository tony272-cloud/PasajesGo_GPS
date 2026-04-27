"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const trip_entity_1 = require("../entities/trip.entity");
const bus_entity_1 = require("../entities/bus.entity");
const bus_position_entity_1 = require("../../telemetry/entities/bus-position.entity");
const trip_status_enum_1 = require("../enums/trip-status.enum");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
let TripsService = class TripsService {
    tripRepository;
    busRepository;
    positionRepository;
    constructor(tripRepository, busRepository, positionRepository) {
        this.tripRepository = tripRepository;
        this.busRepository = busRepository;
        this.positionRepository = positionRepository;
    }
    async startTrip(startDto, currentUser) {
        const driverId = startDto.driverId || currentUser.id;
        const bus = await this.busRepository.findOne({ where: { id: startDto.busId } });
        if (!bus)
            throw new common_1.NotFoundException('Bus no encontrado');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre este bus');
        }
        const activeTrip = await this.tripRepository.findOne({
            where: {
                busId: startDto.busId,
                status: (0, typeorm_2.In)([trip_status_enum_1.TripStatus.IN_PROGRESS, trip_status_enum_1.TripStatus.SCHEDULED]),
            },
        });
        if (activeTrip) {
            throw new common_1.BadRequestException('El bus ya tiene un viaje activo o programado');
        }
        const activeDriverTrip = await this.tripRepository.findOne({
            where: {
                driverId: driverId,
                status: trip_status_enum_1.TripStatus.IN_PROGRESS,
            },
        });
        if (activeDriverTrip) {
            throw new common_1.BadRequestException('El conductor ya está en un viaje activo');
        }
        const newTrip = this.tripRepository.create({
            busId: startDto.busId,
            routeId: startDto.routeId,
            driverId: driverId,
            status: trip_status_enum_1.TripStatus.IN_PROGRESS,
            startedAt: new Date(),
        });
        return this.tripRepository.save(newTrip);
    }
    async endTrip(id, endDto, currentUser) {
        const trip = await this.tripRepository.findOne({
            where: { id },
            relations: ['bus']
        });
        if (!trip)
            throw new common_1.NotFoundException('Viaje no encontrado');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && trip.bus?.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre este viaje');
        }
        if (trip.status === trip_status_enum_1.TripStatus.COMPLETED || trip.status === trip_status_enum_1.TripStatus.CANCELED) {
            throw new common_1.BadRequestException(`El viaje ya está ${trip.status}`);
        }
        trip.status = endDto.status;
        trip.endedAt = new Date();
        const durationMs = trip.endedAt.getTime() - (trip.startedAt?.getTime() || trip.endedAt.getTime());
        const durationMinutes = Math.round(durationMs / 60000);
        let totalDistanceKm = 0;
        try {
            const result = await this.positionRepository.query(`
        WITH points AS (
          SELECT geom FROM bus_positions WHERE trip_id = $1 ORDER BY ts ASC
        )
        SELECT ST_Length(ST_MakeLine(geom)::geography) / 1000 AS distance_km
        FROM points
        HAVING COUNT(geom) > 1
      `, [trip.id]);
            if (result && result.length > 0) {
                totalDistanceKm = parseFloat(result[0].distance_km);
            }
        }
        catch (e) {
        }
        await this.tripRepository.save(trip);
        return {
            message: 'Viaje finalizado',
            tripId: trip.id,
            durationMinutes,
            totalDistanceKm: Number(totalDistanceKm.toFixed(2)),
        };
    }
    async findAll(currentUser, query) {
        const take = query.limit ? parseInt(query.limit) : 20;
        const skip = query.page ? (parseInt(query.page) - 1) * take : 0;
        const qb = this.tripRepository.createQueryBuilder('trip')
            .leftJoinAndSelect('trip.bus', 'bus')
            .leftJoinAndSelect('trip.route', 'route')
            .leftJoinAndSelect('trip.driver', 'driver')
            .take(take)
            .skip(skip)
            .orderBy('trip.createdAt', 'DESC');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            qb.andWhere('bus.organizationId = :orgId', { orgId: currentUser.organizationId });
        }
        if (query.busId)
            qb.andWhere('trip.busId = :busId', { busId: query.busId });
        if (query.routeId)
            qb.andWhere('trip.routeId = :routeId', { routeId: query.routeId });
        if (query.driverId)
            qb.andWhere('trip.driverId = :driverId', { driverId: query.driverId });
        if (query.status)
            qb.andWhere('trip.status = :status', { status: query.status });
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            total,
            page: query.page || 1,
            limit: take,
        };
    }
    async findOne(id, currentUser) {
        const trip = await this.tripRepository.findOne({
            where: { id },
            relations: ['bus', 'route', 'driver']
        });
        if (!trip)
            throw new common_1.NotFoundException('Viaje no encontrado');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && trip.bus?.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos');
        }
        return trip;
    }
};
exports.TripsService = TripsService;
exports.TripsService = TripsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(trip_entity_1.Trip)),
    __param(1, (0, typeorm_1.InjectRepository)(bus_entity_1.Bus)),
    __param(2, (0, typeorm_1.InjectRepository)(bus_position_entity_1.BusPosition)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TripsService);
//# sourceMappingURL=trips.service.js.map