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
exports.GeofencesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const geofence_entity_1 = require("../entities/geofence.entity");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
let GeofencesService = class GeofencesService {
    geofenceRepository;
    constructor(geofenceRepository) {
        this.geofenceRepository = geofenceRepository;
    }
    extractWKT(polygonCoordinates) {
        try {
            const rings = polygonCoordinates.map(ring => '(' + ring.map(p => `${p[0]} ${p[1]}`).join(', ') + ')');
            return `POLYGON(${rings.join(', ')})`;
        }
        catch {
            throw new common_1.BadRequestException('Formato de polígono inválido. Debe ser un arreglo 3D donde la primera y última coordenada coincidan.');
        }
    }
    async create(createDto, currentUser) {
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && !createDto.organizationId) {
            createDto.organizationId = currentUser.organizationId;
        }
        const { polygonCoordinates, ...rest } = createDto;
        const geom = this.extractWKT(polygonCoordinates);
        const geofence = this.geofenceRepository.create({
            ...rest,
            geom,
        });
        return this.geofenceRepository.save(geofence);
    }
    async findAll(currentUser) {
        const where = {};
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            where.organizationId = currentUser.organizationId;
        }
        const geofences = await this.geofenceRepository.query(`
      SELECT id, name, organization_id as "organizationId", alert_type as "alertType", created_at as "createdAt", ST_AsGeoJSON(geom) as geom
      FROM geofences
      WHERE ${where.organizationId ? `organization_id = '${where.organizationId}'` : '1=1'}
    `);
        return geofences.map((g) => ({ ...g, geom: JSON.parse(g.geom) }));
    }
    async findOne(id, currentUser) {
        const query = this.geofenceRepository.createQueryBuilder('g')
            .select('g.id', 'id')
            .addSelect('g.name', 'name')
            .addSelect('g.organizationId', 'organizationId')
            .addSelect('g.alertType', 'alertType')
            .addSelect('g.createdAt', 'createdAt')
            .addSelect('ST_AsGeoJSON(g.geom)', 'geom')
            .where('g.id = :id', { id });
        const geofenceRaw = await query.getRawOne();
        if (!geofenceRaw)
            throw new common_1.NotFoundException('Geocerca no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && geofenceRaw.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre esta geocerca');
        }
        return { ...geofenceRaw, geom: JSON.parse(geofenceRaw.geom) };
    }
    async update(id, updateDto, currentUser) {
        const geofence = await this.geofenceRepository.findOne({ where: { id } });
        if (!geofence)
            throw new common_1.NotFoundException('Geocerca no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && geofence.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre esta geocerca');
        }
        if (updateDto.name)
            geofence.name = updateDto.name;
        if (updateDto.alertType)
            geofence.alertType = updateDto.alertType;
        if (updateDto.polygonCoordinates) {
            geofence.geom = this.extractWKT(updateDto.polygonCoordinates);
        }
        return this.geofenceRepository.save(geofence);
    }
    async remove(id, currentUser) {
        const geofence = await this.geofenceRepository.findOne({ where: { id } });
        if (!geofence)
            throw new common_1.NotFoundException('Geocerca no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && geofence.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre esta geocerca');
        }
        await this.geofenceRepository.delete(id);
    }
};
exports.GeofencesService = GeofencesService;
exports.GeofencesService = GeofencesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(geofence_entity_1.Geofence)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], GeofencesService);
//# sourceMappingURL=geofences.service.js.map