import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {response} from "express";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = "";
  password: string = "";

  message: string = "";

  constructor(private http: HttpClient) {
  }

  userLogin(form: any): void{
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.http.post("http://localhost:8080/session/login", userData).subscribe(
      response =>{
        form.resetForm();
        this.message = "Anmeldung lief swaggy";
        setTimeout(() =>{
          this.message = "";
        }, 5000);
      },
      error => {
        console.error(error);
        this.message = error.error.message || "Passwort oder Email stimmt nicht überein";
        setTimeout(()=> {
          this.message = "";
        }, 5000);
      }
    );
  }
}
