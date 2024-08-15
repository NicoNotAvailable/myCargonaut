import { Injectable } from '@angular/core';
import { DateUtils } from "../../../../utils/DateUtils";
import { HttpClient } from "@angular/common/http";
import * as http from "node:http";
import { BehaviorSubject, Observable } from "rxjs";
import { response } from "express";


interface OtherUser{
  id: number;
  firstName: string;
  lastName: string;
  profileText: string;
  profilePic: string;
  rating: number;
  isSmoker: boolean;
  offeredDrives: number;
  takenDrives: number;
  distanceDriven: number;
  totalPassengers: number;
  highestWeight: number;
  languages: string;
  birthyear: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private otherUserSubject: BehaviorSubject<OtherUser>;
  otherUser$: Observable<OtherUser>;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('otherUser');
    const initialUser = storedUser ? JSON.parse(storedUser) : {
      id: -1,
      firstName: "",
      lastName: "",
      profilePic: "",
      rating: 0,
      isSmoker: false,
      languages: "",
      profileText: "",
      offeredDrives: 0,
      takenDrives: 0,
      distanceDriven: 0,
      totalPassengers: 0,
      highestWeight: 0,
      birthyear: 0,
    };
    this.otherUserSubject = new BehaviorSubject<OtherUser>(initialUser);
    this.otherUser$ = this.otherUserSubject.asObservable();
  }



  readUser(): Observable<any> {
    return this.http.get<any>("http://localhost:8000/user", { withCredentials: true });
  }

  readOtherUser(userId: number) {
    if (userId === undefined) {
      return;
    }
    this.http.get("http://localhost:8000/user/"+userId, {withCredentials: true}).subscribe(
      (response: any) => {
        this.otherUserSubject.next(response);
        localStorage.setItem('otherUser', JSON.stringify(response));
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
