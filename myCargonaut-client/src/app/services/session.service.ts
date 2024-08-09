import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  userID: number;


  constructor(private http: HttpClient) {
    this.userID = -1;
  }

  async checkLoginNum(): Promise<number> {
    try {
      const response = await this.http.get<any>("http://localhost:8000/session/getSessionUser", { withCredentials: true }).toPromise();
      this.userID = response.id;
      return this.userID;
    } catch (error) {
      console.error(error);
      return -1;
    }
  }

  getUserID(): number {
    return this.userID;
  }
}
