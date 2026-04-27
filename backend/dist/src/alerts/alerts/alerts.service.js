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
exports.AlertsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const alert_entity_1 = require("../entities/alert.entity");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
let AlertsService = class AlertsService {
    alertRepository;
    dataSource;
    constructor(alertRepository, dataSource) {
        this.alertRepository = alertRepository;
        this.dataSource = dataSource;
    }
    async create(createDto) {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const result = await queryRunner.manager.query(`
          INSERT INTO alerts (organization_id, bus_id, trip_id, type, message, geom)
          VALUES ($1, $2, $3, $4, $5, ${createDto.geomWkt ? `ST_GeomFromText('${createDto.geomWkt}', 4326)` : 'NULL'})
          RETURNING *;
        `, [
                createDto.organizationId || null,
                createDto.busId,
                createDto.tripId || null,
                createDto.type,
                createDto.message
            ]);
            return result[0];
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(currentUser, query) {
        const take = query.limit ? parseInt(query.limit) : 20;
        const skip = query.page ? (parseInt(query.page) - 1) * take : 0;
        const qb = this.alertRepository.createQueryBuilder('alert')
            .leftJoinAndSelect('alert.bus', 'bus')
            .take(take)
            .skip(skip)
            .orderBy('alert.ts', 'DESC');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            qb.andWhere('alert.organizationId = :orgId', { orgId: currentUser.organizationId });
        }
        if (query.type)
            qb.andWhere('alert.type = :type', { type: query.type });
        if (query.busId)
            qb.andWhere('alert.busId = :busId', { busId: query.busId });
        if (query.status === 'RESOLVED') {
            qb.andWhere('alert.resolvedAt IS NOT NULL');
        }
        else if (query.status === 'OPEN') {
            qb.andWhere('alert.resolvedAt IS NULL');
        }
        const [data, total] = await qb.getManyAndCount();
        return {
            data,
            total,
            page: query.page || 1,
            limit: take,
        };
    }
    async markAsResolved(id, currentUser) {
        const alert = await this.alertRepository.findOne({ where: { id } });
        if (!alert)
            throw new common_1.NotFoundException('Alerta no encontrada');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && alert.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre esta alerta');
        }
        alert.resolvedAt = new Date();
        return this.alertRepository.save(alert);
    }
};
exports.AlertsService = AlertsService;
exports.AlertsService = AlertsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], AlertsService);
//# sourceMappingURL=alerts.service.js.map