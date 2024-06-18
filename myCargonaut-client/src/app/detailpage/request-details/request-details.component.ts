import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DatePipe, NgForOf, NgOptimizedImage } from "@angular/common";
import { StopLocation } from "../Location";
import { Cargo } from "../Cargo";

@Component({
  selector: 'app-request-details',
  standalone: true,
  imports: [
    DatePipe,
    NgForOf,
    NgOptimizedImage
  ],
  templateUrl: './request-details.component.html',
  styleUrl: './request-details.component.css'
})

export class RequestDetailsComponent {
  @Input() request!: number;

  userId: number = 0;
  userFirstname: string = "";
  userLastname: string = "";
  userSmoker: boolean = false;
  userPfp: string = "";

  title: string = "";
  date: Date = new Date();
  tripInfo: string = "";
  price: number = 0;
  languages: string = "";
  seats: number = 0;
  locations: StopLocation[] = [];
  midLocations: StopLocation[] = [];
  withAnimal: boolean = false;

  cargos: Cargo[] = [];



  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRequest();
  }

  getRequest(): void {
    this.http.get("http://localhost:8000/drive/request/" + this.request, { withCredentials: true }).subscribe(
      (response: any) => {
        console.log(response);
        this.userId = response.user.id;
        this.userFirstname = response.user.firstName;
        this.userLastname = response.user.lastName;
        this.userSmoker = response.user.isSmoker;
        this.userPfp = response.user.profilePic;
        this.languages = response.user.languages;
        this.seats = response.seats;
        this.title = response.name;
        this.withAnimal = response.animalsAllowed;
        this.price = response.price;
        this.date = response.date;
        this.tripInfo = this.formatInfoType(response.info);
        setTimeout(()=> {
          this.getLocations(response.locations);
          this.getCargo(response.cargo);
        }, 200);
      },
      error => {
        console.error(error);
      }
    )
  }

  getLocations(locations: any[]): void {
    for(const element of locations) {
      let newLocation: StopLocation = new StopLocation(element.stopNr, element.country, element.zipCode, element.city);
      this.locations.push(newLocation);
    }
  }

  getCargo(cargos: any[]): void {
    for (const element of cargos) {
      let newCargo: Cargo = new Cargo(element.description, element.height, element.length, element.weight, element.width);
      this.cargos.push(newCargo);
    }
  }

  getUserRating(id: number): void {
    //todo
  }

  formatInfoType(num: number): string {
    switch (num){
      case 1: {
        return "nur Musik hören";
      }
      case 2: {
        return "Mit Unterhaltung"
      }
      case 3: {
        return "Anpassbar, je nach Belieben";
      }
    }
    return "";
  }

  getStop(stopNr: number): StopLocation {
    for (const element of this.locations) {
      if (element.stopNr == stopNr) {
        return element;
      }
    }
    return new StopLocation(-1, "Moon", 45464, "Area 51");
  }

  startRequest(): void {

  }

  protected readonly window = window;
}
