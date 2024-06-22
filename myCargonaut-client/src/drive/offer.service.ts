import { Injectable } from '@angular/core';
import { LocationDrive } from '../app/drive/LocationDrive';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class OfferService {
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
    this.locations = [];

    this.locations[0] = new LocationDrive(1, "", "", "");
    this.locations[1] = new LocationDrive(100, "", "", "");
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
      const dateString = `${this.date.year}-${this.date.month}-${this.date.day}`;

      // Prepare time string in "hh:mm:ss.sss" format
      const timeString = `${this.time}:00.000`;

      // Combine date and time into ISO 8601 format
      const dateTimeString = `${dateString}T${timeString}Z`;

      const requestData = {
        //date: "2024-12-13T18:12:02.549Z",
        date: dateTimeString,
        name: this.name,
        price: this.price,
        seats: this.seats,
        info: this.info,
        smokingAllowed: this.smokingAllowed,
        animalsAllowed: this.animalsAllowed,
        location: this.locations,
      };

      console.log(JSON.stringify(requestData));

      this.http.post("http://localhost:8000/drive/request", requestData, { withCredentials: true }).subscribe(
        response =>{
          //form.resetForm();
          //console.log(response);
          //this.textColor = "successText"
          //this.message = "Anmeldung lief swaggy";
          window.location.href = "/";
          /*setTimeout(() => {
            this.message = "";
            this.textColor = "errorText"
          }, 5000);*/
        },
        error => {
          console.error(error);
          //this.message = error.error.message || "Passwort oder Email stimmt nicht überein";
          /*setTimeout(()=> {
            this.message = "";
          }, 5000);*/
        }
      );
    }
  }
}
