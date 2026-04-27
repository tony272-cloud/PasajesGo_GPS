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
exports.RoutePath = void 0;
const typeorm_1 = require("typeorm");
const route_entity_1 = require("./route.entity");
let RoutePath = class RoutePath {
    id;
    routeId;
    route;
    path;
    createdAt;
};
exports.RoutePath = RoutePath;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], RoutePath.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'uuid', name: 'route_id', nullable: true }),
    __metadata("design:type", String)
], RoutePath.prototype, "routeId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => route_entity_1.Route, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'route_id' }),
    __metadata("design:type", route_entity_1.Route)
], RoutePath.prototype, "route", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'geometry',
        spatialFeatureType: 'LineString',
        srid: 4326,
    }),
    __metadata("design:type", String)
], RoutePath.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamptz', name: 'created_at' }),
    __metadata("design:type", Date)
], RoutePath.prototype, "createdAt", void 0);
exports.RoutePath = RoutePath = __decorate([
    (0, typeorm_1.Entity)('route_paths')
], RoutePath);
//# sourceMappingURL=route-path.entity.js.map