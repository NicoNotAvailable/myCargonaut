import { Component } from '@angular/core';

import {offer} from "../../search/offers";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";


@Component({
  selector: 'app-aktuelle-fahrten',
  standalone: true,
  imports: [
    NgOptimizedImage
  ],
  templateUrl: './aktuelle-fahrten.component.html',
  styleUrl: './aktuelle-fahrten.component.css'
})
export class AktuelleFahrtenComponent {
  allOffers: offer[] = [];
  pathToImage: string = "empty.png";
  pathToImageArray: string[] = [];

  constructor(private http: HttpClient) { }

  getImageUrl(index: number): string {
    // @ts-ignore
    const protocol = window.location.protocol;
    // @ts-ignore
    const host = window.location.host.replace('4200', '8000');
    return `${protocol}//${host}/${this.pathToImageArray[index]}`;
  }

  ngOnInit(): void {
    const prePath: string = "/vehicle/image/";


    this.http.get("http://localhost:8000/drive/all/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {

          for (let i = 0; i < 3; i++) {

            const imagePath: string = response[i].carPicture;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);


            console.log(this.pathToImageArray);

            if(response[i] !== undefined) {
              this.allOffers.push(response[i]);
            }
          }

        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }

  protected readonly offer = offer;
  protected readonly window = window;
}
