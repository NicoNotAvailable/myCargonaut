import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('createOrJoinRoom')
  handleCreateOrJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: number; targetUserId: number },
  ): void {
    const { userId, targetUserId } = payload;
    const roomName = this.getRoomName(userId, targetUserId);

    client.join(roomName);
    client.data.userId = userId;

    this.server
      .to(roomName)
      .emit('message', `User ${userId} joined room ${roomName}`);
  }

  @SubscribeMessage('message')
  handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { room: string; message: string },
  ): void {
    const { room, message } = payload;
    this.server.to(room).emit('message', message);
  }

  private getRoomName(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('-');
  }
}
