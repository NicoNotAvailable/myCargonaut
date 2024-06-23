import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Cargo } from '../app/drive/Cargo';
import { LocationDrive } from '../app/drive/LocationDrive';
import { DateUtils } from '../../../utils/DateUtils';
import { UserService } from '../app/services/user.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  public userService: UserService = inject(UserService);

  cargos: Cargo[]
  locations: LocationDrive[]

  firstName: string | null = null;
  lastName: string | null = null;

  date: { day: number, month: number, year: number } | null = null;
  time: string | null = null;
  name: string | null = null;
  seats: number | null = null;
  info: number | null = null;
  smokingAllowed: boolean = false;
  animalsAllowed: boolean = false;

  pathToImage: string = "empty.png";
  profilePic: string = "";

  price: number | null = null;


  constructor(private http: HttpClient) {
    this.cargos = [];
    this.locations = [];

    this.locations[0] = new LocationDrive("", "", "");
    this.locations[1] = new LocationDrive("", "", "");
  }

  readUser() {
    const prePath: string = "assets/";

    this.userService.readUser().subscribe(

      response => {
        this.firstName = response.firstName;
        this.lastName = response.lastName;

        const imagePath: string = response.profilePic;
        this.profilePic = response.profilePic;
        this.pathToImage = imagePath === "empty.png" ? "assets/empty.png" : prePath.concat(imagePath);
      },
      error => {
        console.error("There was an error!", error);
      }
    );
  }

  addCargo(cargo: Cargo): void {
    this.cargos.push(cargo);
  }

  get getCargos() {
    return this.cargos;
  }

  setSmokingAllowed(value: boolean) {
    this.smokingAllowed = value;
  }

  setAnimalsAllowed(value: boolean) {
    this.animalsAllowed = value;
  }

  createRequest() {
    // Prepare date string in "yyyy-mm-dd" format
    if (this.date && this.time) {
      const year = this.date.year.toString().padStart(4, '0');
      const month = this.date.month.toString().padStart(2, '0');
      const day = this.date.day.toString().padStart(2, '0');

      const dateString = `${year}-${month}-${day}`;
      const timeString = `${this.time}:00.000`;

      const dateTimeString = `${dateString} ${timeString}`;

      const locationsWithStopNr = [
        { ...this.locations[0], stopNr: 1 },
        { ...this.locations[1], stopNr: 100 }
      ];

      const requestData = {
        date: dateTimeString,
        name: this.name,
        price: this.price,
        seats: this.seats,
        info: this.info,
        smokingAllowed: this.smokingAllowed,
        animalsAllowed: this.animalsAllowed,
        cargo: this.cargos,
        location: locationsWithStopNr,
      };
      this.http.post("http://localhost:8000/drive/request", requestData, { withCredentials: true }).subscribe(
        response =>{
          window.location.href = "/";
        },
        error => {
          console.error(error);
        }
      );
    }
  }
}
