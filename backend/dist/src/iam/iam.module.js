"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("./entities/user.entity");
const organization_entity_1 = require("./entities/organization.entity");
const refresh_token_entity_1 = require("./entities/refresh-token.entity");
const audit_log_entity_1 = require("./entities/audit-log.entity");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const config_1 = require("@nestjs/config");
const auth_service_1 = require("./auth/auth.service");
const auth_controller_1 = require("./auth/auth.controller");
const jwt_strategy_1 = require("./auth/strategies/jwt.strategy");
const organizations_service_1 = require("./organizations/organizations.service");
const organizations_controller_1 = require("./organizations/organizations.controller");
const users_service_1 = require("./users/users.service");
const users_controller_1 = require("./users/users.controller");
let IamModule = class IamModule {
};
exports.IamModule = IamModule;
exports.IamModule = IamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.User, organization_entity_1.Organization, refresh_token_entity_1.RefreshToken, audit_log_entity_1.AuditLog]),
            passport_1.PassportModule,
            jwt_1.JwtModule.registerAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    secret: configService.get('JWT_SECRET'),
                    signOptions: { expiresIn: configService.get('JWT_EXPIRES_IN') },
                }),
            }),
        ],
        controllers: [auth_controller_1.AuthController, organizations_controller_1.OrganizationsController, users_controller_1.UsersController],
        providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy, organizations_service_1.OrganizationsService, users_service_1.UsersService],
        exports: [typeorm_1.TypeOrmModule, auth_service_1.AuthService, organizations_service_1.OrganizationsService, users_service_1.UsersService],
    })
], IamModule);
//# sourceMappingURL=iam.module.js.map