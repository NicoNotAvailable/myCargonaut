import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {offerTrips} from "../offerTrips";
import {HttpClient} from "@angular/common/http";
import {filter} from "rxjs/operators";
import { offer } from "../../search/offers";
import { request } from "../../search/requests";
import { requestTrips } from "../requestTrips";

@Component({
  selector: 'app-request-auf-anfrage-osuche',
  standalone: true,
  imports: [],
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

  constructor(private route: ActivatedRoute, private http: HttpClient,  private router: Router) { }

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));    // Jetzt kannst du mit der ID arbeiten
    console.log('Request ID:', this.id);

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

              console.log(this.masse)

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

          },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );



    }


  }



}
