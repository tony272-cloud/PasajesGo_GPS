"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const geofence_entity_1 = require("./entities/geofence.entity");
const alert_entity_1 = require("./entities/alert.entity");
const geofences_service_1 = require("./geofences/geofences.service");
const geofences_controller_1 = require("./geofences/geofences.controller");
const alerts_service_1 = require("./alerts/alerts.service");
const alerts_controller_1 = require("./alerts/alerts.controller");
const alert_engine_service_1 = require("./alert-engine.service");
const redis_module_1 = require("../redis/redis.module");
let AlertsModule = class AlertsModule {
};
exports.AlertsModule = AlertsModule;
exports.AlertsModule = AlertsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([geofence_entity_1.Geofence, alert_entity_1.Alert]),
            redis_module_1.RedisModule,
        ],
        controllers: [geofences_controller_1.GeofencesController, alerts_controller_1.AlertsController],
        providers: [geofences_service_1.GeofencesService, alerts_service_1.AlertsService, alert_engine_service_1.AlertEngineService],
        exports: [typeorm_1.TypeOrmModule, geofences_service_1.GeofencesService, alerts_service_1.AlertsService, alert_engine_service_1.AlertEngineService],
    })
], AlertsModule);
//# sourceMappingURL=alerts.module.js.map