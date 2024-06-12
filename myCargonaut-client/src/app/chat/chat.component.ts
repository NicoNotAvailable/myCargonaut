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
  messages: string[] = [];
  userId: number | undefined;
  targetUserId: number | undefined;
  room: string | undefined;

  public sessionService: SessionService = inject(SessionService);

  constructor(private socketService: SocketService) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(async isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      } else {
        this.userId = await this.sessionService.checkLoginNum();
        setTimeout(() => {
          this.socketService.on('message').subscribe((data: any) => {
          console.log('Message received:', data);
          this.messages.push(data);
          })
          ;}, 1000)
      }
    });
  }

  ngOnDestroy(): void {
    this.socketService.disconnect();
  }

  initiateChat(targetUserId: number): void {
    this.targetUserId = targetUserId;
    if(this.userId) {
      this.room = this.getRoomName(this.userId, this.targetUserId);
    }
    this.socketService.emit('createOrJoinRoom', { userId: this.userId, targetUserId: this.targetUserId });
  }

  sendMessage(message: string): void {
    this.socketService.emit('message', { room: this.room, message: message });
  }

  private getRoomName(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('-');
  }
}
