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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent, AddTrailerComponent, CarOverviewComponent, FaIconComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

  protected readonly faUser = faUser;
  protected readonly faCalender = faCalendar;
  protected readonly faSmoking = faSmoking;
  protected readonly faStar = faStar;
}
