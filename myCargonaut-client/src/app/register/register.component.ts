import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {NgIf} from "@angular/common";
import {NgbInputDatepicker} from "@ng-bootstrap/ng-bootstrap";


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
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  message: string = ""

  firstName: string = "";
  lastName: string = "";
  email: string = "";
  emailConfirm: string = "";
  password: string = "";
  passwordConfirm: string = "";
  phonenumber: string = "";
  agb: boolean = false;

  birthDate: any ="";


  birthDay: number = 0;
  birthMonth: number = 0;
  birthYear: number = 0;

  selectedFile: File | null = null;
  profilePicRoute: string = "";


  constructor(private http: HttpClient) {

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


  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  uploadFile(): void {
    if (this.selectedFile) {
      const formData = new FormData();
      formData.append('file', this.selectedFile);

      this.http.post<any>('http://localhost:4200/upload', formData).subscribe(
        response => {
          this.profilePicRoute = `../../assets/profilePictures/${response.fileName}`;
          console.log('File uploaded successfully', response);
        },
        error => {
          console.error('There was an error!', error);
        }
      );
    }
  }

  showInputDate(){
    console.log(this.birthDate.year + this.birthDate.month + this.birthDate.day )
  }

  onSubmit(form: any) {
    console.log('Form submitted:', form);
    // Form reset
    this.firstName = '';
    form.resetForm();
  }


  addUser(form: any): void {


    let date: Date = new Date(this.birthDate.year, this.birthDate.month -1 , this.birthDate.day);

    console.log(date);

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      emailConfirm: this.emailConfirm,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      birthday: date,
      phonenumber: this.phonenumber,
      agb: this.agb,
    };

    this.http.post("http://localhost:8000/user", userData)
      .subscribe(
        response => {
          form.resetForm();
          console.log('User added successfully', response);
          this.message = "Nutzer erfolgreich angelegt";
          setTimeout(() => {
            this.message = '';
          }, 5000);

        },
        error => {
          console.error('There was an error!', error);
          this.message = "Bitte überprüfen Sie die Eingabe";
          setTimeout(() => {
            this.message = '';
          }, 5000);
        }
      );
  }

}


