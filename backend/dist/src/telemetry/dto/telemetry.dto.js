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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TelemetryBatchDto = exports.PositionDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class PositionDto {
    ts;
    lng;
    lat;
    speedKmh;
    headingDeg;
    accuracyM;
}
exports.PositionDto = PositionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: '2026-03-14T10:00:00Z' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", Date)
], PositionDto.prototype, "ts", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -77.02824 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-180),
    (0, class_validator_1.Max)(180),
    __metadata("design:type", Number)
], PositionDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -12.04318 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(-90),
    (0, class_validator_1.Max)(90),
    __metadata("design:type", Number)
], PositionDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 45.5, description: 'Speed in km/h' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(150),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PositionDto.prototype, "speedKmh", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 120, description: 'Heading in degrees' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(360),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PositionDto.prototype, "headingDeg", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 10, description: 'GPS Accuracy in meters' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], PositionDto.prototype, "accuracyM", void 0);
class TelemetryBatchDto {
    busId;
    tripId;
    positions;
}
exports.TelemetryBatchDto = TelemetryBatchDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'uuid-bus' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], TelemetryBatchDto.prototype, "busId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-trip' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], TelemetryBatchDto.prototype, "tripId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [PositionDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PositionDto),
    __metadata("design:type", Array)
], TelemetryBatchDto.prototype, "positions", void 0);
//# sourceMappingURL=telemetry.dto.js.map