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
    DateFormatPipe
  ],
  templateUrl: './search-main.component.html',
  styleUrls: ['./search-main.component.css']
})
export class SearchMainComponent implements OnInit {

  allOffers: offer[] = [];
  offerBool: boolean = true;

  pathToImage: string = "empty.png";

  pathToImageArray: string[] = [];


  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const prePath: string = "/vehicle/image/";


    this.http.get("http://localhost:8000/drive/all/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {

          for (let element of response) {
            const imagePath: string = element.carPicture;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }


          this.allOffers = response;
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }
}
