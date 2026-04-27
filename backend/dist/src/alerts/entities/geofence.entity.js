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
exports.Geofence = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("../../iam/entities/organization.entity");
const alert_type_enum_1 = require("../enums/alert-type.enum");
let Geofence = class Geofence {
    id;
    organizationId;
    organization;
    name;
    geom;
    alertType;
    createdAt;
};
exports.Geofence = Geofence;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Geofence.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'organization_id', nullable: true }),
    __metadata("design:type", String)
], Geofence.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", organization_entity_1.Organization)
], Geofence.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Geofence.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Polygon',
        srid: 4326,
    }),
    __metadata("design:type", String)
], Geofence.prototype, "geom", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: alert_type_enum_1.AlertType,
        name: 'alert_type',
    }),
    __metadata("design:type", String)
], Geofence.prototype, "alertType", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Geofence.prototype, "createdAt", void 0);
exports.Geofence = Geofence = __decorate([
    (0, typeorm_1.Entity)('geofences')
], Geofence);
//# sourceMappingURL=geofence.entity.js.map