"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
exports.TelemetryService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bus_position_entity_1 = require("./entities/bus-position.entity");
const bus_entity_1 = require("../fleet/entities/bus.entity");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = __importDefault(require("ioredis"));
const crypto = __importStar(require("crypto"));
let TelemetryService = class TelemetryService {
    positionRepository;
    busRepository;
    redis;
    dataSource;
    constructor(positionRepository, busRepository, redis, dataSource) {
        this.positionRepository = positionRepository;
        this.busRepository = busRepository;
        this.redis = redis;
        this.dataSource = dataSource;
    }
    async ingestBatch(deviceToken, batchUrl) {
        const hash = crypto.createHash('sha256').update(deviceToken).digest('hex');
        const bus = await this.busRepository.findOne({ where: { deviceTokenHash: hash, id: batchUrl.busId } });
        if (!bus) {
            throw new common_1.UnauthorizedException('Token de dispositivo inválido para este bus');
        }
        const validPositions = batchUrl.positions.filter(p => p.accuracyM === undefined || p.accuracyM <= 50);
        if (validPositions.length === 0)
            return { inserted: 0 };
        const newPositions = validPositions.map(p => {
            const pos = new bus_position_entity_1.BusPosition();
            pos.ts = p.ts;
            pos.busId = bus.id;
            pos.tripId = batchUrl.tripId || null;
            pos.geom = {
                type: 'Point',
                coordinates: [p.lng, p.lat]
            };
            pos.speedKmh = p.speedKmh;
            pos.headingDeg = p.headingDeg;
            pos.accuracyM = p.accuracyM;
            return pos;
        });
        try {
            await this.positionRepository
                .createQueryBuilder()
                .insert()
                .into(bus_position_entity_1.BusPosition)
                .values(newPositions)
                .execute();
            const latestPos = validPositions.reduce((latest, current) => new Date(current.ts) > new Date(latest.ts) ? current : latest);
            const redisPayload = {
                busId: bus.id,
                orgId: bus.organizationId,
                tripId: batchUrl.tripId,
                lat: latestPos.lat,
                lng: latestPos.lng,
                speed: latestPos.speedKmh,
                heading: latestPos.headingDeg,
                ts: latestPos.ts,
            };
            await this.redis.set(`bus:${bus.id}:latest`, JSON.stringify(redisPayload));
            await this.redis.publish('telemetry:bus_position', JSON.stringify({
                event: 'bus:position',
                data: redisPayload
            }));
        }
        catch (e) {
            console.error('Error inserting telemetry', e);
            throw e;
        }
        return { inserted: validPositions.length };
    }
};
exports.TelemetryService = TelemetryService;
exports.TelemetryService = TelemetryService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bus_position_entity_1.BusPosition)),
    __param(1, (0, typeorm_1.InjectRepository)(bus_entity_1.Bus)),
    __param(2, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        ioredis_1.default,
        typeorm_2.DataSource])
], TelemetryService);
//# sourceMappingURL=telemetry.service.js.map