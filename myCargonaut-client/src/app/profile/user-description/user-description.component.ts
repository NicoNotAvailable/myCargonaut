import { Component, Input, Output, EventEmitter } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  faPenToSquare,
  faCar,
  faPhone,
  faEnvelope,
  faCompass,
  faLanguage,
  faUsers,
  faWeight, faSave, faXmark
} from "@fortawesome/free-solid-svg-icons";
import { NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-user-description',
  standalone: true,
  imports: [FaIconComponent, NgIf, FormsModule],
  templateUrl: './user-description.component.html',
  styleUrl: './user-description.component.css'
})
export class UserDescriptionComponent {
  @Input() editState!: boolean;
  @Output() changeEdit= new EventEmitter<void>();
  @Output() changeViewCar  = new EventEmitter<void>();
  @Output() changeViewTrailer = new EventEmitter<void>();

  newPhoneNumber: string = "";

  newEmail: string = "";
  newEmailConfirm: string = "";

  saveUser(): void {

    this.changeEditState();
  }

  changeEditState(): void {
    this.newPhoneNumber = "";
    this.newEmail = "";
    this.newEmailConfirm = "";
    this.changeEdit.emit();
  }

  changeViewCarState(): void {
    this.changeViewCar.emit();
  }
  changeViewTrailerState(): void {
    this.changeViewTrailer.emit();
  }

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faCar = faCar;
  protected readonly faPhone = faPhone;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faCompass = faCompass;
  protected readonly faLanguage = faLanguage;
  protected readonly faUsers = faUsers;
  protected readonly faWeight = faWeight;
  protected readonly faSave = faSave;
  protected readonly faXmark = faXmark;
}
