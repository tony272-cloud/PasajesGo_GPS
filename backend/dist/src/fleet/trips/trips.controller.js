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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TripsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const trips_service_1 = require("./trips.service");
const trip_dto_1 = require("./dto/trip.dto");
const jwt_auth_guard_1 = require("../../iam/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../iam/auth/guards/roles.guard");
const roles_decorator_1 = require("../../iam/auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
const current_user_decorator_1 = require("../../iam/auth/decorators/current-user.decorator");
const trip_status_enum_1 = require("../enums/trip-status.enum");
let TripsController = class TripsController {
    tripsService;
    constructor(tripsService) {
        this.tripsService = tripsService;
    }
    startTrip(startDto, user) {
        return this.tripsService.startTrip(startDto, user);
    }
    endTrip(id, endDto, user) {
        return this.tripsService.endTrip(id, endDto, user);
    }
    findAll(user, query) {
        return this.tripsService.findAll(user, query);
    }
    findOne(id, user) {
        return this.tripsService.findOne(id, user);
    }
};
exports.TripsController = TripsController;
__decorate([
    (0, common_1.Post)('start'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Iniciar un viaje validando que el bus y conductor no estén en curso' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [trip_dto_1.StartTripDto, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "startTrip", null);
__decorate([
    (0, common_1.Patch)(':id/end'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Finalizar un viaje y calcular métricas' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, trip_dto_1.EndTripDto, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "endTrip", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Historial de viajes con filtros' }),
    (0, swagger_1.ApiQuery)({ name: 'busId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'routeId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'driverId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'status', enum: trip_status_enum_1.TripStatus, required: false }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de un viaje' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TripsController.prototype, "findOne", null);
exports.TripsController = TripsController = __decorate([
    (0, swagger_1.ApiTags)('Trips'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/trips'),
    __metadata("design:paramtypes", [trips_service_1.TripsService])
], TripsController);
//# sourceMappingURL=trips.controller.js.map