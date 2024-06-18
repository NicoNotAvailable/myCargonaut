import { Component, inject } from '@angular/core';
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
  requestBool: boolean = true;
  gesamtgewicht: number = 0;
  gewichte: number[] = [];
  gesamtLength: number = 0;
  gesamtWidth: number = 0;
  gesamtHeight: number = 0;
  masse: number[] = [];
  alleMasse: number[] = [];
  pathToImage: string = 'empty.png';
  pathToImageArray: string[] = [];


  allOffers:any  =[];
  TripsOffersAll:any  =[];
  TripsRequestAll: any = []
  offerBool: boolean = true;


  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.getAllRequests()
    this.getAllOffers()
  }



  getAllRequests() {
    const prePath: string = '/user/image/';
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = '/';
      }
    });
    this.http.get('http://localhost:8000/drive/user/requests', { withCredentials: true })
      .subscribe(
        (response: any) => {

          for (let element of response) {
            const imagePath: string = element.user.profilePic;
            this.pathToImage = imagePath === 'empty.png' ? '/empty.png' : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }


          this.allRequests = response;
this.getAllTripRequest()

          for (let elements of this.allRequests) {
            for (let cargo of elements.cargo) {
              this.gesamtgewicht = this.gesamtgewicht + cargo.weight;
            }
            this.gewichte.push(this.gesamtgewicht);
            this.gesamtgewicht = 0;
          }

          for (let elements of this.allRequests) {
            for (let cargo of elements.cargo) {
              this.gesamtLength = this.gesamtLength + cargo.length;
              this.gesamtHeight = this.gesamtHeight + cargo.height;
              this.gesamtWidth = this.gesamtWidth + cargo.width;
            }

            this.masse.push(this.gesamtLength);
            this.masse.push(this.gesamtHeight);
            this.masse.push(this.gesamtWidth);

            this.gesamtWidth = 0;
            this.gesamtLength = 0;
            this.gesamtHeight = 0;

          }

        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        },
      );

  }


  getAllOffers(){
    const prePath: string = "/vehicle/image/";

    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      }
    });

    this.http.get("http://localhost:8000/drive/user/offers", {withCredentials: true})
      .subscribe(
        (response: any) => {
          this.allOffers = response;

          this.getAllTripOffers();

          for (let element of response) {
            const imagePath: string = element.carPicture;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }


          console.log(this.allOffers)
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );

  }

  getAllTripOffers() {
    this.http.get("http://localhost:8000/trip/offer/user", { withCredentials: true })
      .subscribe(
        (response: any) => {
          // Assuming response is an array of ids
          this.TripsOffersAll = response.map((offer: any) => offer.id);
          console.log(this.TripsOffersAll+ "hallo");
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Trip-Angebote:', error);
        }
      );
  }

  getAllTripRequest() {
    this.http.get("http://localhost:8000/trip/request/user", { withCredentials: true })
      .subscribe(
        (response: any) => {
          // Assuming response is an array of ids
          this.TripsRequestAll = response.map((offer: any) => offer.id);
          console.log(this.TripsRequestAll+ "hallo");
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Trip-Angebote:', error);
        }
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
}
