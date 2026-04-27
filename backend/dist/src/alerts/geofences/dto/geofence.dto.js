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
exports.UpdateGeofenceDto = exports.CreateGeofenceDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const alert_type_enum_1 = require("../../enums/alert-type.enum");
class CreateGeofenceDto {
    name;
    organizationId;
    polygonCoordinates;
    alertType;
}
exports.CreateGeofenceDto = CreateGeofenceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Zona Universitaria' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateGeofenceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'uuid-org' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateGeofenceDto.prototype, "organizationId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'GeoJSON Polygon coordinates array', example: [[[-77.0, -12.0], [-77.1, -12.0], [-77.1, -12.1], [-77.0, -12.1], [-77.0, -12.0]]] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Array)
], CreateGeofenceDto.prototype, "polygonCoordinates", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: alert_type_enum_1.AlertType, example: alert_type_enum_1.AlertType.GEOFENCE_ENTER }),
    (0, class_validator_1.IsEnum)(alert_type_enum_1.AlertType),
    __metadata("design:type", String)
], CreateGeofenceDto.prototype, "alertType", void 0);
class UpdateGeofenceDto {
    name;
    polygonCoordinates;
    alertType;
}
exports.UpdateGeofenceDto = UpdateGeofenceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGeofenceDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], UpdateGeofenceDto.prototype, "polygonCoordinates", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: alert_type_enum_1.AlertType }),
    (0, class_validator_1.IsEnum)(alert_type_enum_1.AlertType),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], UpdateGeofenceDto.prototype, "alertType", void 0);
//# sourceMappingURL=geofence.dto.js.map