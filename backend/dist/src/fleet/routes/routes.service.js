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
exports.RoutesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const route_entity_1 = require("../entities/route.entity");
const stop_entity_1 = require("../entities/stop.entity");
const route_path_entity_1 = require("../entities/route-path.entity");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
let RoutesService = class RoutesService {
    routeRepository;
    stopRepository;
    routePathRepository;
    dataSource;
    constructor(routeRepository, stopRepository, routePathRepository, dataSource) {
        this.routeRepository = routeRepository;
        this.stopRepository = stopRepository;
        this.routePathRepository = routePathRepository;
        this.dataSource = dataSource;
    }
    async create(createDto, currentUser) {
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && !createDto.organizationId) {
            createDto.organizationId = currentUser.organizationId;
        }
        if (createDto.stops && createDto.stops.length > 0) {
            const sequences = createDto.stops.map(s => s.sequenceOrder).sort((a, b) => a - b);
            if (sequences[0] !== 1)
                throw new common_1.BadRequestException('El orden de paradas debe empezar en 1');
            for (let i = 0; i < sequences.length - 1; i++) {
                if (sequences[i + 1] - sequences[i] !== 1) {
                    throw new common_1.BadRequestException('El orden de paradas debe ser secuencial sin saltos');
                }
            }
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const route = this.routeRepository.create({
                name: createDto.name,
                colorHex: createDto.colorHex,
                organizationId: createDto.organizationId,
            });
            const savedRoute = await queryRunner.manager.save(route);
            if (createDto.stops) {
                for (const stopData of createDto.stops) {
                    const wktPoint = `SRID=4326;POINT(${stopData.lng} ${stopData.lat})`;
                    const stop = this.stopRepository.create({
                        routeId: savedRoute.id,
                        name: stopData.name,
                        sequenceOrder: stopData.sequenceOrder,
                        radiusMeters: stopData.radiusMeters || 30.0,
                    });
                    await queryRunner.manager.query(`INSERT INTO stops (route_id, name, sequence_order, radius_meters, geom)
             VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326))`, [savedRoute.id, stop.name, stop.sequenceOrder, stop.radiusMeters, `POINT(${stopData.lng} ${stopData.lat})`]);
                }
            }
            if (createDto.pathCoordinates && createDto.pathCoordinates.length >= 2) {
                const lineString = createDto.pathCoordinates.map(c => `${c[0]} ${c[1]}`).join(', ');
                await queryRunner.manager.query(`INSERT INTO route_paths (route_id, path)
           VALUES ($1, ST_GeomFromText($2, 4326))`, [savedRoute.id, `LINESTRING(${lineString})`]);
            }
            await queryRunner.commitTransaction();
            return this.findOne(savedRoute.id, currentUser);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(currentUser) {
        const where = { isActive: true };
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            where.organizationId = currentUser.organizationId;
        }
        return this.routeRepository.find({ where });
    }
    async findOne(id, currentUser) {
        const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
        if (!route)
            throw new common_1.NotFoundException('Ruta no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre esta ruta');
        }
        const stops = await this.stopRepository.query(`SELECT id, name, sequence_order, radius_meters, ST_AsGeoJSON(geom) as geom 
       FROM stops WHERE route_id = $1 ORDER BY sequence_order ASC`, [route.id]);
        const path = await this.routePathRepository.query(`SELECT ST_AsGeoJSON(path) as path FROM route_paths WHERE route_id = $1 LIMIT 1`, [route.id]);
        return {
            ...route,
            stops: stops.map((s) => ({ ...s, geom: JSON.parse(s.geom) })),
            path: path.length > 0 ? JSON.parse(path[0].path) : null,
        };
    }
    async reorderStops(id, reorderDto, currentUser) {
        const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
        if (!route)
            throw new common_1.NotFoundException('Ruta no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos para editar esta ruta');
        }
        const { stopIds } = reorderDto;
        const existingStopsCount = await this.stopRepository.count({ where: { routeId: id } });
        if (stopIds.length !== existingStopsCount) {
            throw new common_1.BadRequestException('Debes proveer exactamente los mismos IDs existentes');
        }
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (let i = 0; i < stopIds.length; i++) {
                await queryRunner.manager.update(stop_entity_1.Stop, { id: stopIds[i], routeId: id }, { sequenceOrder: i + 1 });
            }
            await queryRunner.commitTransaction();
            return { message: 'Paradas reordenadas exitosamente' };
        }
        catch (e) {
            await queryRunner.rollbackTransaction();
            throw e;
        }
        finally {
            await queryRunner.release();
        }
    }
    async remove(id, currentUser) {
        const route = await this.routeRepository.findOne({ where: { id, isActive: true } });
        if (!route)
            throw new common_1.NotFoundException('Ruta no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && route.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos');
        }
        route.isActive = false;
        await this.routeRepository.save(route);
    }
};
exports.RoutesService = RoutesService;
exports.RoutesService = RoutesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(route_entity_1.Route)),
    __param(1, (0, typeorm_1.InjectRepository)(stop_entity_1.Stop)),
    __param(2, (0, typeorm_1.InjectRepository)(route_path_entity_1.RoutePath)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], RoutesService);
//# sourceMappingURL=routes.service.js.map