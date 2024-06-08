import {Component} from '@angular/core';
import {FormsModule} from "@angular/forms";
import { HttpClient, HttpClientModule} from '@angular/common/http';
import {NgIf} from "@angular/common";
import { Router } from '@angular/router';


@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgIf
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css'
})



export class DeleteUserComponent {

  constructor(private http: HttpClient, private router: Router) {}

  checkLoginBeforeDeleteUser(): void  {
    this.http.get('http://localhost:8000/session/checkLogin' , {withCredentials: true})
      .subscribe(
        (data: any) => {
          if (data && data.length > 0) {
            this.deleteUser();
          } else {
            console.error('User is not logged in and has not rights to delete this Profil.');
          }
        },
        error => {
          console.error('Error checking login status', error);
        }
      );
  }

  deleteUser(): void {

    const userData = {
      firstName: "",
      lastName: "",
      email: "",
      emailConfirm: "",
      password: "",
      passwordConfirm: "",
      birthday: "",
      phoneNumber: "",
      agb: "",

    };

    console.log('User Data:', userData);

    this.http.put("http://localhost:8000/user", userData)
      .subscribe(data => {
        this.router.navigate(['/'])
        sessionStorage.clear();

      })

  }
}
