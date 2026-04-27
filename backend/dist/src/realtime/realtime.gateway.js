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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RealtimeGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const common_1 = require("@nestjs/common");
const socket_io_1 = require("socket.io");
const redis_module_1 = require("../redis/redis.module");
const ioredis_1 = __importDefault(require("ioredis"));
const jwt_auth_guard_1 = require("../iam/auth/guards/jwt-auth.guard");
const auth_service_1 = require("../iam/auth/auth.service");
let RealtimeGateway = class RealtimeGateway {
    redisClient;
    authService;
    server;
    logger = new common_1.Logger('RealtimeGateway');
    redisSubscriber;
    constructor(redisClient, authService) {
        this.redisClient = redisClient;
        this.authService = authService;
        this.redisSubscriber = this.redisClient.duplicate();
    }
    afterInit(server) {
        this.logger.log('WebSocket Gateway Initialized');
        this.redisSubscriber.subscribe('telemetry:bus_position', (err) => {
            if (err)
                this.logger.error(`Failed to subscribe: ${err.message}`);
        });
        this.redisSubscriber.on('message', (channel, message) => {
            if (channel === 'telemetry:bus_position') {
                const payload = JSON.parse(message);
                this.server.emit(payload.event, payload.data);
                this.logger.log(`Broadcasted ${payload.event} to clients in /realtime`);
            }
        });
    }
    async handleConnection(client) {
        this.logger.log(`Connection attempt from: ${client.id}`);
        const token = client.handshake.auth?.token || client.handshake.query?.token;
        if (!token) {
            this.logger.warn(`Connection rejected (No token): ${client.id}. Handshake: ${JSON.stringify(client.handshake.auth)}`);
            client.disconnect();
            return;
        }
        this.logger.log(`Client connected: ${client.id}`);
    }
    handleDisconnect(client) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async handleLatestPosition(client, data) {
        const cached = await this.redisClient.get(`bus:${data.busId}:latest`);
        if (cached) {
            client.emit('bus:latest_position', JSON.parse(cached));
        }
    }
};
exports.RealtimeGateway = RealtimeGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], RealtimeGateway.prototype, "server", void 0);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, websockets_1.SubscribeMessage)('get_latest_position'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket, Object]),
    __metadata("design:returntype", Promise)
], RealtimeGateway.prototype, "handleLatestPosition", null);
exports.RealtimeGateway = RealtimeGateway = __decorate([
    (0, websockets_1.WebSocketGateway)({
        cors: { origin: '*' },
        namespace: '/realtime',
    }),
    __param(0, (0, common_1.Inject)(redis_module_1.REDIS_CLIENT)),
    __metadata("design:paramtypes", [ioredis_1.default,
        auth_service_1.AuthService])
], RealtimeGateway);
//# sourceMappingURL=realtime.gateway.js.map