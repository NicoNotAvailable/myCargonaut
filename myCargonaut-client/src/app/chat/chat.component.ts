import { Component, OnInit, inject, ViewChild, ElementRef } from "@angular/core";
import { SocketService } from '../services/socket.service';
import { SessionService } from "../services/session.service";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Message } from './message.interface';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent implements OnInit {
  isLoggedIn: boolean = false;
  messages: { [key: string]: Message[] } = {};
  userId: number | undefined;
  targetUserId: number | undefined;
  room: string | undefined;
  rooms: string[] = [];

  private sessionService: SessionService = inject(SessionService);
  private socketService: SocketService = inject(SocketService);
  private route: ActivatedRoute = inject(ActivatedRoute);

  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  private writer: number = -1;
  protected message: string = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(async isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      console.log("islogged" + isLoggedIn);
      if (!this.isLoggedIn) {
        window.location.href = "/";
      }
      this.userId = await this.sessionService.checkLoginNum();

      this.route.queryParams.subscribe(params => {
        this.targetUserId = +params['targetUserId'];
        if (this.targetUserId) {
          this.initiateChat(this.targetUserId);
        }
      });

      setTimeout(() => {
        this.loadChatsWithMessages();
      }, 200);
    });

    this.socketService.on('message').subscribe(({ room, message }) => {
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

  loadChatsWithMessages(): void {
    console.log('hiiiiiiiiii')
    if (!this.userId) return;
    console.log('hooooo')
    this.http
      .get<any>(`http://localhost:8000/trip/user-trips/${this.userId}`, { withCredentials: true })
      .subscribe(
        (data) => {
          console.log('eyo ' + data);
          const { offerTrips, requestTrips, offerDriveTrips, requestDriveTrips } = data;

          const trips = [...offerTrips, ...requestTrips, ...offerDriveTrips, ...requestDriveTrips];
          console.log('trips ' + trips);

          trips.forEach(trip => {
            console.log('ohoh' + trip);
            console.log(JSON.stringify(trip, null, 2));
            if (trip.__messages__ && trip.__messages__.length > 0) {
              console.log('hi');
              this.http.get<Message[]>(`http://localhost:8000/chat/messages/${trip.id}`, { withCredentials: true })
                .subscribe(
                  (data) => {
                    console.log(JSON.stringify(data, null, 2));
                    const roomName = `trip_${trip.id}`;
                    if (!this.rooms.includes(roomName)) {
                      this.rooms.push(roomName);
                      this.messages[roomName] = data;
                    }
                  },
                  (error) => {
                    console.log(error);
                  }
                );
            }
          });
        },
        (error) => {
          console.error(error);
        }
      );
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

  sendMessage(messageText: string): void {
    if (!this.room || !this.userId) {
      console.error('Room or userId not defined');
      return;
    }
    const tripId: number = parseInt(this.room.split('_')[1]);
    const messageData = {
      tripId: tripId,
      writer: this.userId,
      message: messageText,
    };

    this.socketService.emit('message', { room: this.room, message: messageText });
    this.messages[this.room].push({ id: 0, writer: { id: this.userId }, trip: { id: tripId }, message: messageText, read: true, timestamp: '' }); // Temporary push until response


    this.http.post<Message>("http://localhost:8000/chat/message", messageData, { withCredentials: true })
      .subscribe(
        (response: Message) => {
          console.log(response);
          console.log('Message sent successfully');
          const newMessage = response as Message;
          const roomMessages = this.messages[this.room!];
          const index = roomMessages.findIndex(msg => msg.id === 0);
          if (index !== -1) {
            roomMessages[index] = newMessage;
          }
        },
        error => {
          console.error('There was an error sending the message:', error);
        }
      );
  }

  private getRoomName(userId1: number, userId2: number): string {
    return [userId1, userId2].sort((a, b) => a - b).join('-');
  }

  selectRoom(room: string): void {
    this.room = room;
    this.markMessagesAsRead(room);
  }

  markMessagesAsRead(room: string): void {
    if (!this.messages[room]) return;

    this.messages[room].forEach((message: Message) => {
      console.log(message.writer.id);
      if (message.writer.id !== this.userId && !message.read) {
        message.read = true;

        this.http.put<Message>(`http://localhost:8000/chat/message/${message.id}`, { read: true }, { withCredentials: true })
          .subscribe(
            response => {
              console.log('Message read status updated successfully');
            },
            error => {
              console.error('There was an error updating message read status:', error);
            }
          );
      }
    });
  }

  getMessageClasses(message: Message): string {
    console.log(JSON.stringify(message, null, 2));
    if (message.writer?.id !== this.userId) {
      return 'message-left';
    } else {
      return 'message-right';
    }
  }
}
