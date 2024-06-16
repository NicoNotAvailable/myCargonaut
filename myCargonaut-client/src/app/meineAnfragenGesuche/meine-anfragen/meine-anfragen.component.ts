import { Component } from '@angular/core';
import {TopAuswahlComponent} from "../top-auswahl/top-auswahl.component";
import {SearchCardComponent} from "../../search/search-main/search-card/search-card.component";
import { HttpClient } from '@angular/common/http';
import {offer} from "../../search/offers";


@Component({
  selector: 'app-meine-anfragen',
  standalone: true,
  imports: [
    TopAuswahlComponent,
    SearchCardComponent
  ],
  templateUrl: './meine-anfragen.component.html',
  styleUrl: './meine-anfragen.component.css'
})
export class MeineAnfragenComponent {
  allOffers: offer[] = [];
  offerBool: boolean = true;

  buttonText: string = "Anfragen ansehen";

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8000/drive/user/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.allOffers = response;
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }
}
