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
exports.TelemetryController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const telemetry_service_1 = require("./telemetry.service");
const telemetry_dto_1 = require("./dto/telemetry.dto");
let TelemetryController = class TelemetryController {
    telemetryService;
    constructor(telemetryService) {
        this.telemetryService = telemetryService;
    }
    async ingest(deviceToken, batchDto) {
        if (!deviceToken) {
            throw new common_1.UnauthorizedException('Missing x-device-token header');
        }
        return this.telemetryService.ingestBatch(deviceToken, batchDto);
    }
};
exports.TelemetryController = TelemetryController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Ingesta de telemetría por lotes desde los dispositivos GPS/Móvil' }),
    (0, swagger_1.ApiHeader)({ name: 'x-device-token', description: 'Token único del dispositivo del bus', required: true }),
    __param(0, (0, common_1.Headers)('x-device-token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, telemetry_dto_1.TelemetryBatchDto]),
    __metadata("design:returntype", Promise)
], TelemetryController.prototype, "ingest", null);
exports.TelemetryController = TelemetryController = __decorate([
    (0, swagger_1.ApiTags)('Telemetry'),
    (0, common_1.Controller)('api/v1/telemetry'),
    __metadata("design:paramtypes", [telemetry_service_1.TelemetryService])
], TelemetryController);
//# sourceMappingURL=telemetry.controller.js.map