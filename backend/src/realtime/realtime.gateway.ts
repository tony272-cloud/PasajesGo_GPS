import { 
  WebSocketGateway, 
  WebSocketServer, 
  OnGatewayInit, 
  OnGatewayConnection, 
  OnGatewayDisconnect, 
  SubscribeMessage 
} from '@nestjs/websockets';
import { Inject, Logger, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { REDIS_CLIENT } from '../redis/redis.module';
import Redis from 'ioredis';
import { JwtAuthGuard } from '../iam/auth/guards/jwt-auth.guard';
import { AuthService } from '../iam/auth/auth.service';

@WebSocketGateway({
  cors: { origin: '*' }, // Configure appropriately in production
  namespace: '/realtime',
})
export class RealtimeGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('RealtimeGateway');
  private redisSubscriber: Redis;

  constructor(
    @Inject(REDIS_CLIENT) private readonly redisClient: Redis,
    private readonly authService: AuthService,
  ) {
    // We need a dedicated connection for subscribing
    this.redisSubscriber = this.redisClient.duplicate();
  }

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway Initialized');
    
    // Subscribe to Redis PubSub for all instances
    this.redisSubscriber.subscribe('telemetry:bus_position', (err) => {
      if (err) this.logger.error(`Failed to subscribe: ${err.message}`);
    });

    this.redisSubscriber.on('message', (channel, message) => {
      if (channel === 'telemetry:bus_position') {
         // message contains { event: '...', data: { busId, lat, lng... } }
         const payload = JSON.parse(message);
         // Broadcast to all connected clients in this namespace
         this.server.emit(payload.event, payload.data);
         this.logger.log(`Broadcasted ${payload.event} to clients in /realtime`);
         
         // Alternatively, we could emit to a room specific to an organization
         // this.server.to(`org_${orgId}`).emit(...)
      }
    });
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Connection attempt from: ${client.id}`);
    
    // Authenticate via JWT token in handshake auth or query
    const token = client.handshake.auth?.token || client.handshake.query?.token;
    if (!token) {
      this.logger.warn(`Connection rejected (No token): ${client.id}. Handshake: ${JSON.stringify(client.handshake.auth)}`);
      client.disconnect();
      return;
    }
    
    // We would need a way to verify JWT via AuthService manually since Guards don't trigger on connection lifecycle, only on SubscribeMessage
    // For now, allow connection and rely on Guards for specific WS routes if needed.
    // Real implementation should decode and attach user to client:
    // const user = await this.authService.verifyToken(token);
    // if (!user) client.disconnect();
    // client.data.user = user;
    
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  // Example of a client message requesting a specific bus latest position
  @UseGuards(JwtAuthGuard)
  @SubscribeMessage('get_latest_position')
  async handleLatestPosition(client: Socket, data: { busId: string }) {
    const cached = await this.redisClient.get(`bus:${data.busId}:latest`);
    if (cached) {
      client.emit('bus:latest_position', JSON.parse(cached));
    }
  }
}
