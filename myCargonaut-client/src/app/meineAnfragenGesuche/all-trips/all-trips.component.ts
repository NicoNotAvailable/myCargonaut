import { Component, inject } from '@angular/core';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { DateFormatPipe } from '../../search/date-format.pipe';
import { offer } from '../../search/offers';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { SearchCardComponent } from '../../search/search-main/search-card/search-card.component';
import { MatTooltip } from '@angular/material/tooltip';

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
    MatTooltip,
  ],
  templateUrl: './all-trips.component.html',
  styleUrls: ['./all-trips.component.css']
})
export class AllTripsComponent {

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  allRequests: any = [];
  pathToImage: string = 'empty.png';
  pathToImageArray: string[] = [];
  allOffers: any = [];
  activeTrips: any = [];
  TripsOffersAll: any = [];
  TripsRequestAll: any = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
  this.loadTripsData()
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
        this.activeTrips = this.activeTrips.concat(response.filter((request: { status: number; }) => request.status === 3 || request.status === 4 || request.status === 5));
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
        this.activeTrips = this.activeTrips.concat(response.filter((offer: { status: number; }) => offer.status === 3 || offer.status === 4 || offer.status === 5));
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
  }

  handleButtonClick2(number: number) {
    console.log(number);
  }

  protected readonly window = window;
  protected readonly PageTransitionEvent = PageTransitionEvent;
  protected readonly location = location;
}

