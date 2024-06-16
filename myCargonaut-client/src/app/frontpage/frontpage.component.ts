import { Component } from '@angular/core';
import bootstrap from "../../main.server";
import {NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {CarouselComponent} from "./carousel/carousel.component";
import {offer} from "../search/offers";
import {HttpClient} from "@angular/common/http";


@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    NgbSlide,
    CarouselComponent
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class FrontpageComponent {

  allOffers: offer[] = [];
  offerBool: boolean = true;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get("http://localhost:8000/drive/all/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {

          for (let i = 0; i < 3; i++) {

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
}
