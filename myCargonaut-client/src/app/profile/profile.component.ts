import { Component } from '@angular/core';
import { UserDescriptionComponent } from "./user-description/user-description.component";
import { AddCarComponent } from "./add-car/add-car.component";
import { AddTrailerComponent } from "./add-trailer/add-trailer.component";
import { CarOverviewComponent } from "./car-overview/car-overview.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent, AddTrailerComponent, CarOverviewComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
