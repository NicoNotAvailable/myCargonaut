import { Injectable } from '@angular/core';
import { DateUtils } from "../../../../utils/DateUtils";
import { HttpClient } from "@angular/common/http";
import * as http from "node:http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }


  readUser(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/user", { withCredentials: true });
  };
}
