import { inject, Injectable } from '@angular/core';
import { LocationDrive } from '../../drive/LocationDrive';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../user.service';
import { Car } from '../../profile/Car';
import { VehicleService } from '../vehicle.service';
import { Trailer } from '../../profile/Trailer';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  public userService: UserService = inject(UserService);
  public vehicleService: VehicleService = inject(VehicleService);

  stops: LocationDrive[];
  locations: LocationDrive[];

  cars: Car[];
  trailers: Trailer[];

  firstName: string | null = null;
  lastName: string | null = null;

  date: { day: number, month: number, year: number } | null = null;
  time: string | null = null;
  name: string | null = null;
  seats: number | null = null;

  info: number | null = null;
  priceType: number | null = null;

  smokingAllowed: boolean = false;
  animalsAllowed: boolean = false;

  selectedCar: Car | null = null;
  selectedTrailer: Trailer | null = null;

  carId: number | null = null;
  maxCWeight: number | null = null;
  maxCLength: number | null = null;
  maxCWidth: number | null = null;
  maxCHeight: number | null = null;

  trailerId: number | null = null;
  maxTWeight: number | null = null;
  maxTLength: number | null = null;
  maxTWidth: number | null = null;
  maxTHeight: number | null = null;

  startLocation: LocationDrive = new LocationDrive("", "", "");
  endLocation: LocationDrive = new LocationDrive("", "", "");


  pathToImage: string = "empty.png";
  profilePic: string = "";

  price: number | null = null;


  constructor(private http: HttpClient) {
    this.stops = [];
    this.locations = [];
    this.cars = [];
    this.trailers = [];
  }

  readCars() {
    this.vehicleService.readCars().subscribe(
      response => {
        this.cars = response;
      },
      error => {
        console.error(error);
      }
    )
  }

  readTrailers() {
    this.vehicleService.readTrailers().subscribe(
      response => {
        this.trailers = response;
      },
      error => {
        console.error(error);
      }
    )
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

  addStop(stop: LocationDrive): void {
    this.stops.push(stop);
  }

  get getStops() {
    return this.stops;
  }

  createOffer() {
    let offerData;

    if (this.date && this.time && this.selectedCar) {
      const year = this.date.year.toString().padStart(4, '0');
      const month = this.date.month.toString().padStart(2, '0');
      const day = this.date.day.toString().padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;
      const timeString = `${this.time}:00.000`;

      const dateTimeString = `${dateString} ${timeString}`;
      this.locations = [...this.stops]
      this.locations.push(this.endLocation);
      this.locations.unshift(this.startLocation);
      const locationsWithStopNr = this.locations.map((location, index) => {
        let stopNr;

        if (index === 0) {
          // First Stop
          stopNr = 1;
        } else if (index === this.locations.length - 1) {
          // Last Stop
          stopNr = 100;
        } else {
          stopNr = index + 1;
        }
        return {
          ...location,
          stopNr: stopNr
        };
      });

      if (!this.selectedTrailer) {
        offerData = {
          name: this.name,
          carID: this.carId,
          trailerID: null,
          date: dateTimeString,
          price: this.price,
          seats: this.seats,
          smokingAllowed: this.smokingAllowed,
          animalsAllowed: this.animalsAllowed,
          info: this.info,
          maxCWeight: this.maxCWeight,
          maxCLength: this.maxCLength,
          maxCWidth: this.maxCWidth,
          maxCHeight: this.maxCHeight,
          priceType: this.priceType,
          location: locationsWithStopNr
        };
      } else {
        offerData = {
          name: this.name,
          carID: this.carId,
          trailerID: this.trailerId,
          date: dateTimeString,
          price: this.price,
          seats: this.seats,
          smokingAllowed: this.smokingAllowed,
          animalsAllowed: this.animalsAllowed,
          info: this.info,
          maxCWeight: this.maxCWeight,
          maxCLength: this.maxCLength,
          maxCWidth: this.maxCWidth,
          maxCHeight: this.maxCHeight,
          maxTWeight: this.maxTWeight,
          maxTLength: this.maxTLength,
          maxTWidth: this.maxTWidth,
          maxTHeight: this.maxTHeight,
          priceType: this.priceType,
          location: locationsWithStopNr
        };
      }
      this.http.post("http://localhost:8000/drive/offer", offerData, { withCredentials: true }).subscribe(
        () => {
          window.location.href = "/";
        },
        error => {
          console.error(error);
        }
      );
    }
  }
}
