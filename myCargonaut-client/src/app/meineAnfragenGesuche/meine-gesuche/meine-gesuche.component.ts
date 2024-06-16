import { Component, inject } from "@angular/core";
import {SearchCardComponent} from "../../search/search-main/search-card/search-card.component";
import {TopAuswahlComponent} from "../top-auswahl/top-auswahl.component";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { offer } from "../../search/offers";
import { request } from "../../search/requests";
import { SessionService } from "../../services/session.service";
import { UserService } from "../../services/user.service";


@Component({
  selector: 'app-meine-gesuche',
  standalone: true,
  imports: [
    SearchCardComponent,
    TopAuswahlComponent
  ],
  templateUrl: './meine-gesuche.component.html',
  styleUrl: './meine-gesuche.component.css'
})


export class MeineGesucheComponent {

  allRequests: request[] = [];
  requestBool: boolean = true;

  gesamtgewicht: number = 0;
  gewichte : number[] = [];

  gesamtLength : number = 0;
  gesamtWidth: number = 0;
  gesamtHeight: number = 0;

  masse : number[] = [];
  alleMasse : number[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  isLoggedIn: boolean = false;
  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  ngOnInit(): void {


    this.sessionService.checkLoginNum().then(isLoggedIn => {
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (!this.isLoggedIn && typeof window !== undefined) {
        window.location.href = "/";
      } else {

      }
    });
     this.http.get("http://localhost:8000/drive/user/requests", { withCredentials: true })
        .subscribe(
          (response: any) => {
            this.allRequests = response;


            for (let elements of this.allRequests) {
              for (let cargo of elements.cargo) {
                this.gesamtgewicht = this.gesamtgewicht + cargo.weight;
              }
              this.gewichte.push(this.gesamtgewicht);
              this.gesamtgewicht = 0;
            }

            for (let elements of this.allRequests) {
              for (let cargo of elements.cargo) {
                this.gesamtLength = this.gesamtLength + cargo.length;
                this.gesamtHeight = this.gesamtHeight + cargo.height;
                this.gesamtWidth = this.gesamtWidth + cargo.width;
              }

              this.masse.push(this.gesamtLength);
              this.masse.push(this.gesamtHeight);
              this.masse.push(this.gesamtWidth);

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
