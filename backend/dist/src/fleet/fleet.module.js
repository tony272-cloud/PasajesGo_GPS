"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FleetModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bus_entity_1 = require("./entities/bus.entity");
const route_entity_1 = require("./entities/route.entity");
const stop_entity_1 = require("./entities/stop.entity");
const route_path_entity_1 = require("./entities/route-path.entity");
const trip_entity_1 = require("./entities/trip.entity");
const telemetry_module_1 = require("../telemetry/telemetry.module");
const buses_service_1 = require("./buses/buses.service");
const buses_controller_1 = require("./buses/buses.controller");
const routes_service_1 = require("./routes/routes.service");
const routes_controller_1 = require("./routes/routes.controller");
const trips_service_1 = require("./trips/trips.service");
const trips_controller_1 = require("./trips/trips.controller");
let FleetModule = class FleetModule {
};
exports.FleetModule = FleetModule;
exports.FleetModule = FleetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([bus_entity_1.Bus, route_entity_1.Route, stop_entity_1.Stop, route_path_entity_1.RoutePath, trip_entity_1.Trip]),
            telemetry_module_1.TelemetryModule,
        ],
        controllers: [buses_controller_1.BusesController, routes_controller_1.RoutesController, trips_controller_1.TripsController],
        providers: [buses_service_1.BusesService, routes_service_1.RoutesService, trips_service_1.TripsService],
        exports: [typeorm_1.TypeOrmModule, buses_service_1.BusesService, routes_service_1.RoutesService, trips_service_1.TripsService],
    })
], FleetModule);
//# sourceMappingURL=fleet.module.js.map