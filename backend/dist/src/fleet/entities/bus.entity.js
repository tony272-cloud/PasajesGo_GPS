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
exports.Bus = void 0;
const typeorm_1 = require("typeorm");
const organization_entity_1 = require("../../iam/entities/organization.entity");
const bus_status_enum_1 = require("../enums/bus-status.enum");
let Bus = class Bus {
    id;
    organizationId;
    organization;
    plate;
    model;
    capacity;
    deviceTokenHash;
    status;
    createdAt;
};
exports.Bus = Bus;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Bus.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'organization_id', nullable: true }),
    __metadata("design:type", String)
], Bus.prototype, "organizationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => organization_entity_1.Organization, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'organization_id' }),
    __metadata("design:type", organization_entity_1.Organization)
], Bus.prototype, "organization", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, unique: true }),
    __metadata("design:type", String)
], Bus.prototype, "plate", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Bus.prototype, "model", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', nullable: true }),
    __metadata("design:type", Number)
], Bus.prototype, "capacity", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, unique: true, name: 'device_token_hash' }),
    __metadata("design:type", String)
], Bus.prototype, "deviceTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: bus_status_enum_1.BusStatus,
        default: bus_status_enum_1.BusStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Bus.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Bus.prototype, "createdAt", void 0);
exports.Bus = Bus = __decorate([
    (0, typeorm_1.Entity)('buses')
], Bus);
//# sourceMappingURL=bus.entity.js.map