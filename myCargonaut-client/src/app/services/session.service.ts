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

  checkLogin(): Promise<boolean> {
    return this.http.get<any>("http://localhost:8000/session/checkLogin").toPromise()
      .then(response => {
        console.log("======");
        console.log(response);
        this.isLoggedIn = response.ok;
        return this.isLoggedIn
      })
      .catch(error => {
        console.error(error);
        return false;
      });
  }

  checkLoginNum(): Promise<number> {
    return this.http.get<any>("http://localhost:8000/session/getSessionUser").toPromise()
      .then(response => response.currentUser)
      .catch(error => {
        console.error(error);
        return -1;
      });
  }
}
