import { Component, Inject, inject, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser, NgIf, NgOptimizedImage } from "@angular/common";
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

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public sessionService: SessionService = inject(SessionService);
  private socketService: SocketService = inject(SocketService);

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
}
