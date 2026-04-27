"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bus_position_entity_1 = require("./entities/bus-position.entity");
const bus_entity_1 = require("../fleet/entities/bus.entity");
const telemetry_service_1 = require("./telemetry.service");
const telemetry_controller_1 = require("./telemetry.controller");
let TelemetryModule = class TelemetryModule {
};
exports.TelemetryModule = TelemetryModule;
exports.TelemetryModule = TelemetryModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bus_position_entity_1.BusPosition, bus_entity_1.Bus]),
        ],
        controllers: [telemetry_controller_1.TelemetryController],
        providers: [telemetry_service_1.TelemetryService],
        exports: [typeorm_1.TypeOrmModule, telemetry_service_1.TelemetryService],
    })
], TelemetryModule);
//# sourceMappingURL=telemetry.module.js.map