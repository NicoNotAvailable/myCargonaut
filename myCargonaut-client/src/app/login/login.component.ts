import { Component, inject } from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {NgIf} from "@angular/common";
import {response} from "express";
import { SessionService } from "../services/session.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public sessionService: SessionService = inject(SessionService);

  isLoggedIn: boolean = false;

  email: string = "";
  password: string = "";

  message: string = "";

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    //console.log(this.sessionService.checkLogin());
    this.sessionService.checkLogin().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      this.isLoggedIn = isLoggedIn;
    });
  }

  userLogin(form: any): void{
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.http.post("http://localhost:8000/session/login", userData).subscribe(
      response =>{
        form.resetForm();
        console.log(response);
        this.message = "Anmeldung lief swaggy";
        this.sessionService.checkLogin().then(isLoggedIn => {
          console.log('Login status:', isLoggedIn);
        });
        this.sessionService.checkLoginNum().then(isLoggedIn => {
          console.log('Login status: ', isLoggedIn);
        });
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
