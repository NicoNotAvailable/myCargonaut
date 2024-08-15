import { Component, inject } from '@angular/core';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { DateFormatPipe } from '../../search/date-format.pipe';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { SearchCardComponent } from '../../search/search-main/search-card/search-card.component';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-last-drives',
  standalone: true,
  imports: [
    CurrencyPipe,
    DateFormatPipe,
    NgForOf,
    NgIf,
    TopAuswahlComponent,
    SearchCardComponent,
    NgOptimizedImage,
    DateFormatPipe,
    NgClass,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './last-drives.component.html',
  styleUrl: './last-drives.component.css'
})
export class LastDrivesComponent {

  allOffers: any = [];
  allRequests: any = [];

  activeTrips: any = [];

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  userID: number | undefined



  constructor(private http: HttpClient) {}

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
      } else {
        this.isLoggedIn = false;
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
        const allTrips = [...this.activeTrips];

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
   * Checks and categorizes trips based on their drive status.
   * @param trips - The array of trips to check.
   */
  checkTrips(trips: any[]) {
    trips.forEach(trip => {
      // Check if drive status 5
      if (trip?.drive?.status === 5) {
        this.activeTrips.push(trip);
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
}
