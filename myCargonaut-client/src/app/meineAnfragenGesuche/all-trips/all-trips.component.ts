import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { DateFormatPipe } from '../../search/date-format.pipe';
import {CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import { SearchCardComponent } from '../../search/search-main/search-card/search-card.component';
import { TripService } from '../../services/trip-service.service';

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

  /**
   * Lifecycle hook that is called after the component is initialized.
   * It checks if the user is logged in and if so, loads all trips data.
   */
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

  /**
   * Loads additional trip data and verifies user login status.
   * Redirects to the homepage if the user is not logged in.
   */
  loadTripsData() {
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn !== -1;
      if (!this.isLoggedIn && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });


  }

  /**
   * Fetches all trips associated with the logged-in user from the server.
   * Processes and categorizes the trips based on their status.
   */
  getAllTrips() {
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
      },
      error => {
        console.error('Error fetching trips:', error);
      }
    );
  }

  /**
   * Checks and categorizes trips based on their drive status and user involvement.
   * @param trips - The array of trips to check.
   */
  checkTrips(trips: any[]) {
    trips.forEach(trip => {
      // Check if drive status is 3, or 4
      if (trip?.drive?.status === 3 || trip?.drive?.status === 4) {
        this.activeTrips.push(trip);
      }
      // Check if drive status is 0, 1, or 2 and requesting user ID matches
      else if ((trip?.drive?.status === 0 || trip?.drive?.status === 1 || trip?.drive?.status === 2) && (trip?.requesting?.id === this.userID)) {
        this.oneAndTwoTrips.push(trip);
      }
    });
  }

  /**
   * Fetches additional data for an offered drive and updates the corresponding trip.
   * @param driveID - The ID of the drive to fetch data for.
   */
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
        }


      },
      error => {
        console.error('Error fetching drive data:', error);
      }
    );
  }

  /**
   * Fetches additional data for a requested drive and updates the corresponding trip.
   * @param driveID - The ID of the drive to fetch data for.
   */
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
        }


      },
      error => {
        console.error('Error fetching drive data:', error);
      }
    );
  }

  /**
   * Handles button click events for changing the trip status.
   * @param number - The ID of the trip to send.
   */
  handleButtonClickStatus(number: number) {
    this.sendTripId(number)
  }

  /**
   * Sends the selected trip ID to the trip service and navigates to the review page.
   * @param number - The ID of the trip to send.
   */
  sendTripId(number: number) {
    this.tripService.changeTripId(number);  // Update the trip ID in the service
    this.router.navigate(['/review']);      // Navigate to the review route
  }

  /**
   * Navigates to the payment page based on the trip ID and price type.
   * @param id - The ID of the trip.
   * @param priceType - The type of pricing (request or offer).
   */
  toPaymentPage(id: number, priceType: number) {
    if (!priceType) {
      this.router.navigate(['/request/' + id + '/payment'], { queryParams: { this: id } });
    } else {
      this.router.navigate(['/offer/' + id + '/payment'], { queryParams: { this: id } });
    }
  }

  /**
   * Marks a drive as finished by updating its status and refreshing the component data.
   * @param tripId - The ID of the trip to mark as finished.
   */
  finishedDrive(tripId: number) {
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
