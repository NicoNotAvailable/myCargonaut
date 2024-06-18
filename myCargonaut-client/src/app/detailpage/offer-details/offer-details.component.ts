import { Component, Input } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DatePipe, NgForOf, NgIf, NgOptimizedImage } from "@angular/common";
import {StopLocation} from "../Location";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import {faStar} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-offer-details',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    NgOptimizedImage,
    NgForOf,
    FaIconComponent
  ],
  templateUrl: './offer-details.component.html',
  styleUrl: './offer-details.component.css'
})

export class OfferDetailsComponent {
  @Input() offer!: number;

  offerId: number = 0;
  userId: number = 0;
  userFirstname: string = "";
  userLastname: string = "";
  userSmoker: boolean = false;
  userPfp: string = "";

  carId: number = 0;
  carPicture: string = "";
  carModel: string = "";
  carTV: boolean = false;
  carAC: boolean = false;
  maxHeight: number = 0;
  maxLength: number = 0;
  maxWidth: number = 0;
  maxWeight: number = 0;
  smokinAllowance: boolean = false;
  seats: number = 0;
  animalsAllowed: boolean = false;

  date: Date = new Date();
  tripInfo: string = "";
  locations: StopLocation[] = [];
  midLocations: StopLocation[] = [];
  price: number = 0;
  priceType: string = "";
  title: string = "";

  trailerId: number | null = null;
  maxHeightTrailer: number | null = null;
  maxWidthTrailer: number | null = null;
  maxLengthTrailer: number | null = null;
  maxWeightTrailer: number | null = null;



  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.getOffer();
  }

  getOffer(): void {
    this.http.get("http://localhost:8000/drive/offer/" + this.offer, { withCredentials: true }).subscribe(
      (response: any) => {
        this.offerId = response.id;
        this.userId = response.user.id;
        this.userFirstname = response.user.firstName;
        this.userLastname = response.user.lastName;
        this.userSmoker = response.user.isSmoker;
        this.userPfp = response.user.profilePic;
        this.carId = response.carID;
        this.carPicture = response.carPicture;
        this.date = response.date;
        this.tripInfo = this.formatInfoType(response.info);
        this.maxHeight = response.maxCHeight;
        this.maxLength = response.maxCLength;
        this.maxWidth = response.maxCWidth;
        this.maxWeight = response.maxCWeight;
        this.price = response.price;
        this.priceType = this.formatPriceType(response.priceType);
        this.title = response.name;
        this.smokinAllowance = response.smokingAllowed;
        this.seats = response.seats;
        this.animalsAllowed = response.animalsAllowed;
        this.trailerId = response.trailerID == null || false ? null : response.trailerID;
        this.maxHeightTrailer = response.maxTHeight == null || false ? null : response.maxTHeight;
        this.maxWidthTrailer = response.maxTWidth == null || false ? null : response.maxTWidth;
        this.maxLengthTrailer = response.maxTLength == null || false ? null : response.maxTLength;
        this.maxWeightTrailer = response.maxTWeight == null || false ? null : response.maxTWeight;
        setTimeout(()=> {
          this.getLocations(response.locations);
          this.getCarModel(this.carId);
          this.filterMidStop();
          this.getUserRating(this.userId);
        }, 100);
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

  getCarModel(id: number): void {
    this.http.get("http://localhost:8000/vehicle/car/" + id, { withCredentials: true }).subscribe(
      (response: any) => {
        this.carModel = response.name;
        this.carTV = response.hasTelevision;
        this.carAC = response.hasAC;
      },
      error => {
        console.error(error);
      }
    )
  }

  getUserRating(id: number): void {
    //todo
  }

  formatPriceType(num: number): string {
    switch (num){
      case 1: {
        return "Per Trip";
      }
      case 2: {
        return "Pro Person";
      }
      case 3: {
        return "Pro KG";
      }
    }
    return "Fehler";
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

  filterMidStop(): void {
    for (const element of this.locations) {
      if (element.stopNr != 100 && element.stopNr != 0) {
        this.midLocations.push(element);
      }
    }
  }

  startRequest(): void {

  }

  protected readonly window = window;
}
