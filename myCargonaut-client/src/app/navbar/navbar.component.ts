import { Component, Inject, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, NgIf, NgOptimizedImage, CommonModule } from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faCar,
  faCircle,
  faCirclePlus, faComment,
  faHouse, faPencil,
  faPenSquare,
  faPlus,
  faSignIn,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { SessionService } from "../services/session.service";
import { HttpClient, HttpClientModule } from "@angular/common/http";
import { SocketService } from '../services/socket.service';
import { error } from "@angular/compiler-cli/src/transformers/util";
import { offerTrips } from "../meineAnfragenGesuche/offerTrips";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    NgIf,
    CommonModule,
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {

  private sessionService: SessionService = inject(SessionService);
  private socketService: SocketService = inject(SocketService);
  protected notificationService: NotificationService = inject(NotificationService);

  protected readonly faCar = faCar;
  protected readonly faHouse = faHouse;
  protected readonly faUser = faUser;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;
  protected readonly faCircle = faCircle;
  protected readonly faSignIn = faSignIn;
  protected readonly faPenSquare = faPenSquare;
  protected readonly faPencil = faPencil;
  protected readonly faComment = faComment;

  isLoggedIn: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object, private http: HttpClient) {
    if (isPlatformBrowser(this.platformId)) {
      this.socketService.init();
    }
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(currentUser => {
      if (currentUser != -1){
        this.isLoggedIn = true;
        console.log(currentUser + ' heyyyyyyyyyyyyyyyyyyyyyyy');
        this.socketService.emit('register', currentUser);
        this.joinChatRooms(currentUser);
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  runLogOut(): void {
    this.http.delete("http://localhost:8000/session/logout", { withCredentials: true }).subscribe(
      response => {
        this.isLoggedIn = false;
        window.location.href = "/";
      },
      error => {
        console.log(error);
      }
    )
  }

  private joinChatRooms(userId: number): void {
    this.http.get(`http://localhost:8000/trip/user-trips/${userId}`, { withCredentials: true }).subscribe(
      (response: any) => {
        if (response) {
          console.log('joinChatRooms FUNC');
          console.log(response);
          response.offerTrips.forEach((trip: any) => {
            this.joinRoom(userId, trip.id);
          });

          // Joining request trips rooms
          response.requestTrips.forEach((trip: any) => {
            this.joinRoom(userId, trip.id);
          });

          // Joining offer drive trips rooms
          response.offerDriveTrips.forEach((trip: any) => {
            this.joinRoom(userId, trip.id);
          });

          // Joining request drive trips rooms
          response.requestDriveTrips.forEach((trip: any) => {
            this.joinRoom(userId, trip.id);
          });
        }
      },
      error => {
        console.error('Error fetching user trips:', error);
      }
    );
  }

  private joinRoom(userId: number, tripId: number): void {
    const room = `trip_${tripId}`;
    const payload = { userId, tripId };

    this.socketService.emit('createOrJoinRoom', payload);
    console.log(`Requested to join room: ${room}`);

    this.socketService.on('message').subscribe((message: any) => {
      if (!window.location.href.includes('/chats')) {
        this.notificationService.showNotification(`Du hast eine neue Nachricht im Raum ${room}: ${message.message}`);
      }
    });
  }
}
