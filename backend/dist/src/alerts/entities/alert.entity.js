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
exports.Alert = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("../../iam/entities/organization.entity");
const bus_entity_1 = require("../../fleet/entities/bus.entity");
const trip_entity_1 = require("../../fleet/entities/trip.entity");
const alert_type_enum_1 = require("../enums/alert-type.enum");
let Alert = class Alert {
    id;
    organizationId;
    organization;
    busId;
    bus;
    tripId;
    trip;
    type;
    message;
    ts;
    geom;
    resolvedAt;
    createdAt;
};
exports.Alert = Alert;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Alert.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'organization_id', nullable: true }),
    __metadata("design:type", String)
], Alert.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", organization_entity_1.Organization)
], Alert.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'bus_id', nullable: true }),
    __metadata("design:type", String)
], Alert.prototype, "busId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bus_entity_1.Bus),
    (0, typeorm_1.JoinColumn)({ name: 'bus_id' }),
    __metadata("design:type", bus_entity_1.Bus)
], Alert.prototype, "bus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'trip_id', nullable: true }),
    __metadata("design:type", String)
], Alert.prototype, "tripId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trip_entity_1.Trip),
    (0, typeorm_1.JoinColumn)({ name: 'trip_id' }),
    __metadata("design:type", trip_entity_1.Trip)
], Alert.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: alert_type_enum_1.AlertType,
    }),
    __metadata("design:type", String)
], Alert.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], Alert.prototype, "message", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' }),
    __metadata("design:type", Date)
], Alert.prototype, "ts", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
        nullable: true,
    }),
    __metadata("design:type", String)
], Alert.prototype, "geom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'resolved_at' }),
    __metadata("design:type", Date)
], Alert.prototype, "resolvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Alert.prototype, "createdAt", void 0);
exports.Alert = Alert = __decorate([
    (0, typeorm_1.Entity)('alerts')
], Alert);
//# sourceMappingURL=alert.entity.js.map