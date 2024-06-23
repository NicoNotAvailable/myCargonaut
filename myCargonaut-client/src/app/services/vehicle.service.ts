import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class VehicleService {

  constructor(private http: HttpClient) { }

  readCars(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/vehicle/cars", {withCredentials: true});
  }
  readCar(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8000/vehicle/car/" + id, {withCredentials: true});
  }

  readTrailers(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/vehicle/trailers", {withCredentials: true});
  }
  readTrailer(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8000/vehicle/trailer/" + id, {withCredentials: true});
  }
}


