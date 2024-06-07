import { Component, inject } from "@angular/core";
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {
  faCar,
  faCircle,
  faCirclePlus,
  faHouse, faPencil,
  faPenSquare,
  faPlus,
  faSignIn,
  faUser
} from "@fortawesome/free-solid-svg-icons";
import { SessionService } from "../services/session.service";

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    NgOptimizedImage,
    FaIconComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

  public sessionService: SessionService = inject(SessionService);

  protected readonly faCar = faCar;
  protected readonly faHouse = faHouse;
  protected readonly faUser = faUser;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;
  protected readonly faCircle = faCircle;
  protected readonly faSignIn = faSignIn;
  protected readonly faPenSquare = faPenSquare;
  protected readonly faPencil = faPencil;

  ngOnInit(): void {
    this.sessionService.checkLogin().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
    });

    this.sessionService.checkLoginNum().then(currentUser => {
      console.log(currentUser);
    });
  }
}
