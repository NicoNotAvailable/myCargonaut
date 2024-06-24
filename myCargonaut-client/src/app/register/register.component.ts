import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { NgbInputDatepicker } from '@ng-bootstrap/ng-bootstrap';
import { SessionService } from '../services/session.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgIf,
    NgbInputDatepicker,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  isLoggedIn: boolean = false;

  message: string = '';

  firstName: string = '';
  lastName: string = '';
  email: string = '';
  emailConfirm: string = '';
  password: string = '';
  passwordConfirm: string = '';
  phonenumber: string = '';
  agb: boolean = false;

  birthDate: any = '';

  public sessionService: SessionService = inject(SessionService);

  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    //console.log(this.sessionService.checkLogin());
    this.sessionService.checkLoginNum().then(isLoggedIn => {
      console.log('Login status:', isLoggedIn);
      isLoggedIn == -1 ? this.isLoggedIn = false : this.isLoggedIn = true;
      if (this.isLoggedIn) {
        window.location.href = '/profile';
      }
    });
  }

  emailMatchError: boolean = false;
  passwordMatchError: boolean = false;


  validateEmailConfirmation() {
    if (this.email !== this.emailConfirm) {
      this.emailMatchError = true;
    } else {
      this.emailMatchError = false;
    }
  }


  validatePasswordConfirmation() {
    if (this.password !== this.passwordConfirm) {
      this.passwordMatchError = true;
    } else {
      this.passwordMatchError = false;
    }
  }


  showInputDate() {
    console.log(this.birthDate.year + this.birthDate.month + this.birthDate.day);
  }

  addUser(form: any): void {

    let date: Date = new Date(this.birthDate.year, this.birthDate.month - 1, this.birthDate.day + 1);

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      emailConfirm: this.emailConfirm,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      birthday: date.toISOString().split('T')[0],
      phoneNumber: this.phonenumber,
      agb: this.agb,
    };

    console.log('User Data:', userData);

    this.http.post('http://localhost:8000/user', userData, { withCredentials: true })
      .subscribe(
        response => {
          form.resetForm();
          console.log('User added successfully', response);
          this.message = 'Nutzer erfolgreich angelegt';
          setTimeout(() => {
            this.message = '';
            window.location.reload();
          }, 2000);

        },
        error => {

          console.error('There was an error!', error);
          this.message = error.error.message || 'Bitte überprüfen Sie die Eingabe';
          setTimeout(() => {
            this.message = '';
          }, 5000);
        },
      );

  }

  checkAGB() {
    this.message = 'Bitte akzeptieren Sie die AGBs';
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  checkInputs() {
    this.message = 'Bitte füllen Sie alle Pflichfelder aus';
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

}


