import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import { SocketService } from '../services/socket.service';
import { SessionService } from "../services/session.service";
import { UserService } from "../services/user.service";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit, OnDestroy {
  isLoggedIn: boolean = false;
  messages: { [key: string]: string[] } = {};
  userId: number | undefined;
  targetUserId: number | undefined;
  room: string | undefined;
  rooms: string[] = [];

  private sessionService: SessionService = inject(SessionService);

  constructor(private socketService: SocketService) {}

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(async isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== 'undefined') {
        window.location.href = "/";
      } else {
        this.userId = await this.sessionService.checkLoginNum();
        setTimeout(() => {
          this.socketService.on('message').subscribe((data: any) => {
            if (this.room) {
              this.messages[this.room].push(data);
            }
          });

          this.socketService.on('joinRooms').subscribe((rooms: string[]) => {
            this.rooms = rooms;
            rooms.forEach(room => {
              if (!this.messages[room]) {
                this.messages[room] = [];
              }
            });
          });

          this.socketService.emit('register', { userId: this.userId });
        }, 1000);
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  initiateChat(targetUserId: number): void {
    this.targetUserId = targetUserId;
    if (this.userId) {
      this.room = this.getRoomName(this.userId, this.targetUserId);
    }
    if (this.room && !this.messages[this.room]) {
      this.messages[this.room] = [];
    }
    this.socketService.emit('createOrJoinRoom', { userId: this.userId, targetUserId: this.targetUserId });
  }

  sendMessage(message: string): void {
    if (this.room) {
      this.socketService.emit('message', { room: this.room, message });
      this.messages[this.room].push(`Me: ${message}`);
    }
  }

  private getRoomName(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('-');
  }

  selectRoom(room: string): void {
    this.room = room;
  }
}
