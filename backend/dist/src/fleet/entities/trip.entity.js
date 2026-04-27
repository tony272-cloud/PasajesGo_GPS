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
exports.Trip = void 0;
const typeorm_1 = require("typeorm");
const bus_entity_1 = require("./bus.entity");
const route_entity_1 = require("./route.entity");
const user_entity_1 = require("../../iam/entities/user.entity");
const trip_status_enum_1 = require("../enums/trip-status.enum");
let Trip = class Trip {
    id;
    busId;
    bus;
    routeId;
    route;
    driverId;
    driver;
    startedAt;
    endedAt;
    status;
    createdAt;
};
exports.Trip = Trip;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Trip.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'bus_id', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "busId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bus_entity_1.Bus),
    (0, typeorm_1.JoinColumn)({ name: 'bus_id' }),
    __metadata("design:type", bus_entity_1.Bus)
], Trip.prototype, "bus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'route_id', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => route_entity_1.Route),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", route_entity_1.Route)
], Trip.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'driver_id', nullable: true }),
    __metadata("design:type", String)
], Trip.prototype, "driverId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'driver_id' }),
    __metadata("design:type", user_entity_1.User)
], Trip.prototype, "driver", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'started_at' }),
    __metadata("design:type", Date)
], Trip.prototype, "startedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'timestamptz', nullable: true, name: 'ended_at' }),
    __metadata("design:type", Date)
], Trip.prototype, "endedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: trip_status_enum_1.TripStatus,
        default: trip_status_enum_1.TripStatus.SCHEDULED,
    }),
    __metadata("design:type", String)
], Trip.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Trip.prototype, "createdAt", void 0);
exports.Trip = Trip = __decorate([
    (0, typeorm_1.Entity)('trips')
], Trip);
//# sourceMappingURL=trip.entity.js.map