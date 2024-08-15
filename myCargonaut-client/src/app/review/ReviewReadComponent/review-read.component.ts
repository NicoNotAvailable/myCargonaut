import { Component, inject } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgClass, NgForOf, NgIf, NgOptimizedImage } from '@angular/common';
import { faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '../../../../../utils/DateUtils';
import { SessionService } from '../../services/session.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-ReviewRead' ,
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgClass,
    NgIf,
    NgOptimizedImage,
  ],
  templateUrl: './review-read.component.html',
  styleUrl: './review-read.component.css'
})
export class ReviewReadComponent {

  public sessionService: SessionService = inject(SessionService);
  public userService: UserService = inject(UserService);

  protected readonly faStar = faStar;
  protected readonly faSave = faSave;
  faStarRegular = faStarRegular;  // Empty star icon


  pathToImage: string = "empty.png";
  profilePic: string = "";



  reviewTitle: string = "";
  reviewContent: string = "";
  reviewRating: number = 0;
  reviewPicture: string = "";
  reviewsArray: any = [];
  averageStarsFilled = [false, false, false, false, false];



  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {
    this.readUser()
    this.getReview()

  }

  getReview() {
    this.http.get("http://localhost:8000/review", { withCredentials: true })
      .subscribe(
        (response: any) => {
          this.reviewsArray = response;
          for (const element of response) {
            this.reviewTitle = element.writer.firstName + ' ' + element.writer.lastName;
            this.reviewContent = element.text;
            this.reviewRating = element.rating;
            this.reviewPicture = element.writer.profilePic;
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

  readUser(): void {

    const prePath: string = "assets/";

    setTimeout(() => {
      this.pathToImage = "";
      const imagePath: string = "empty.png";
      this.pathToImage = prePath.concat(imagePath);
      this.sessionService.checkLoginNum();
    }, 200);
    this.userService.readUser().subscribe(
      response => {
        const imagePath: string = response.profilePic;
        this.profilePic = response.profilePic;
        this.pathToImage = imagePath === "empty.png" ? "assets/empty.png" : prePath.concat(imagePath);
      },
      error => {
        console.error("There was an error!", error);
      }
    );
  }

  protected readonly window = window;
}
