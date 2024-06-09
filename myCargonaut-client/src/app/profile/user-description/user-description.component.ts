import { Component, computed, inject, signal } from "@angular/core";
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
import { FormsModule } from "@angular/forms";
import { DateUtils } from "../../../../../utils/DateUtils";
import { HttpClient } from "@angular/common/http";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";

@Component({
  selector: 'app-user-description',
  standalone: true,
  imports: [FaIconComponent, FormsModule],
  templateUrl: './user-description.component.html',
  styleUrl: './user-description.component.css'
})
export class UserDescriptionComponent {

  public userService: UserService = inject(UserService);

  protected readonly faPenToSquare = faPenToSquare;
  protected readonly faCar = faCar;
  protected readonly faPhone = faPhone;
  protected readonly faEnvelope = faEnvelope;
  protected readonly faCompass = faCompass;
  protected readonly faLanguage = faLanguage;
  protected readonly faUsers = faUsers;
  protected readonly faWeight = faWeight;


  offeredDrives = signal(0);
  takenDrives = signal(0);

  profileText: string = "";
  distanceDriven: number = 0;
  totalPassengers: number = 0;
  highestWeight: number = 0;
  phoneNumber: string = "";
  email: string = "";

  totalDrives = computed(() => this.offeredDrives() + this.takenDrives());

  ngOnInit(): void {
    this.readUser();
  }

  readUser(): void {
    setTimeout(() => {
      this.profileText = "TestText"
      this.offeredDrives.set(1234);
      this.takenDrives.set(123);
      this.distanceDriven = 0;
      this.totalPassengers = 12;
      this.highestWeight = 12;
      this.phoneNumber = "+12321321";
      this.email = "elontusk@tesla.jo";
    }, 200)
    this.userService.readUser().subscribe(
      response => {
        console.log("Userdata read successfully", response);
        this.profileText = response.profileText;
        this.offeredDrives.set(response.offeredDrives);
        this.takenDrives.set(response.takenDrives);
        this.distanceDriven = response.distanceDriven;
        this.totalPassengers = response.totalPassengers;
        this.highestWeight = response.highestWeight;
        this.phoneNumber = response.phoneNumber;
        this.email = response.email;
      },
      error => {
        console.error("There was an error!", error);
      }
    );
  }
}
