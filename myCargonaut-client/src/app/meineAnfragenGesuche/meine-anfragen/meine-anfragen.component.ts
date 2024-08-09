import { Component, inject } from "@angular/core";
import {TopAuswahlComponent} from "../top-auswahl/top-auswahl.component";
import {SearchCardComponent} from "../../search/search-main/search-card/search-card.component";
import {HttpClient} from '@angular/common/http';
import {offer} from "../../search/offers";
import {filter} from "rxjs/operators";
import {NavigationEnd, Router} from "@angular/router";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";


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

  pathToImage: string = "empty.png";

  pathToImageArray: string[] = [];


  constructor(private http: HttpClient, private router: Router) {
  }

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  ngOnInit(): void {

    const prePath: string = "/vehicle/image/";

    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      } else {

      }
    });

    this.http.get("http://localhost:8000/drive/user/offers", {withCredentials: true})
      .subscribe(
        (response: any) => {
          this.allOffers = response;

          for (let element of response) {
            const imagePath: string = element.carPicture;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }


        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }



}
