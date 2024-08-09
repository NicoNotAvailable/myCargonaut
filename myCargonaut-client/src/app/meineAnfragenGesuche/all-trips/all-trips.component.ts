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
    const prePath: string = '/user/image/';
    this.http.get(`http://localhost:8000/trip/user-trips/${this.userID}`, { withCredentials: true }).subscribe(
      (response: any) => {
        this.checkTrips(response.offerTrips);
        this.checkTrips(response.requestTrips);
        this.checkTrips(response.offerDriveTrips);
        this.checkTrips(response.requestDriveTrips);

        console.log("All Activ Trips" );
        console.log( this.activeTrips);
        console.log("Status 1 or 2 ")
        console.log(this.oneAndTwoTrips)



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

  checkTrips(trips: any[]) {
    trips.forEach(trip => {
      if (trip?.drive?.status === 3 || 4 || 5) {
        this.activeTrips.push(trip);
      } else if ((trip?.drive?.status === 1 || 2) && (trip?.requesting?.id === this.userID)) {
        this.oneAndTwoTrips.push(trip);
      }
    });
  }





  handleButtonClickStatus(number: number) {
    this.sendTripId(number)
  }

  sendTripId(number: number) {
    this.tripService.changeTripId(number);  // Update the trip ID in the service
    this.router.navigate(['/review']);      // Navigate to the review route
  }


}
