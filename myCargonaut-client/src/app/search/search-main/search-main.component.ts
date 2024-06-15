import { Component, OnInit } from '@angular/core';
import { SearchInputComponent } from "./search-input/search-input.component";
import { SearchCardComponent } from "./search-card/search-card.component";
import { HttpClient } from '@angular/common/http';
import { offer } from "../offers";
import { DateFormatPipe } from '../date-format.pipe';

@Component({
  selector: 'app-search-main',
  standalone: true,
  imports: [
    SearchInputComponent,
    SearchCardComponent,
    DateFormatPipe // Hier die Pipe importieren
  ],
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css']
})
export class SearchMainComponent implements OnInit {

  allOffers: offer[] = [];
  offerBool: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8000/drive/all/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.allOffers = response;
          console.log(this.allOffers[0].locations[0].stopNr);
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }
}
