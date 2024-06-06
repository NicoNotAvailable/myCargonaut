import { Component } from '@angular/core';
import { UserDescriptionComponent } from "./user-description/user-description.component";
import { AddCarComponent } from "./add-car/add-car.component";
import { AddTrailerComponent } from "./add-trailer/add-trailer.component";
import { CarOverviewComponent } from "./car-overview/car-overview.component";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {
  faUser,
  faCalendar,
  faSmoking,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { VoidEvent } from "./voidEvent";
import { NgIf } from "@angular/common";
import { TrailerOverviewComponent } from "./trailer-overview/trailer-overview.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent, AddTrailerComponent, CarOverviewComponent, FaIconComponent, NgIf, TrailerOverviewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
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

  protected readonly faUser = faUser;
  protected readonly faCalender = faCalendar;
  protected readonly faSmoking = faSmoking;
  protected readonly faStar = faStar;
}
