import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  id: number = 0;

  currentRoute: string | null = null;

  priceType: number | null = null;
  price: number | null = null;
  servicePrice: number = 2.25
  totalPrice: number | null = null;

  totalWeight: number | null = null;

  seats: number | null = null;

  driveType: string | null = null;

  paymentMethod: number = 0;

  constructor(private http: HttpClient, private router: Router) { }

  setPaymentMethod(value: number): void {
    this.paymentMethod = value;
  }

  readRequest(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8000/drive/request/" + id, {withCredentials: true});
  }

  loadOfferPayment() {
    this.http.get(`http://localhost:8000/drive/offer/${this.id}`, {withCredentials: true})
      .subscribe(
        (response: any) => {
          this.priceType = response.priceType
          this.seats = response.seats;
          this.price = response.price;

          this.http.get(`http://localhost:8000/trip/offer/offerTrips/${this.id}`, {withCredentials: true})
            .subscribe(
              (response: any) => {
                if (this.priceType == 1) {  //cost for whole trip
                  this.totalPrice = this.price! + this.servicePrice;
                } else if (this.priceType == 2) { //cost per person
                  this.totalPrice = this.price! * this.seats! + this.servicePrice;
                } else if (this.priceType == 3) { //cost per kg weight
                  for (const element of response[0].cargo) {
                    this.totalWeight += element.weight;
                  }
                  this.totalPrice = this.price! * this.totalWeight! + this.servicePrice;
                  this.totalWeight = parseFloat(this.totalWeight!.toFixed(2));
                }

              },
              (error: { error: { message: string; }; }) => {
                console.error('Fehler beim Abrufen der Angebote:', error);
              }
            );
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }

  loadRequestPayment() {
    this.http.get(`http://localhost:8000/drive/request/${this.id}`, {withCredentials: true})
      .subscribe(
        (response: any) => {
          this.price = response.price;
          this.totalPrice = this.price! + this.servicePrice;
        },
        (error: { error: { message: string; }; }) => {
          console.error('Fehler beim Abrufen der Angebote:', error);
        }
      );
  }

  setDriveStatusPaid() {
    if (this.currentRoute == "offer") {
      this.http.put<any>("http://localhost:8000/trip/offer/" + this.id + "/payment", {},
        {withCredentials: true})
        .subscribe(
          (response: any) => {
            this.router.navigate(['/profile']);
          },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );
    } else if (this.currentRoute == "request") {
      this.http.put<any>("http://localhost:8000/trip/request/" + this.id + "/payment", {},
        {withCredentials: true})
        .subscribe(
          (response: any) => {
            this.router.navigate(['/profile']);
          },
          (error: { error: { message: string; }; }) => {
            console.error('Fehler beim Abrufen der Angebote:', error);
          }
        );
    }
  }
}
