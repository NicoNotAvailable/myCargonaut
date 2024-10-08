import { Component } from '@angular/core';
import {SearchCardComponent} from "../../search-main/search-card/search-card.component";
import {SearchInputComponent} from "../../search-main/search-input/search-input.component";
import { HttpClient, HttpParams } from '@angular/common/http';
import {request} from "../../requests";
import { SearchFilter } from '../../SearchFilter';

@Component({
  selector: 'app-search-main-gesucht',
  standalone: true,
  imports: [
    SearchCardComponent,
    SearchInputComponent
  ],
  templateUrl: './search-main-gesucht.component.html',
  styleUrl: './search-main-gesucht.component.css'
})
export class SearchMainGesuchtComponent {

  allRequests: any = [];
  requestBool: boolean = true;

  gesamtgewicht: number = 0;
  gewichte : number[] = [];

  gesamtLength : number = 0;
  gesamtWidth: number = 0;
  gesamtHeight: number = 0;

  masse : number[] = [];
  alleMasse : number[] = [];


  pathToImage: string = "empty.png";

  pathToImageArray: string[] = [];

  constructor(private http: HttpClient) { }

  ngOnInit(): void {

    const prePath: string = "/user/image/";

    this.http.get("http://localhost:8000/drive/all/requests", { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.allRequests = response.filter((offer: any)=> offer.status < 2);

          for (let element of response) {
            const imagePath: string = element.user.profilePic;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }

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

  getFilteredRequests(filters: SearchFilter) {
    const prePath: string = "/user/image/";

    let params = new HttpParams();

    for (const key in filters) {
      if (filters[key as keyof SearchFilter]) {
        params = params.append(key, filters[key as keyof SearchFilter]);
      }
    }

    this.http.get("http://localhost:8000/drive/all/requests", {
      withCredentials: true,
      params: params
    })
      .subscribe(
        (response: any) => {
          this.allRequests = response;

          for (let element of response) {
            const imagePath: string = element.user.profilePic;
            this.pathToImage = imagePath === "empty.png" ? "/empty.png" : prePath.concat(imagePath);
            this.pathToImageArray.push(this.pathToImage);
          }

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
          this.allRequests = [];
        }
      );
    }
}
