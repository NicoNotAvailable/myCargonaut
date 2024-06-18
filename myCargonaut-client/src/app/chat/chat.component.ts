import { Component, OnInit, inject } from "@angular/core";
import { SocketService } from '../services/socket.service';
import { SessionService } from "../services/session.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  isLoggedIn: boolean = false;
  messages: { [key: string]: string[] } = {};
  userId: number | undefined;
  targetUserId: number | undefined;
  room: string | undefined;
  rooms: string[] = [];

  private sessionService: SessionService = inject(SessionService);
  private socketService: SocketService = inject(SocketService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  constructor() {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(async isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      console.log("islogged" + isLoggedIn);
      if (!this.isLoggedIn) {
        window.location.href = "/";
      }

      this.route.queryParams.subscribe(params => {
        this.targetUserId = +params['targetUserId'];
        if (this.targetUserId) {
          this.initiateChat(this.targetUserId);
        }
      });

      this.loadExistingChats();
    });

    this.socketService.onMessage().subscribe(({ room, message }) => {
      if (!this.messages[room]) {
        this.messages[room] = [];
      }
      this.messages[room].push(message);
    });
  }

  ngAfterViewInit(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
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
