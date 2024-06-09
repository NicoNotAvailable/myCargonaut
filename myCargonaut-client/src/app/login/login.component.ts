import { Component, inject } from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import { NgClass, NgIf } from "@angular/common";
import { SessionService } from "../services/session.service";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, HttpClientModule, NgIf, NgClass],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  public sessionService: SessionService = inject(SessionService);

  isLoggedIn: boolean = false;

  email: string = "";
  password: string = "";

  message: string = "";
  textColor: string = "errorText";

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    //console.log(this.sessionService.checkLogin());
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (this.isLoggedIn) {
        window.location.href = "/profile";
      }
    });
  }

  userLogin(form: any): void{
    const userData = {
      email: this.email,
      password: this.password,
    };

    this.http.post("http://localhost:8000/session/login", userData, { withCredentials: true }).subscribe(
      response =>{
        form.resetForm();
        console.log(response);
        this.textColor = "successText"
        this.message = "Anmeldung lief swaggy";
        window.location.href = "/profile";
        setTimeout(() =>{
          this.message = "";
          this.textColor = "errorText"
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
