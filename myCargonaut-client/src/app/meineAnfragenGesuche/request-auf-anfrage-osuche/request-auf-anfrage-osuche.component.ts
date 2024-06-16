import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {requestOffer} from "../requestOffer";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-request-auf-anfrage-osuche',
  standalone: true,
  imports: [],
  templateUrl: './request-auf-anfrage-osuche.component.html',
  styleUrl: './request-auf-anfrage-osuche.component.css'
})
export class RequestAufAnfrageOSucheComponent  implements OnInit {
  id: number = 0 ;

  allTrips: requestOffer[] = [];

  gesamtgewicht: number = 0;
  gewichte : number[] = [];

  gesamtLength : number = 0;
  gesamtWidth: number = 0;
  gesamtHeight: number = 0;

  masse : number[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) { }

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));    // Jetzt kannst du mit der ID arbeiten
    console.log('Request ID:', this.id);


    this.http.get(`http://localhost:8000/trip/offer/offerTrips/${this.id}`, { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.allTrips = response;

          for (let elements of this.allTrips) {
            for (let cargo of elements.cargo) {
              this.gesamtgewicht = this.gesamtgewicht + cargo.weight;
            }
          }

          for (let elements of this.allTrips) {
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



  }





}
