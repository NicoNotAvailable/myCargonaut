import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message')
  handleMessage(client: Socket, payload: any): void {
    this.server.emit('message', payload);
  }

  @SubscribeMessage('join')
  handleJoinRoom(client: Socket, payload: { room: string }): void {
    client.join(payload.room);
    this.server
      .to(payload.room)
      .emit('message', `User joined room ${payload.room}`);
  }
}
