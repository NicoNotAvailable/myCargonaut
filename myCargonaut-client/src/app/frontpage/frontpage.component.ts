import { Component } from '@angular/core';
import bootstrap from "../../main.server";
import {NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {CarouselComponent} from "./carousel/carousel.component";
import {offer} from "../search/offers";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import { AktuelleFahrtenComponent } from "./aktuelle-fahrten/aktuelle-fahrten.component";



@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    NgbSlide,
    CarouselComponent,
    NgOptimizedImage,
    AktuelleFahrtenComponent
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class FrontpageComponent {

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

  sendToRegister(): void {
    window.location.href = "/register";
  }

  protected readonly offer = offer;
  protected readonly window = window;
}

