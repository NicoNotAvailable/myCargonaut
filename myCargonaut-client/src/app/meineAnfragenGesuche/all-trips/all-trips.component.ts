import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { DateFormatPipe } from '../../search/date-format.pipe';
import { offer } from '../../search/offers';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { SearchCardComponent } from '../../search/search-main/search-card/search-card.component';
import { TripService } from '../../services/trip-service.service';

import {LOCALE_ID} from '@angular/core';
import {registerLocaleData} from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';

@Component({
  selector: 'app-all-trips',
  standalone: true,
  imports: [
    TopAuswahlComponent,
    SearchCardComponent,
    NgOptimizedImage,
    DateFormatPipe,
    NgForOf,
    NgIf,
    NgClass,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.css']
})
export class AllTripsComponent {

  @Output() tripIdSend = new EventEmitter<any>();

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);
  public tripService: TripService = inject(TripService);

  allRequests: any = [];
  pathToImage: string = 'empty.png';
  pathToImageArray: string[] = [];
  allOffers: any = [];
  activeTrips: any = [];
  oneAndTwoTrips: any = [];
  userID: number | undefined

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(currentUser => {
      if (currentUser != -1) {
        this.isLoggedIn = true;
        this.userID = currentUser;

        this.getAllTrips();
        this.loadTripsData();
      } else {
        this.isLoggedIn = false;
      }
    });
  }

  loadTripsData() {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn !== -1;
      if (!this.isLoggedIn && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });


  }

  getAllTrips() {
    console.log("getAllTripsData");
    this.activeTrips = []

    //const prePath: string = '/vehicle/image/';
    this.http.get(`http://localhost:8000/trip/user-trips/${this.userID}`, { withCredentials: true }).subscribe(
      (response: any) => {
        this.checkTrips(response.offerTrips);
        this.checkTrips(response.requestTrips);
        this.checkTrips(response.offerDriveTrips);
        this.checkTrips(response.requestDriveTrips);

        // Combine all trips to process additional data
        const allTrips = [...this.activeTrips, ...this.oneAndTwoTrips];

        // Fetch additional data for each trip's drive
        allTrips.forEach(trip => {
          this.getDriveDataOffer(trip.drive.id);
          this.getDriveDataRequest(trip.drive.id)
        });


        console.log("All Activ Trips" );
        console.log( this.activeTrips);
        console.log("Status 1 or 2 ")
        console.log(this.oneAndTwoTrips)


      },
      error => {
        console.error('Error fetching trips:', error);
      }
    );
  }

  checkTrips(trips: any[]) {
    trips.forEach(trip => {
      // Check if drive status is 3, 4, or 5
      if (trip?.drive?.status === 3 || trip?.drive?.status === 4 || trip?.drive?.status === 5) {
        this.activeTrips.push(trip);
      }
      // Check if drive status is 0, 1, or 2 and requesting user ID matches
      else if ((trip?.drive?.status === 0 || trip?.drive?.status === 1 || trip?.drive?.status === 2) && (trip?.requesting?.id === this.userID)) {
        this.oneAndTwoTrips.push(trip);
      } else if ((trip?.drive?.id === this.userID) && (trip?.drive?.status === 1)) {
        this.oneAndTwoTrips.push(trip);
      }
    });
  }

  getDriveDataOffer(driveID: number) {
    this.http.get(`http://localhost:8000/drive/offer/${driveID}`, { withCredentials: true }).subscribe(
      (response: any) => {
        // Update the trip in activeTrips if it matches the drive ID
        let tripToUpdate = this.activeTrips.find((trip: { drive: { id: number; }; }) => trip.drive.id === driveID);

        // If not found in activeTrips, search in oneAndTwoTrips
        if (!tripToUpdate) {
          tripToUpdate = this.oneAndTwoTrips.find((trip: { drive: { id: number; }; }) => trip.drive.id === driveID);
        }

        // If a matching trip is found, merge the additional data
        if (tripToUpdate) {
          Object.assign(tripToUpdate.drive, response);
          console.log(`Updated trip with drive ID ${driveID}:`, tripToUpdate);
        }


      },
      error => {
        console.error('Error fetching drive data:', error);
      }
    );
  }

  getDriveDataRequest(driveID: number) {
    this.http.get(`http://localhost:8000/drive/request/${driveID}`, { withCredentials: true }).subscribe(
      (response: any) => {
        // Update the trip in activeTrips if it matches the drive ID
        let tripToUpdate = this.activeTrips.find((trip: { drive: { id: number; }; }) => trip.drive.id === driveID);

        // If not found in activeTrips, search in oneAndTwoTrips
        if (!tripToUpdate) {
          tripToUpdate = this.oneAndTwoTrips.find((trip: { drive: { id: number; }; }) => trip.drive.id === driveID);
        }

        // If a matching trip is found, merge the additional data
        if (tripToUpdate) {
          Object.assign(tripToUpdate.drive, response);
          console.log(`Updated trip with drive ID ${driveID}:`, tripToUpdate);
        }


      },
      error => {
        console.error('Error fetching drive data:', error);
      }
    );
  }

  handleButtonClickStatus(number: number) {
    this.sendTripId(number)
  }

  sendTripId(number: number) {
    this.tripService.changeTripId(number);  // Update the trip ID in the service
    this.router.navigate(['/review']);      // Navigate to the review route
  }

  toPaymentPage(id: number, priceType: number) {
    if (!priceType) {
      this.router.navigate(['/request/' + id + '/payment'], { queryParams: { this: id } });
    } else {
      this.router.navigate(['/offer/' + id + '/payment'], { queryParams: { this: id } });
    }
  }

  finishedDrive(tripId: number) {
    console.log("finishedDrive");
    this.http.put(`http://localhost:8000/drive/status/${tripId}`, { newStatus: 4}, {withCredentials: true}).subscribe(
      (response: any) => {
        this.ngOnInit()

      },
      error => {
        console.error('Error fetching requests:', error);
      }
    );
  }

  protected readonly window = window;
}
