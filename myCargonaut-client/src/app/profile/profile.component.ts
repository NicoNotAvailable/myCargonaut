import { Component, computed, signal } from "@angular/core";
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
import { HttpClient } from "@angular/common/http";
import { DateUtils } from "../../../../utils/DateUtils"

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

  firstName = signal('');
  lastName = signal('');

  fullName = computed(() => `${this.firstName()} ${this.lastName()}`);
  birthday: string = "";

  constructor(private http: HttpClient) {}


  ngOnInit(): void {
    this.readUser();
  }

  readUser(): void {
    setTimeout(() => {
      this.firstName.set("Willy");
      this.lastName.set("Wonka");
      const sqlDate = "1968-05-16 00:00:00.000";
      this.birthday = DateUtils.parseDate(sqlDate)

    }, 200)


    //this.fullName = response.firstName + " " + response.lastName;


    /*this.http.get<any>("http://localhost:8000/user")
      .subscribe(
        response => {
          form.resetForm();
          console.log('User added successfully', response);
          this.fullName = response.firstName + " " + response.lastName;
          setTimeout(() => {
            this.message = '';
          }, 5000);

        },
        error => {

          console.error('There was an error!', error);
          this.message = error.error.message || "Bitte überprüfen Sie die Eingabe";
          setTimeout(() => {
            this.message = '';
          }, 5000);
        }
      );*/
  }
}
