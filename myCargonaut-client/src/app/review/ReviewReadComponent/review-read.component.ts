import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf } from '@angular/common';
import { faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ReviewRead' ,
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgClass,
  ],
  templateUrl: './review-read.component.html',
  styleUrl: './review-read.component.css'
})
export class ReviewReadComponent {

  protected readonly faStar = faStar;
  protected readonly faSave = faSave;
  faStarRegular = faStarRegular;  // Empty star icon


  reviewTitle: string = "";
  reviewContent: string = "";
  reviewRating: number = 0;
  reviewPicture: string = "";
  reviewsArray: any = [];
  averageStarsFilled = [false, false, false, false, false];



  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.getReview()

  }

  getReview() {
    console.log("getReview");

    this.http.get("http://localhost:8000/review", { withCredentials: true })
      .subscribe(
        (response: any) => {
          console.log('Reviews2', response.length);

          this.reviewsArray = response;
          console.log(this.reviewsArray);
          for (let i: number = 0; i < response.length; i++) {
            this.reviewTitle = response[i].writer.firstName + " " + response[i].writer.lastName;
            this.reviewContent = response[i].text;
            this.reviewRating = response[i].rating;
            this.reviewPicture = response[i].writer.profilePic;
          }

          if (this.reviewRating === 1) {
            this.averageStarsFilled = [true, false, false, false, false];
          }else if (this.reviewRating === 2) {
            this.averageStarsFilled = [true, true, false, false, false];
          }else if (this.reviewRating === 3) {
            this.averageStarsFilled = [true, true, true, false, false];
          }else if (this.reviewRating === 4) {
            this.averageStarsFilled = [true, true, true, true, false];
          }else if (this.reviewRating === 5) {
            this.averageStarsFilled = [true, true, true, true, true];
          }

        },
        error => {
          console.error('Error fetching review', error);
        }
      );
  }
  getStarsArray(rating: number): boolean[] {
    return Array.from({ length: 5 }, (_, i) => i < rating);
  }


}
