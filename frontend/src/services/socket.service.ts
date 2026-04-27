import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private readonly URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/realtime';

  connect() {
    if (this.socket) return;
    
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.warn('Socket connection aborted: No token found');
      return;
    }

    this.socket = io(this.URL, {
      auth: { token },
    });

    this.socket.on('connect', () => {
      console.log('Connected to Realtime WebSocket');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from Realtime WebSocket');
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  on(event: string, callback: (data: any) => void) {
    // If connect hasn't been called, do it now, or React race conditions will drop listeners
    if (!this.socket) {
      this.connect();
    }
    this.socket?.on(event, callback);
  }

  off(event: string) {
    this.socket?.off(event);
  }
}

export const socketService = new SocketService();
