import { Component, Input, Output, EventEmitter, computed, inject, signal } from "@angular/core";
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
import { DateUtils } from "../../../../../utils/DateUtils";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { response } from "express";

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
  newLang: string = "";
  newEmail: string = "";
  newEmailConfirm: string = "";
  newProfileText: string = "";
  startedSmoking: boolean = false;


  public userService: UserService = inject(UserService);

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



  offeredDrives = signal(0);
  takenDrives = signal(0);

  profileText: string = "";
  distanceDriven: number = 0;
  totalPassengers: number = 0;
  highestWeight: number = 0;
  phoneNumber: string = "";
  languages: string = "";
  email: string = "";

  emailMatchError: boolean = false;
  errorMessage: string = "";

  totalDrives = computed(() => this.offeredDrives() + this.takenDrives());

  ngOnInit(): void {
    this.readUser();
  }

  readUser(): void {
    setTimeout(() => {
    }, 200)
    this.userService.readUser().subscribe(
      response => {
        this.profileText = response.profileText == null || response.profileText === "" ? "Deine Beschreibung..." : response.profileText;
        response.offeredDrives == null? this.offeredDrives.set(1234) : this.offeredDrives.set(response.offeredDrives);
        response.takenDrives == null? this.takenDrives.set(123) : this.takenDrives.set(response.takenDrives);
        this.distanceDriven = response.distanceDriven == null? 0 : response.distanceDriven;
        this.totalPassengers = response.totalPassengers == null? 12 : response.totalPassengers;
        this.highestWeight = response.highestWeight == null? 12 : response.highestWeight;
        this.phoneNumber = response.phoneNumber;
        this.languages = response.languages == null || response.languages === "" ? "Keine Sprache angegeben" : response.languages;
        this.email = response.email;
        this.startedSmoking = response.isSmoker;
      },
      error => {
        console.error("There was an error!", error);
        this.errorMessage = "Email ist ungültig";
      }
    );
  }

  saveUser(form: any): void {
    const userData = {
      email: this.newEmail,
      phoneNumber: this.newPhoneNumber,
      languages: this.newLang,
      profileText: this.newProfileText,
      isSmoker: this.startedSmoking,
    }
    if (this.newEmail === "" || this.newEmail === null) {
      userData.email = this.email;
    }
    if (this.newPhoneNumber === "" || this.newPhoneNumber === null) {
      userData.phoneNumber = this.phoneNumber;
    }
    if (this.newProfileText === "" || this.newProfileText === null) {
      userData.profileText = this.profileText;
    }
    if (this.newLang === "" || this.newLang === null) {
      userData.languages = this.languages;
    }
    this.userService.editUser(userData).subscribe(
      response => {
        setTimeout(()=>{
          window.location.reload();
        }, 200);
      }, error => {
        console.error("There was an error!", error);
      }
    )

    this.changeEditState();
  }

  validateEmailConfirmation() {
    if (this.newEmail !== this.newEmailConfirm) {
      this.emailMatchError = true;
    } else {
      this.emailMatchError = false;
    }
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
}
