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
exports.BusPosition = void 0;
const typeorm_1 = require("typeorm");
const bus_entity_1 = require("../../fleet/entities/bus.entity");
const trip_entity_1 = require("../../fleet/entities/trip.entity");
let BusPosition = class BusPosition {
    id;
    ts;
    busId;
    bus;
    tripId;
    trip;
    geom;
    speedKmh;
    headingDeg;
    accuracyM;
};
exports.BusPosition = BusPosition;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'bigint' }),
    __metadata("design:type", String)
], BusPosition.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'timestamptz' }),
    __metadata("design:type", Date)
], BusPosition.prototype, "ts", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'bus_id' }),
    __metadata("design:type", String)
], BusPosition.prototype, "busId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => bus_entity_1.Bus),
    (0, typeorm_1.JoinColumn)({ name: 'bus_id' }),
    __metadata("design:type", bus_entity_1.Bus)
], BusPosition.prototype, "bus", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'trip_id', nullable: true }),
    __metadata("design:type", String)
], BusPosition.prototype, "tripId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => trip_entity_1.Trip),
    (0, typeorm_1.JoinColumn)({ name: 'trip_id' }),
    __metadata("design:type", trip_entity_1.Trip)
], BusPosition.prototype, "trip", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    }),
    __metadata("design:type", String)
], BusPosition.prototype, "geom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true, name: 'speed_kmh' }),
    __metadata("design:type", Number)
], BusPosition.prototype, "speedKmh", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true, name: 'heading_deg' }),
    __metadata("design:type", Number)
], BusPosition.prototype, "headingDeg", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', nullable: true, name: 'accuracy_m' }),
    __metadata("design:type", Number)
], BusPosition.prototype, "accuracyM", void 0);
exports.BusPosition = BusPosition = __decorate([
    (0, typeorm_1.Entity)('bus_positions')
], BusPosition);
//# sourceMappingURL=bus-position.entity.js.map