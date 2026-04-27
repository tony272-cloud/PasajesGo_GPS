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
exports.GeofencesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const geofences_service_1 = require("./geofences.service");
const geofence_dto_1 = require("./dto/geofence.dto");
const jwt_auth_guard_1 = require("../../iam/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../iam/auth/guards/roles.guard");
const roles_decorator_1 = require("../../iam/auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
const current_user_decorator_1 = require("../../iam/auth/decorators/current-user.decorator");
let GeofencesController = class GeofencesController {
    geofencesService;
    constructor(geofencesService) {
        this.geofencesService = geofencesService;
    }
    create(createDto, user) {
        return this.geofencesService.create(createDto, user);
    }
    findAll(user) {
        return this.geofencesService.findAll(user);
    }
    findOne(id, user) {
        return this.geofencesService.findOne(id, user);
    }
    update(id, updateDto, user) {
        return this.geofencesService.update(id, updateDto, user);
    }
    remove(id, user) {
        return this.geofencesService.remove(id, user);
    }
};
exports.GeofencesController = GeofencesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Crear geocerca poligonal' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [geofence_dto_1.CreateGeofenceDto, Object]),
    __metadata("design:returntype", void 0)
], GeofencesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Listar todas las geocercas' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], GeofencesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Detalle de geocerca' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GeofencesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Editar geocerca' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, geofence_dto_1.UpdateGeofenceDto, Object]),
    __metadata("design:returntype", void 0)
], GeofencesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar geocerca' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], GeofencesController.prototype, "remove", null);
exports.GeofencesController = GeofencesController = __decorate([
    (0, swagger_1.ApiTags)('Geofences'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/geofences'),
    __metadata("design:paramtypes", [geofences_service_1.GeofencesService])
], GeofencesController);
//# sourceMappingURL=geofences.controller.js.map