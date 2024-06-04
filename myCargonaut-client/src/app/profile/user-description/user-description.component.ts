import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  faPenToSquare,
  faCar,
  faPhone,
  faEnvelope,
  faCompass,
  faLanguage,
  faUsers,
  faWeight,
} from "@fortawesome/free-solid-svg-icons"

@Component({
  selector: 'app-user-description',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './user-description.component.html',
  styleUrl: './user-description.component.css'
})
export class UserDescriptionComponent {

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faCar = faCar;
  protected readonly faPhone = faPhone;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faCompass = faCompass;
  protected readonly faLanguage = faLanguage;
  protected readonly faUsers = faUsers;
  protected readonly faWeight = faWeight;
}
