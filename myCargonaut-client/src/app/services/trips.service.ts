import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripsService {

  constructor(private http: HttpClient) { }

  createRequestTrip(tripData: any): Observable<any> {
    return this.http.post<any>("http://localhost:8000/trip/request", tripData, { withCredentials: true });
  }

  createOfferTrip(tripData: any): Observable<any> {
    return this.http.post<any>("http://localhost:8000/trip/offer", tripData, { withCredentials: true });
  }
}
