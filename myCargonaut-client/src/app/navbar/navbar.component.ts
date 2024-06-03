import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faCar, faCircle, faCirclePlus, faHouse, faPlus, faSignIn, faUser} from "@fortawesome/free-solid-svg-icons";

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

  protected readonly faCar = faCar;
  protected readonly faHouse = faHouse;
  protected readonly faUser = faUser;
  protected readonly faCirclePlus = faCirclePlus;
  protected readonly faPlus = faPlus;
  protected readonly faCircle = faCircle;
  protected readonly faSignIn = faSignIn;
}
