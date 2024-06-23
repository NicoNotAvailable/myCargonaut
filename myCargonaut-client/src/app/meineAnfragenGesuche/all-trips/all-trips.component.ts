import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { DateFormatPipe } from '../../search/date-format.pipe';
import { offer } from '../../search/offers';
import { DatePipe, NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
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
  TripsOffersAll: any = [];
  TripsRequestAll: any = [];
  userID: number | undefined

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.sessionService.checkLoginNum().then(currentUser => {
      if (currentUser != -1) {
        this.isLoggedIn = true;
        this.userID = currentUser;
        console.log(currentUser + ' this is the user ID');
        console.log(this.userID + ' this is the user ID');
        this.getAllTrips(); // Move getAllTrips() here
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

    this.getAllRequests();
    this.getAllOffers();
  }

  getAllRequests() {
    const prePath: string = '/user/image/';
    this.http.get('http://localhost:8000/drive/user/requests', { withCredentials: true }).subscribe(
      (response: any) => {
        this.allRequests = response;
        this.getAllTripRequest();

        response.forEach((element: { user: { profilePic: string; }; }) => {
          const imagePath: string = element.user.profilePic;
          this.pathToImageArray.push(imagePath === 'empty.png' ? '/empty.png' : prePath.concat(imagePath));
        });
      },
      error => {
        console.error('Error fetching requests:', error);
      }
    );
  }

  getAllOffers() {
    const prePath: string = '/vehicle/image/';
    this.http.get('http://localhost:8000/drive/user/offers', { withCredentials: true }).subscribe(
      (response: any) => {
        this.allOffers = response;
        this.getAllTripOffers();

        response.forEach((element: { carPicture: string; }) => {
          const imagePath: string = element.carPicture;
          this.pathToImageArray.push(imagePath === 'empty.png' ? '/empty.png' : prePath.concat(imagePath));
        });
      },
      error => {
        console.error('Error fetching offers:', error);
      }
    );
  }

  getAllTripOffers() {
    this.http.get('http://localhost:8000/trip/offer/user', { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.TripsOffersAll = response.map((offer: any) => offer.id);
        },
        error => {
          console.error('Fehler beim Abrufen der Trip-Angebote:', error);
        },
      );
  }

  getAllTripRequest() {
    this.http.get('http://localhost:8000/trip/request/user', { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.TripsRequestAll = response.map((offer: any) => offer.id);
        },
        error => {
          console.error('Fehler beim Abrufen der Trip-Anfragen:', error);
        },
      );
  }

  handleButtonClick(number: number) {
    console.log(number);
    this.sendTripId(number)
  }

  sendTripId(number: number) {
    this.tripService.changeTripId(number);  // Update the trip ID in the service
    this.router.navigate(['/review']);      // Navigate to the review route
  }
  handleButtonClick2(number: number) {
    console.log(number);
  }

  getAllTrips() {
    console.log("getAllTrips");
    this.http.get('http://localhost:8000/trip/user-trips/' + this.userID, { withCredentials: true }).subscribe(
      (response: any) => {
        // Log the response to understand its structure
        console.log('Response:', response);

        const offerTrips = response.offerTrips
          .filter((offerTrip: any) => offerTrip.drive && (offerTrip.drive.status === 3 || offerTrip.drive.status === 4 || offerTrip.drive.status === 5))
          .map((offerTrip: any) => ({
            id: offerTrip.id,
            name: offerTrip.drive.name,
            user: offerTrip.requesting || offerTrip.drive.user,
            date: offerTrip.drive.date,
            price: offerTrip.drive.price,
            priceType: offerTrip.drive.priceType,
            maxCWeight: offerTrip.drive.maxCWeight,
            maxCVolumen: (offerTrip.drive.maxCLength * offerTrip.drive.maxCWidth * offerTrip.drive.maxCHeight) / 1000000,
            status: offerTrip.drive.status,
            locations: offerTrip.locations || []
          }));

        const requestTrips = response.requestTrips
          .filter((requestTrips: any) => requestTrips.drive && (requestTrips.drive.status === 3 || requestTrips.drive.status === 4 || requestTrips.drive.status === 5))
          .map((requestTrips: any) => ({
            id: requestTrips.id,
            name: requestTrips.drive.name,
            user: requestTrips.requesting,
            date: requestTrips.drive.date,
            price: requestTrips.drive.price,
            priceType: requestTrips.drive.priceType,
            maxCWeight: requestTrips.drive.maxCWeight,
            maxCVolumen: (requestTrips.drive.maxCLength * requestTrips.drive.maxCWidth * requestTrips.drive.maxCHeight) / 1000000,
            status: requestTrips.drive.status,
            locations: requestTrips.locations || []
          }));

        const offerDriveTrips = response.offerDriveTrips
          .filter((offerDriveTrips: any) => offerDriveTrips.drive && (offerDriveTrips.drive.status === 3 || offerDriveTrips.drive.status === 4 || offerDriveTrips.drive.status === 5))
          .map((offerDriveTrips: any) => ({
            id: offerDriveTrips.id,
            name: offerDriveTrips.drive.name,
            user: offerDriveTrips.drive.user,
            date: offerDriveTrips.drive.date,
            price: offerDriveTrips.drive.price,
            priceType: offerDriveTrips.drive.priceType,
            maxCWeight: offerDriveTrips.drive.maxCWeight,
            maxCVolumen: (offerDriveTrips.drive.maxCLength * offerDriveTrips.drive.maxCWidth * offerDriveTrips.drive.maxCHeight) / 1000000,
            status: offerDriveTrips.drive.status,
            locations: offerDriveTrips.locations || []
          }));

        const requestDriveTrips = response.requestDriveTrips
          .filter((requestDriveTrips: any) => requestDriveTrips.drive && (requestDriveTrips.drive.status === 3 || requestDriveTrips.drive.status === 4 || requestDriveTrips.drive.status === 5))
          .map((requestDriveTrips: any) => ({
            id: requestDriveTrips.id,
            name: requestDriveTrips.drive.name,
            user: requestDriveTrips.drive.user,
            date: requestDriveTrips.drive.date,
            price: requestDriveTrips.drive.price,
            priceType: requestDriveTrips.drive.priceType,
            maxCWeight: requestDriveTrips.drive.maxCWeight,
            maxCVolumen: (requestDriveTrips.drive.maxCLength * requestDriveTrips.drive.maxCWidth * requestDriveTrips.drive.maxCHeight) / 1000000,
            status: requestDriveTrips.drive.status,
            locations: requestDriveTrips.locations || []
          }));

        // Combine all trips into activeTrips
        this.activeTrips = [].concat(offerTrips, requestTrips, offerDriveTrips, requestDriveTrips);
        console.log('Active Trips:', this.activeTrips);
      },
      error => {
        console.error('Error fetching requests:', error);
      }
    );
  }


  protected readonly window = window;
  protected readonly PageTransitionEvent = PageTransitionEvent;
  protected readonly location = location;
}
