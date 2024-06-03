import { Component } from '@angular/core';
import { UserDescriptionComponent } from "./user-description/user-description.component";
import { AddCarComponent } from "./add-car/add-car.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [UserDescriptionComponent, AddCarComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {

}
