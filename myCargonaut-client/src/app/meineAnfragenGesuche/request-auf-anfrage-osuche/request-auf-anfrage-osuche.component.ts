import { Component, inject, OnInit } from "@angular/core";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {offerTrips} from "../offerTrips";
import {HttpClient} from "@angular/common/http";
import {filter} from "rxjs/operators";
import { requestTrips } from "../requestTrips";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";
import { NgForOf, NgOptimizedImage } from "@angular/common";

@Component({
  selector: 'app-request-auf-anfrage-osuche',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NgForOf
  ],
  templateUrl: './request-auf-anfrage-osuche.component.html',
  styleUrl: './request-auf-anfrage-osuche.component.css'
})
export class RequestAufAnfrageOSucheComponent  implements OnInit {
  id: number = 0 ;

  allTripsOffer: offerTrips[] = [];
  allTripsRequest: requestTrips[] = [];

  thisRequestLocations: any[] = [];

  thisOfferName: string = "";
  thisRequestName: string = "";

  offerBool: Boolean = false;
  requestBool: Boolean = false;

  currentRoute: string = '';

  gesamtgewicht: number = 0;
  gewichte : number[] = [];

  gesamtLength : number = 0;
  gesamtWidth: number = 0;
  gesamtHeight: number = 0;

  masse : number[] = [];

  prePath: string = "/user/image/";


  pathToImage: string = "empty.png";

  pathToImageArray: string[] = [];



  starFillSrc: string = './assets/star-fill.svg';
  starEmptySrc: string = './assets/star.svg';

  bewertungsDummy : number = 4;
  stars: number[] = [1, 2, 3, 4, 5];

  constructor(private route: ActivatedRoute, private http: HttpClient,  private router: Router) { }

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  ngOnInit(): void {

    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      } else {

      }
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));    // Jetzt kannst du mit der ID arbeiten
    this.updateCurrentRoute();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });

  }

  private updateCurrentRoute(): void {
    const route = this.router.url.split('/');

    if (route.length > 1 && route[1]) {
      this.currentRoute = route[1];
    } else {
      this.currentRoute = '';
    }

    if (this.currentRoute === "offer") {

      this.offerBool = true;
      this.requestBool = false;




      this.http.get(`http://localhost:8000/drive/offer/${this.id}`, {withCredentials: true})
        .subscribe(
          (response: any) => {
            this.thisOfferName = response.name;
            },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );



      this.http.get(`http://localhost:8000/trip/offer/offerTrips/${this.id}`, { withCredentials: true })
        .subscribe(
          (response: any) => {
            this.allTripsOffer = response;


            this.prePath = "/user/image/"

            for (let element of response) {
              const imagePath: string = element.requesting.profilePic;
              this.pathToImage = imagePath === "empty.png" ? "/empty.png" : this.prePath.concat(imagePath);
              this.pathToImageArray.push(this.pathToImage);
            }

            for (let elements of this.allTripsOffer) {
              for (let cargo of elements.cargo) {
                this.gesamtgewicht = this.gesamtgewicht + cargo.weight;
              }
            }

            for (let elements of this.allTripsOffer) {
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
          }
        );


    } else if (this.currentRoute === "request") {

      this.offerBool = false;
      this.requestBool = true;


      this.http.get(`http://localhost:8000/drive/request/${this.id}`, {withCredentials: true})
        .subscribe(
          (response: any) => {


            this.thisRequestLocations = response.locations;
            this.thisRequestName = response.name;
          },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );


      this.http.get(`http://localhost:8000/trip/request/requestTrips/${this.id}`, { withCredentials: true })
        .subscribe(
          (response: any) => {
            this.allTripsRequest = response;

            this.prePath = "/user/image/"

            for (let element of response) {
              const imagePath: string = element.requesting.profilePic;
              this.pathToImage = imagePath === "empty.png" ? "/empty.png" : this.prePath.concat(imagePath);
              this.pathToImageArray.push(this.pathToImage);
            }
          },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );
    }
  }

  navigateToChat(tripId: number): void {
    this.router.navigate(['/chats'], { queryParams: { tripId } });
  }


  acceptDrive(tripId:number): void {
    this.http.put('http://localhost:8000/trip/accept/' + tripId, {},{ withCredentials: true })
      .subscribe(
        response => {
          this.router.navigate(['/allTrips'], { queryParams: { tripId } });
        },
        error => {

          console.error('There was an error!', error);
        },
      );
  }

  protected readonly window = window;
}
