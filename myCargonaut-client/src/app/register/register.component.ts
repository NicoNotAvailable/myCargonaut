import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  firstName: string = "";
  lastName: string = "";
  email: string = "";
  emailConfirm: string = "";
  password: string = "";
  passwordConfirm: string = "";
  birthdate: string = "";
  phonenumber: string = "";
  agb: boolean = false;

  selectedFile: File | null = null;
  profilePicRoute: string = "";

  constructor(private http: HttpClient) {

  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }


  uploadFile(): void {
    console.log(this.selectedFile);

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

  addUser(event: SubmitEvent): void {

    event.preventDefault();

    const userData = {
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      emailConfirm: this.emailConfirm,
      password: this.password,
      passwordConfirm: this.passwordConfirm,
      birthdate: this.birthdate,
      phonenumber: this.phonenumber,
      agb: this.agb,
    };

    this.http.post("http://localhost:4200/user", userData)
      .subscribe(
        response => {
          console.log('User added successfully', response);
        },
        error => {
          console.error('There was an error!', error);
        }
      );
  }

}


