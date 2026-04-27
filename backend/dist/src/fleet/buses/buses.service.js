"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BusesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const crypto = __importStar(require("crypto"));
const bus_entity_1 = require("../entities/bus.entity");
const user_role_enum_1 = require("../../iam/enums/user-role.enum");
let BusesService = class BusesService {
    busRepository;
    constructor(busRepository) {
        this.busRepository = busRepository;
    }
    generateToken() {
        const rawToken = crypto.randomBytes(32).toString('hex');
        const hash = crypto.createHash('sha256').update(rawToken).digest('hex');
        return { rawToken, hash };
    }
    async create(createDto, currentUser) {
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            if (!createDto.organizationId || createDto.organizationId !== currentUser.organizationId) {
                throw new common_1.ForbiddenException('Solo puedes registrar buses en tu organización');
            }
        }
        const { rawToken, hash } = this.generateToken();
        try {
            const bus = this.busRepository.create({
                ...createDto,
                deviceTokenHash: hash,
            });
            const savedBus = await this.busRepository.save(bus);
            return {
                ...savedBus,
                deviceToken: rawToken,
            };
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.ConflictException('La placa o el bus ya existe');
            }
            throw error;
        }
    }
    async rotateToken(id, currentUser) {
        const bus = await this.findOne(id, currentUser);
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No tienes permisos sobre este bus');
        }
        const { rawToken, hash } = this.generateToken();
        bus.deviceTokenHash = hash;
        await this.busRepository.save(bus);
        return { message: 'Token rotado exitosamente', newDeviceToken: rawToken };
    }
    async findAll(currentUser, query) {
        const where = {};
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN) {
            where.organizationId = currentUser.organizationId;
        }
        if (query.status) {
            where.status = query.status;
        }
        const take = query.limit || 20;
        const skip = query.page ? (query.page - 1) * take : 0;
        return this.busRepository.find({
            where,
            take,
            skip,
        });
    }
    async findOne(id, currentUser) {
        const bus = await this.busRepository.findOne({ where: { id } });
        if (!bus)
            throw new common_1.NotFoundException('Bus no encontrado');
        if (currentUser.role !== user_role_enum_1.UserRole.SUPERADMIN && bus.organizationId !== currentUser.organizationId) {
            throw new common_1.ForbiddenException('No puedes acceder a este bus');
        }
        return bus;
    }
    async update(id, updateDto, currentUser) {
        const bus = await this.findOne(id, currentUser);
        Object.assign(bus, updateDto);
        return this.busRepository.save(bus);
    }
    async remove(id, currentUser) {
        const bus = await this.findOne(id, currentUser);
        await this.busRepository.delete(id);
    }
};
exports.BusesService = BusesService;
exports.BusesService = BusesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(bus_entity_1.Bus)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BusesService);
//# sourceMappingURL=buses.service.js.map