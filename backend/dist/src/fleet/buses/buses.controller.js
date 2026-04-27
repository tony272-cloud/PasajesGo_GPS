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
exports.BusesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const buses_service_1 = require("./buses.service");
const bus_dto_1 = require("./dto/bus.dto");
const jwt_auth_guard_1 = require("../../iam/auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../iam/auth/guards/roles.guard");
const roles_decorator_1 = require("../../iam/auth/decorators/roles.decorator");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
const current_user_decorator_1 = require("../../iam/auth/decorators/current-user.decorator");
let BusesController = class BusesController {
    busesService;
    constructor(busesService) {
        this.busesService = busesService;
    }
    create(createDto, user) {
        return this.busesService.create(createDto, user);
    }
    rotateToken(id, user) {
        return this.busesService.rotateToken(id, user);
    }
    findAll(user, query) {
        return this.busesService.findAll(user, query);
    }
    findOne(id, user) {
        return this.busesService.findOne(id, user);
    }
    update(id, updateDto, user) {
        return this.busesService.update(id, updateDto, user);
    }
    remove(id, user) {
        return this.busesService.remove(id, user);
    }
};
exports.BusesController = BusesController;
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Registrar un bus nuevo (retorna token una sola vez)' }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bus_dto_1.CreateBusDto, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "create", null);
__decorate([
    (0, common_1.Post)(':id/rotate-token'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Genera un nuevo token para el dispositivo GPS' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "rotateToken", null);
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Listar buses con paginación y filtros' }),
    (0, swagger_1.ApiQuery)({ name: 'status', required: false, description: 'Filtrar por ACTIVE, MAINTENANCE, OUT_OF_SERVICE' }),
    (0, swagger_1.ApiQuery)({ name: 'page', required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: 'limit', required: false, type: Number }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN, user_role_enum_1.UserRole.OPERATOR),
    (0, swagger_1.ApiOperation)({ summary: 'Obtener bus por ID' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Actualizar info del bus' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, bus_dto_1.UpdateBusDto, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRole.SUPERADMIN, user_role_enum_1.UserRole.ORG_ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Eliminar bus del sistema' }),
    __param(0, (0, common_1.Param)('id', common_1.ParseUUIDPipe)),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], BusesController.prototype, "remove", null);
exports.BusesController = BusesController = __decorate([
    (0, swagger_1.ApiTags)('Buses'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, common_1.Controller)('api/v1/buses'),
    __metadata("design:paramtypes", [buses_service_1.BusesService])
], BusesController);
//# sourceMappingURL=buses.controller.js.map