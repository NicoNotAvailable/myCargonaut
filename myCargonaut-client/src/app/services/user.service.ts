import { Injectable } from '@angular/core';
import { DateUtils } from "../../../../utils/DateUtils";
import { HttpClient } from "@angular/common/http";
import * as http from "node:http";
import { Observable } from "rxjs";
import { response } from "express";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  otherUser: any;

  constructor(private http: HttpClient) {
    this.otherUser = {};
  }

  readUser(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/user", { withCredentials: true });
  }

  readOtherUser() {
    this.http.get("http://localhost:8000/user/users", {withCredentials: true}).subscribe(
      response => {

      },
      error => {
        console.error(error);
      }
    )
  }

  editUser(userData: any): Observable<any> {
    return this.http.put<any>("http://localhost:8000/user/profile", userData, { withCredentials: true });
  }
}
