import { Component, Input, Output, EventEmitter, computed, inject, signal } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faPenToSquare,
  faCar,
  faPhone,
  faEnvelope,
  faCompass,
  faLanguage,
  faUsers,
  faWeight, faSave, faXmark, faExplosion, faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DateUtils } from '../../../../../utils/DateUtils';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { response } from 'express';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-description',
  standalone: true,
  imports: [FaIconComponent, NgIf, FormsModule],
  templateUrl: './user-description.component.html',
  styleUrl: './user-description.component.css',
})
export class UserDescriptionComponent {

  constructor(private http: HttpClient, private router: Router) {}

  @Input() editState!: boolean;
  @Output() changeEdit = new EventEmitter<void>();
  @Output() changeViewCar = new EventEmitter<void>();
  @Output() changeViewTrailer = new EventEmitter<void>();

  newPhoneNumber: string = '';
  newLang: string = '';
  newEmail: string = '';
  newEmailConfirm: string = '';
  newProfileText: string = '';
  startedSmoking: boolean = false;
  newFirstname: string = '';
  newLastname: string = '';
  newPfp: any = "";


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
  protected readonly faTrash = faTrash;


  offeredDrives = signal(0);
  takenDrives = signal(0);

  profileText: string = '';
  distanceDriven: number = 0;
  totalPassengers: number = 0;
  highestWeight: number = 0;
  phoneNumber: string = '';
  languages: string = '';
  email: string = '';
  deleteBoolean: boolean = false;
  isLoggedIn: boolean = false;



  emailMatchError: boolean = false;
  errorMessage: string = '';

  imgUpload: boolean = false;

  totalDrives = computed(() => this.offeredDrives() + this.takenDrives());

  ngOnInit(): void {
    this.readUser();
  }

  readUser(): void {
    setTimeout(() => {
    }, 200);
    this.userService.readUser().subscribe(
      response => {
        this.newFirstname = response.firstName;
        this.newLastname = response.lastName;
        this.profileText = response.profileText == null || response.profileText === '' ? 'Deine Beschreibung...' : response.profileText;
        response.offeredDrives == null ? this.offeredDrives.set(1234) : this.offeredDrives.set(response.offeredDrives);
        response.takenDrives == null ? this.takenDrives.set(123) : this.takenDrives.set(response.takenDrives);
        this.distanceDriven = response.distanceDriven == null ? 0 : response.distanceDriven;
        this.totalPassengers = response.totalPassengers == null ? 12 : response.totalPassengers;
        this.highestWeight = response.highestWeight == null ? 12 : response.highestWeight;
        this.phoneNumber = response.phoneNumber;
        this.languages = response.languages == null || response.languages === '' ? 'Keine Sprache angegeben' : response.languages;
        this.email = response.email;
        this.startedSmoking = response.isSmoker;
      },
      error => {
        console.error('There was an error!', error);
        this.errorMessage = 'Email ist ungültig';
        this.removeErrorMessage();
      },
    );
  }

  saveUser(form: any): void {
    const userData = {
      email: this.newEmail,
      phoneNumber: this.newPhoneNumber,
      languages: this.newLang,
      profileText: this.newProfileText,
      isSmoker: this.startedSmoking,
      firstName: this.newFirstname,
      lastName: this.newLastname,
    };
    if (this.newEmail === '' || this.newEmail === null) {
      userData.email = this.email;
    }
    if (this.newPhoneNumber === '' || this.newPhoneNumber === null) {
      userData.phoneNumber = this.phoneNumber;
    }
    if (this.newProfileText === '' || this.newProfileText === null) {
      userData.profileText = this.profileText;
    }
    if (this.newLang === '' || this.newLang === null) {
      userData.languages = this.languages;
    }
    this.userService.editUser(userData).subscribe(
      response => {
        setTimeout(() => {
          window.location.reload();
        }, 200);
      }, error => {
        console.error('There was an error!', error);
      },
    );

    this.changeEditState();
  }

  enableImgUpload(): void {
    this.imgUpload = !this.imgUpload;
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.newPfp = e.target.result;
      };
      reader.readAsDataURL(file);
      const formData: FormData = new FormData();
      formData.append("file", file);

      this.http.post("http://localhost:8000/user/upload-profile-picture", formData, { withCredentials: true }).subscribe(
        response => {
          this.enableImgUpload();
        },
        error => {
          console.error(error);
          this.errorMessage = "Etwas ist schiefgelaufen";
          this.removeErrorMessage();
        }
      );
      return;
    }
    this.errorMessage = "Bitte lade ein Bild von deinem Auto hoch.";
    this.removeErrorMessage();
  }

  removeErrorMessage(): void {
    setTimeout(() =>{
      this.errorMessage = "";
    }, 5000);
  }

  validateEmailConfirmation() {
    if (this.newEmail !== this.newEmailConfirm) {
      this.emailMatchError = true;
    } else {
      this.emailMatchError = false;
    }
  }

  changeEditState(): void {
    this.newPhoneNumber = '';
    this.newEmail = '';
    this.newEmailConfirm = '';
    this.changeEdit.emit();
  }

  changeViewCarState(): void {
    this.changeViewCar.emit();
  }

  changeViewTrailerState(): void {
    this.changeViewTrailer.emit();
  }

  deleteUserQuestion() {
    console.log("deleteUserQuestion");
    this.deleteBoolean = !this.deleteBoolean;
  }

  deleteUser(): void {
    this.http.put('http://localhost:8000/user/delete', {}, { // Empty body
      withCredentials: true,
      headers: { 'Content-Type': 'application/json' },
    }).subscribe(data => {
      console.log(data);
      this.runLogOut()
      this.router.navigate(['/'])
    }, error => {
      console.error("There was an error!");

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
