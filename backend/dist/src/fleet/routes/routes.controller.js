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
exports.RoutesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const routes_service_1 = require("./routes.service");
const route_dto_1 = require("./dto/route.dto");
const jwt_auth_guard_1 = require("../../iam/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../iam/auth/guards/roles.guard");
const roles_decorator_1 = require("../../iam/auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
const current_user_decorator_1 = require("../../iam/auth/decorators/current-user.decorator");
let RoutesController = class RoutesController {
    routesService;
    constructor(routesService) {
        this.routesService = routesService;
    }
    create(createRouteDto, user) {
        return this.routesService.create(createRouteDto, user);
    }
    findAll(user) {
        return this.routesService.findAll(user);
    }
    findOne(id, user) {
        return this.routesService.findOne(id, user);
    }
    reorderStops(id, reorderDto, user) {
        return this.routesService.reorderStops(id, reorderDto, user);
    }
    remove(id, user) {
        return this.routesService.remove(id, user);
    }
};
exports.RoutesController = RoutesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear ruta, con paradas y polilínea opcional' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [route_dto_1.CreateRouteDto, Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR, user_role_enum_1.UserRole.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las rutas activas' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR, user_role_enum_1.UserRole.DRIVER),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de la ruta con paradas y trayecto en GeoJSON' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id/stops/reorder'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Reordenar secuencialmente paradas de una ruta' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, route_dto_1.ReorderStopsDto, Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "reorderStops", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Desactivar ruta (Soft Delete)' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], RoutesController.prototype, "remove", null);
exports.RoutesController = RoutesController = __decorate([
    (0, swagger_1.ApiTags)('Routes'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/routes'),
    __metadata("design:paramtypes", [routes_service_1.RoutesService])
], RoutesController);
//# sourceMappingURL=routes.controller.js.map