import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private isLoggedIn: boolean;
  private userID: number;


  constructor(private http: HttpClient) {
    this.isLoggedIn = false;
    this.userID = -1;
  }

  checkLoginNum(): Promise<number> {
    return this.http.get<any>("http://localhost:8000/session/getSessionUser").toPromise()
      .then(response => {
        this.userID = response;
        console.log(response);
        return this.userID; // Hier wird sichergestellt, dass ein number zurückgegeben wird
      })
      .catch(error => {
        console.error(error);
        return -1;
      });
  }

  getUserID(): number {
    return this.userID;
  }
}
