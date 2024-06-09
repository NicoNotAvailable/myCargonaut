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


@Component({
  selector: "app-profile",
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent, AddTrailerComponent, CarOverviewComponent, FaIconComponent, NgOptimizedImage, TrailerOverviewComponent, NgIf],
  templateUrl: "./profile.component.html",
  styleUrl: "./profile.component.css"
})
export class ProfileComponent {
  editState: boolean = false;
  userDesc: boolean = true;
  viewCars: boolean = false;
  viewTrailers: boolean = false;
  addCars: boolean = false;
  addTrailers: boolean = false;

  carId: number = 0;
  trailerId: number = 0;

  public sessionService: SessionService = inject(SessionService);

  protected readonly faUser = faUser;
  protected readonly faCalender = faCalendar;
  protected readonly faSmoking = faSmoking;
  protected readonly faStar = faStar;

  firstName = signal("");
  lastName = signal("");

  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
  birthday: string = "";
  pathToImage: string = "empty.png";

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.readUser();
  }

  readUser(): void {

    const prePath: string = "assets/";

    setTimeout(() => {
      this.pathToImage = "";
      this.firstName.set("Willy");
      this.lastName.set("Wonka");
      const sqlDate = "1968-05-16 00:00:00.000";
      this.birthday = DateUtils.parseDate(sqlDate);
      const imagePath: string = "empty.png";
      this.pathToImage = prePath.concat(imagePath);
      this.sessionService.checkLoginNum();
    }, 200);
    if (this.sessionService.getUserID() != -1) {
      this.http.get<any>("http://localhost:8000/user")
        .subscribe(
          response => {
            console.log("Userdata read successfully", response);
            this.firstName.set(response.firstName);
            this.lastName.set(response.lastName);
            this.birthday = DateUtils.parseDate(response.birthday);
            const imagePath: string = response.profilePic;
            response.profilePic == "empty.png" ? this.pathToImage = "assets/empty.png"
              : this.pathToImage = prePath.concat(imagePath);
            console.log(response)
          },
          error => {

            console.error("There was an error!", error);
          }
        );
    } else {
      //Redirect to 404 Page or (you must be logged in Page)
    }
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
    this.addCars = !this.addCars;
    this.viewCars = !this.viewCars;
  }
  toggleTrailerAdd(newTrailerId: number): void {
    this.addTrailers = !this.addTrailers;
    this.viewTrailers = !this.viewTrailers;
  }
}
