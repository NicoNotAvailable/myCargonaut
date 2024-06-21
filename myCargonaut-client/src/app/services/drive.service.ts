import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DriveService {

  constructor(private http: HttpClient) { }

  readOffer(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8000/drive/offer" + id, {withCredentials: true});
  }

  readRequest(id: number): Observable<any> {
    return this.http.get<any>("http://localhost:8000/drive/request" + id, {withCredentials: true});
  }

}
