import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-delete-user',
  standalone: true,
  imports: [
    FormsModule,
    HttpClientModule,
    NgIf,
  ],
  templateUrl: './delete-user.component.html',
  styleUrl: './delete-user.component.css',
})


export class DeleteUserComponent {

  constructor(private http: HttpClient, private router: Router) {
  }


  checkLoginBeforeDeleteUser(): void {
    this.http.get('http://localhost:8000/session/checkLogin', { withCredentials: true })
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
        },
      );
  }


  deleteUser(): void {
    const userData = {
      'email': null,
      'firstName': '',
      'lastName': '',
      'password': null,
      'birthday': '2000-01-01',
      'profilText': 'Dieser Nutzer hat sein konto deaktiviert.',
      'profilPic': 'empty.pn',
      'phoneNumber': null,

    };


    this.http.put('http://localhost:8000/user',
      { userData },
      {
        headers: { 'Content-Type': 'application/json' },
      },
    ).subscribe(data => {
      sessionStorage.clear();

    });

  }
}
