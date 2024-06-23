import { Component, EventEmitter, inject, Output } from '@angular/core';
import { TopAuswahlComponent } from '../top-auswahl/top-auswahl.component';
import { SearchCardComponent } from '../../search/search-main/search-card/search-card.component';
import { offer } from '../../search/offers';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';
import { request } from '../../search/requests';
import { NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { DateFormatPipe } from '../../search/date-format.pipe';
import { TripService } from '../../services/trip-service.service';

@Component({
  selector: 'app-meine-letzten-fahrten',
  standalone: true,
  imports: [
    TopAuswahlComponent,
    SearchCardComponent,
    NgOptimizedImage,
    DateFormatPipe,
    NgForOf,
    NgIf,
  ],
  templateUrl: './meine-letzten-fahrten.component.html',
  styleUrl: './meine-letzten-fahrten.component.css',
})
export class MeineLetztenFahrtenComponent {

  isLoggedIn: boolean = false;
  isReviewed: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);


  allRequests: any = [];
  pathToImage: string = 'empty.png';
  pathToImageArray: string[] = [];
  allOffers: any = [];
  TripsOffersAll: any = [];
  TripsRequestAll: any = [];



  constructor(private http: HttpClient, private router: Router, private tripService: TripService) {}

  ngOnInit(): void {
    this.getAllRequests();
    this.getAllOffers();
  }

  getAllRequests() {
    const prePath: string = '/user/image/';
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn !== -1;
      if (!this.isLoggedIn && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });
    this.http.get('http://localhost:8000/drive/user/requests', { withCredentials: true })
      .subscribe(
        (response: any) => {
          response.forEach((element: any) => {
            const imagePath: string = element.user.profilePic;
            this.pathToImage = imagePath === 'empty.png' ? '/empty.png' : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          });
          this.allRequests = response;
          this.getAllTripRequest();
        },
        error => {
          console.error('Fehler beim Abrufen der Anfragen:', error);
        },
      );
  }

  getAllOffers() {
    const prePath: string = '/vehicle/image/';
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      this.isLoggedIn = isLoggedIn !== -1;
      if (!this.isLoggedIn && typeof window !== 'undefined') {
        window.location.href = '/';
      }
    });
    this.http.get('http://localhost:8000/drive/user/offers', { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.allOffers = response;
          this.getAllTripOffers();
          response.forEach((element: any) => {
            const imagePath: string = element.carPicture;
            this.pathToImage = imagePath === 'empty.png' ? '/empty.png' : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          });
        },
        error => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        },
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
    this.tripService.changeTripId(number);
    this.router.navigate(['/review']);  }

  handleButtonClick2(number: number) {
    console.log(number);
    this.tripService.changeTripId(number);
    this.router.navigate(['/review']);

  }

  protected readonly window = window;
  protected readonly PageTransitionEvent = PageTransitionEvent;
  protected readonly location = location;
}
