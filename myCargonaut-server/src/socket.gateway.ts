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
import { ChatService } from './chat/chat.service';
import { TripService } from './trip/trip.service';

interface ActiveRoom {
  tripId: number;
  users: Set<number>;
}

@WebSocketGateway({
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private activeRooms: Map<number, ActiveRoom> = new Map();
  private users: Map<number, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly tripService: TripService,
  ) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.removeUserFromRooms(client);
  }

  @SubscribeMessage('register')
  async handleRegister(
    @ConnectedSocket() client: Socket,
    @MessageBody() userId: number,
  ): Promise<void> {
    this.users.set(userId, client.id);
    console.log('1111111111111111' + userId);
    client.join('user_${payload.userId}');
    console.log('User ' + userId + ' registered with socket ID ' + client.id);

    const tripsObject = await this.tripService.getUserTrips(userId);

    tripsObject.offerTrips.forEach((trip) => {
      const roomName = `trip_${trip.id}`;
      client.join(roomName);
      this.addUserToRoom(userId, trip.id);
      this.server
        .to(roomName)
        .emit('message', `User ${userId} joined room ${roomName}`);
      console.log('joined room  ' + roomName);
    });

    tripsObject.requestTrips.forEach((trip) => {
      const roomName = `trip_${trip.id}`;
      client.join(roomName);
      this.addUserToRoom(userId, trip.id);
      this.server
        .to(roomName)
        .emit('message', `User ${userId} joined room ${roomName}`);
      console.log('joined room  ' + roomName);
    });

    const tripIds = [
      ...tripsObject.offerTrips.map((trip) => trip.id),
      ...tripsObject.requestTrips.map((trip) => trip.id),
    ];
    client.emit('joinRooms', tripIds);
  }

  @SubscribeMessage('createOrJoinRoom')
  handleCreateOrJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { userId: number; tripId: number },
  ): void {
    const { userId, tripId } = payload;
    const roomName = `trip_${tripId}`;

    client.join(roomName);
    client.data.userId = userId;

    this.addUserToRoom(userId, tripId);

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

  getRoomName(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('-');
  }

  addUserToRoom(userId: number, tripId: number): void {
    let room: ActiveRoom;

    if (this.activeRooms.has(tripId)) {
      room = this.activeRooms.get(tripId);
      room.users.add(userId);
    } else {
      room = { tripId: tripId, users: new Set([userId]) };
      this.activeRooms.set(tripId, room);
    }
  }

  removeUserFromRooms(client: Socket): void {
    const userId = client.data.userId;
    this.activeRooms.forEach((room, key) => {
      if (room.users.has(userId)) {
        room.users.delete(userId);
        if (room.users.size === 0) {
          this.activeRooms.delete(key);
        }
      }
    });
  }
}
