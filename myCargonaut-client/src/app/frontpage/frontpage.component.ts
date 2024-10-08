import {Component, inject} from '@angular/core';
import {NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {CarouselComponent} from "./carousel/carousel.component";
import {offer} from "../search/offers";
import {HttpClient} from "@angular/common/http";
import {NgOptimizedImage} from "@angular/common";
import {RouterLink} from "@angular/router";
import {SessionService} from "../services/session.service";
// import { AktuelleFahrtenComponent } from "./aktuelle-fahrten/aktuelle-fahrten.component";



@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    NgbSlide,
    CarouselComponent,
    NgOptimizedImage,
    RouterLink,
    //AktuelleFahrtenComponent
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class FrontpageComponent {

  public sessionService: SessionService = inject(SessionService);

  allOffers: offer[] = [];
  pathToImage: string = "empty.png";
  pathToImageArray: string[] = [];

  isLoggedIn: boolean = false;

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

    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        return;
      }
    });


    this.http.get("http://localhost:8000/drive/all/offers", { withCredentials: true })
      .subscribe(
        (response: any) => {

          for (let i = 0; i < 3; i++) {

              const imagePath: string = response[i].carPicture;
              this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
              this.pathToImageArray.push(this.pathToImage);

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

