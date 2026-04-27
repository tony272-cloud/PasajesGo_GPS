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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertEngineService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const geofence_entity_1 = require("./entities/geofence.entity");
const alert_entity_1 = require("./entities/alert.entity");
const alert_type_enum_1 = require("./enums/alert-type.enum");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = __importDefault(require("ioredis"));
let AlertEngineService = class AlertEngineService {
    redisClient;
    geofenceRepo;
    alertRepo;
    dataSource;
    logger = new common_1.Logger('AlertEngineService');
    subscriber;
    constructor(redisClient, geofenceRepo, alertRepo, dataSource) {
        this.redisClient = redisClient;
        this.geofenceRepo = geofenceRepo;
        this.alertRepo = alertRepo;
        this.dataSource = dataSource;
        this.subscriber = this.redisClient.duplicate();
    }
    onModuleInit() {
        this.subscriber.subscribe('telemetry:bus_position', (err) => {
            if (err)
                this.logger.error(`Error subscribing to telemetry: ${err.message}`);
            else
                this.logger.log('Alert Engine subscribed to telemetry stream');
        });
        this.subscriber.on('message', async (channel, message) => {
            if (channel === 'telemetry:bus_position') {
                try {
                    const payload = JSON.parse(message);
                    if (payload.event === 'bus:position') {
                        await this.processTelemetry(payload.data);
                    }
                }
                catch (e) {
                    this.logger.error(`Error processing telemetry message: ${e.message}`);
                }
            }
        });
    }
    onModuleDestroy() {
        this.subscriber.disconnect();
    }
    async processTelemetry(data) {
        if (data.speed > 90) {
            await this.triggerAlertIfNew(data.busId, data.orgId, 'SPEEDING', `Exceso de Velocidad: ${data.speed} km/h`, data.lat, data.lng, data.tripId);
        }
        else {
            await this.redisClient.del(`alert:state:${data.busId}:SPEEDING`);
        }
        const intersectedFences = await this.geofenceRepo.createQueryBuilder('g')
            .where('g.organization_id = :orgId', { orgId: data.orgId })
            .andWhere(`ST_Intersects(g.geom::geometry, ST_SetSRID(ST_MakePoint(:lng, :lat), 4326))`, {
            lng: data.lng,
            lat: data.lat
        })
            .getMany();
        const currentFencesIds = intersectedFences.map(f => f.id);
        const stateKey = `bus:${data.busId}:geofences`;
        const previousStateRaw = await this.redisClient.get(stateKey);
        const previousFencesIds = previousStateRaw ? JSON.parse(previousStateRaw) : [];
        for (const fence of intersectedFences) {
            if (!previousFencesIds.includes(fence.id)) {
                if (fence.alertType === alert_type_enum_1.AlertType.GEOFENCE_ENTER) {
                    await this.triggerAlert(data.busId, data.orgId, alert_type_enum_1.AlertType.GEOFENCE_ENTER, `Entró a zona restringida: ${fence.name}`, data.lat, data.lng, data.tripId);
                }
            }
        }
        for (const prevId of previousFencesIds) {
            if (!currentFencesIds.includes(prevId)) {
                const fence = await this.geofenceRepo.findOne({ where: { id: prevId } });
                if (fence && fence.alertType === alert_type_enum_1.AlertType.GEOFENCE_EXIT) {
                    await this.triggerAlert(data.busId, data.orgId, alert_type_enum_1.AlertType.GEOFENCE_EXIT, `Salió de zona designada: ${fence.name}`, data.lat, data.lng, data.tripId);
                }
            }
        }
        await this.redisClient.set(stateKey, JSON.stringify(currentFencesIds));
    }
    async triggerAlertIfNew(busId, orgId, alertType, msg, lat, lng, tripId) {
        const key = `alert:state:${busId}:${alertType}`;
        const active = await this.redisClient.get(key);
        if (!active) {
            await this.triggerAlert(busId, orgId, alertType, msg, lat, lng, tripId);
            await this.redisClient.set(key, '1');
        }
    }
    async triggerAlert(busId, orgId, type, message, lat, lng, tripId) {
        this.logger.warn(`ALERT [${type}]: Bus ${busId} - ${message}`);
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        try {
            const result = await queryRunner.manager.query(`
          INSERT INTO alerts (organization_id, bus_id, trip_id, type, message, geom)
          VALUES ($1, $2, $3, $4, $5, ST_SetSRID(ST_MakePoint($6, $7), 4326))
          RETURNING *;
        `, [
                orgId,
                busId,
                tripId || null,
                type,
                message,
                lng,
                lat
            ]);
            const savedAlert = result[0];
            await this.redisClient.publish('telemetry:bus_position', JSON.stringify({
                event: 'alert:new',
                data: {
                    id: savedAlert.id,
                    busId,
                    type,
                    message,
                    lat,
                    lng,
                    ts: savedAlert.ts
                }
            }));
        }
        catch (e) {
            this.logger.error(`Error saving alert: ${e.message}`);
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.AlertEngineService = AlertEngineService;
exports.AlertEngineService = AlertEngineService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __param(1, (0, typeorm_1.InjectRepository)(geofence_entity_1.Geofence)),
    __param(2, (0, typeorm_1.InjectRepository)(alert_entity_1.Alert)),
    __metadata("design:paramtypes", [ioredis_1.default,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.DataSource])
], AlertEngineService);
//# sourceMappingURL=alert-engine.service.js.map