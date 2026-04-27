import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import Redis from 'ioredis';
import { AuthService } from '../iam/auth/auth.service';
export declare class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private readonly redisClient;
    private readonly authService;
    server: Server;
    private logger;
    private redisSubscriber;
    constructor(redisClient: Redis, authService: AuthService);
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleDisconnect(client: Socket): void;
    handleLatestPosition(client: Socket, data: {
        busId: string;
    }): Promise<void>;
}
