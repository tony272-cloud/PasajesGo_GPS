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
exports.Stop = void 0;
const typeorm_1 = require("typeorm");
const route_entity_1 = require("./route.entity");
let Stop = class Stop {
    id;
    routeId;
    route;
    name;
    sequenceOrder;
    geom;
    radiusMeters;
    createdAt;
};
exports.Stop = Stop;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Stop.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'route_id', nullable: true }),
    __metadata("design:type", String)
], Stop.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => route_entity_1.Route, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", route_entity_1.Route)
], Stop.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 150 }),
    __metadata("design:type", String)
], Stop.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', name: 'sequence_order' }),
    __metadata("design:type", Number)
], Stop.prototype, "sequenceOrder", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'Point',
        srid: 4326,
    }),
    __metadata("design:type", String)
], Stop.prototype, "geom", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'numeric', default: 30.0, name: 'radius_meters' }),
    __metadata("design:type", Number)
], Stop.prototype, "radiusMeters", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], Stop.prototype, "createdAt", void 0);
exports.Stop = Stop = __decorate([
    (0, typeorm_1.Entity)('stops')
], Stop);
//# sourceMappingURL=stop.entity.js.map