import { Component, computed, inject, signal } from "@angular/core";
import { UserDescriptionComponent } from "./user-description/user-description.component";
import { AddCarComponent } from "./add-car/add-car.component";
import { AddTrailerComponent } from "./add-trailer/add-trailer.component";
import { CarOverviewComponent } from "./car-overview/car-overview.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  faUser,
  faCalendar,
  faSmoking,
  faStar
} from "@fortawesome/free-solid-svg-icons";
import { NgIf } from "@angular/common";
import { TrailerOverviewComponent } from "./trailer-overview/trailer-overview.component";
import { HttpClient } from "@angular/common/http";
import { DateUtils } from "../../../../utils/DateUtils";
import { NgOptimizedImage } from "@angular/common";
import { SessionService } from "../services/session.service";
import { UserService } from "../services/user.service";


@Component({
  selector: "app-profile",
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent, AddTrailerComponent, CarOverviewComponent, FaIconComponent, NgOptimizedImage, TrailerOverviewComponent, NgIf],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent {
  isLoggedIn: boolean = false;

  editState: boolean = false;
  userDesc: boolean = true;
  viewCars: boolean = false;
  viewTrailers: boolean = false;
  addCars: boolean = false;
  addTrailers: boolean = false;

  carId: number = 0;
  trailerId: number = 0;
  smoker: string = "";

  loaded: boolean = false;

  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);


  protected readonly faUser = faUser;
  protected readonly faCalender = faCalendar;
  protected readonly faSmoking = faSmoking;
  protected readonly faStar = faStar;

  firstName = signal("");
  lastName = signal("");

  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
  birthday: string = "";
  pathToImage: string = "empty.png";
  profilePic: string = "";

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      } else {
        this.readUser();
        setTimeout(()=>{
          this.loaded = true;
        }, 100);
      }
    });
  }

  readUser(): void {

    const prePath: string = "assets/";

    setTimeout(() => {
      this.pathToImage = "";
      const imagePath: string = "empty.png";
      this.pathToImage = prePath.concat(imagePath);
      this.sessionService.checkLoginNum();
    }, 200);
    this.userService.readUser().subscribe(
      response => {
        console.log("Userdata read successfully", response);
        this.firstName.set(response.firstName);
        this.lastName.set(response.lastName);
        this.birthday = DateUtils.parseDate(response.birthday);
        const imagePath: string = response.profilePic;
        this.profilePic = response.profilePic;
        this.pathToImage = imagePath === "empty.png" ? "assets/empty.png" : prePath.concat(imagePath);
        this.smoker = this.formatSmokeBool(response.isSmoker);
      },
      error => {
        console.error("There was an error!", error);
      }
    );
  }

  formatSmokeBool(bool: boolean): string{
    return !bool? "Nicht Raucher" : "Raucher";
  }

  toggleEditing(): void {
    this.editState = !this.editState;
  }

  toggleCarView(): void {
    this.viewCars = !this.viewCars;
    this.userDesc = !this.userDesc;
  }

  toggleTrailerView(): void {
    this.viewTrailers = !this.viewTrailers;
    this.userDesc = !this.userDesc;
  }

  toggleCarAdd(newCarId: number): void {
    this.carId = newCarId;
    this.addCars = !this.addCars;
    this.viewCars = !this.viewCars;
  }

  toggleTrailerAdd(newTrailerId: number): void {
    this.trailerId = newTrailerId;
    this.addTrailers = !this.addTrailers;
    this.viewTrailers = !this.viewTrailers;
  }

  protected readonly window = window;
}
