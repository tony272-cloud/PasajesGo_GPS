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
exports.ReorderStopsDto = exports.CreateRouteDto = exports.StopDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class StopDto {
    name;
    sequenceOrder;
    lng;
    lat;
    radiusMeters;
}
exports.StopDto = StopDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Parada Sur' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], StopDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1 }),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], StopDto.prototype, "sequenceOrder", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -77.02824 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StopDto.prototype, "lng", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: -12.04318 }),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], StopDto.prototype, "lat", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 30 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], StopDto.prototype, "radiusMeters", void 0);
class CreateRouteDto {
    name;
    colorHex;
    organizationId;
    stops;
    pathCoordinates;
}
exports.CreateRouteDto = CreateRouteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Línea 1 Sur-Norte' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '#FF0000' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "colorHex", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-org' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateRouteDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [StopDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => StopDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRouteDto.prototype, "stops", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'GeoJSON LineString array of coordinates', example: [[-77.0, -12.0], [-77.1, -12.1]] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateRouteDto.prototype, "pathCoordinates", void 0);
class ReorderStopsDto {
    stopIds;
}
exports.ReorderStopsDto = ReorderStopsDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Array of Stop IDs in the new order' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], ReorderStopsDto.prototype, "stopIds", void 0);
//# sourceMappingURL=route.dto.js.map