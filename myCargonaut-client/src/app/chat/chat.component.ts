import { Component, OnInit, inject, ViewChild, ElementRef } from "@angular/core";
import { SocketService } from '../services/socket.service';
import { SessionService } from "../services/session.service";
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { HttpClient } from "@angular/common/http";
import { Message } from './message.interface';
import { tr } from "@faker-js/faker";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faPhone} from "@fortawesome/free-solid-svg-icons";
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, NgOptimizedImage, FaIconComponent],
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
  trips: { [key: string]: any } = {};
  pathToImage: string = 'empty.png';

  private sessionService: SessionService = inject(SessionService);
  private socketService: SocketService = inject(SocketService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  public userService: UserService = inject(UserService);

  @ViewChild('messageInput') messageInput: ElementRef | undefined;
  @ViewChild('messagesContainer') messagesContainer: ElementRef | undefined;
  private writer: number = -1;
  protected message: string = '';

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(async isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn) {
        window.location.href = "/";
      }
      this.userId = await this.sessionService.checkLoginNum();

      setTimeout(() => {
        this.loadChatsWithMessages();
      }, 200);

      this.route.queryParams.subscribe(params => {
        const tripId = params['tripId'];
        if (tripId) {
          this.selectRoom('trip_' + tripId);
        } else {
          this.room = undefined;
        }
      });

    });

    this.socketService.on('message').subscribe((message: any) => {
      const roomName = `trip_${message.trip.id}`;

      if (!this.rooms.includes(roomName)) {
        console.error('Received message for undefined room:', roomName);
        return;
      }
      if (!this.messages[roomName]) {
        this.messages[roomName] = [];
      }
      this.messages[roomName].push(message);
      setTimeout(() => this.scrollToBottom(), 0);
    });
  }

  ngAfterViewInit(): void {
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
    setTimeout(() => this.scrollToBottom(), 0);
  }

  loadChatsWithMessages(): void {
    if (!this.userId) return;

    this.http.get<any>(`http://localhost:8000/trip/user-trips/${this.userId}`, { withCredentials: true })
      .subscribe(
        (data) => {
          const { offerTrips, requestTrips, offerDriveTrips, requestDriveTrips } = data;
          const trips = [...offerTrips, ...requestTrips, ...offerDriveTrips, ...requestDriveTrips];

          trips.forEach(trip => {
              const roomName = `trip_${trip.id}`;
              this.trips[roomName] = trip;  // Store trip details

              this.fetchOtherUser(trip).then(user => {
                if (user.profilePic === null) user.profilePic = 'empty.png';
                this.trips[roomName].user = user;  // Store user details
              });
              this.http.get<Message[]>(`http://localhost:8000/chat/messages/${trip.id}`, { withCredentials: true })
                .subscribe(
                  (data) => {
                    if (!this.rooms.includes(roomName)) {
                      this.rooms.push(roomName);
                      this.messages[roomName] = data;
                    }
                  },
                  (error) => {
                    console.error(error);
                  }
                );
          });
        },
        (error) => {
          console.error(error);
        }
      );
  }


  initiateChat(tripId: number): void {
    if (this.userId) {
      const room = this.getRoomName(tripId);
      if (!this.messages[room]) {
        this.messages[room] = [];
      }
      this.selectRoom(room);
      if (this.messageInput) {
        this.messageInput.nativeElement.focus();
      }
    }
  }

  sendMessage(messageText: string): void {
    if (!this.room || !this.userId) {
      console.error('Room or userId not defined');
      return;
    }

    const tripId: number = parseInt(this.room.split('_')[1]);
    const messageData: Message = {
      id: 0,  //mock
      writer: {
        id: this.userId,
      },
      trip: {
        id: tripId,
      },
      message: messageText,
      read: false,
      timestamp: new Date().toISOString(),
    };

    this.http.post<Message>("http://localhost:8000/chat/message", {writer: messageData.writer.id, tripId: messageData.trip.id, message: messageData.message}, { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.socketService.emit('message', { room: `trip_${tripId}`, message: response });
        },
        error => {
          console.error('There was an error sending the message:', error);
        }
      );
    this.message = '';
    setTimeout(() => this.scrollToBottom(), 0);
  }

  private getRoomName(tripId: number): string {
    return `trip_${tripId}`;
  }

  selectRoom(room: string): void {
    this.room = room;
    this.markMessagesAsRead(room);
    if (this.messageInput) {
      this.messageInput.nativeElement.focus();
    }
    setTimeout(() => this.scrollToBottom(), 0);
  }

  markMessagesAsRead(room: string): void {
    if (!this.messages[room]) return;

    this.messages[room].forEach((message: Message) => {
      if (message.writer.id !== this.userId && !message.read) {
        message.read = true;

        this.http.put<Message>(`http://localhost:8000/chat/message/${message.id}`, { read: true }, { withCredentials: true })
          .subscribe(
            response => {
            },
            error => {
              console.error('There was an error updating message read status:', error);
            }
          );
      }
    });
  }

  hasUnreadMessages(room: string): boolean {
    if (!this.messages[room]) return false;

    return this.messages[room].some(message => !message.read && message.writer.id !== this.userId);
  }

  getUnreadMessageCount(room: string): number {
    if (!this.messages[room]) return 0;

    return this.messages[room].filter(message => !message.read && message.writer.id !== this.userId).length;
  }


  getMessageClasses(message: Message): string {
    if (message.writer?.id !== this.userId) {
      return 'message-left';
    } else {
      return 'message-right';
    }
  }

  async fetchOtherUser(trip: any): Promise<any> {
    const otherUserId = this.userId === trip.requesting.id ? trip.drive.user.id : trip.requesting.id;
    const url = `http://localhost:8000/user/${otherUserId}`;
    try {
      const user = await this.http.get<any>(url).toPromise();
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  getInitials(user: any): string {
    if (!user) return '';
    const firstNameInitial = user.firstName.charAt(0).toUpperCase();
    const lastNameInitial = user.lastName.charAt(0).toUpperCase();
    return `${firstNameInitial}\n${lastNameInitial}`;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  }

  scrollToBottom(): void {
    if (this.messagesContainer) {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }
  }
  getProfilePicUrl(profilePic: string): string {
    return `${window.location.protocol}//${window.location.host.replace('4200', '8000')}/user/image/${profilePic}`;
  }

  saveUserToService(userId : number): void {
    this.userService.readOtherUser(userId);
  }

  protected readonly window = window;
  protected readonly faPhone = faPhone;
}
