import { Component } from '@angular/core';
import { ReviewCreateComponent } from './ReviewCreateComponent/reviewCreate.component';
import { FrontpageComponent } from '../frontpage/frontpage.component';
import { ReviewReadComponent } from './ReviewReadComponent/review-read.component';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReviewCreateComponent,
    ReviewReadComponent,

  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css',
})
export class ReviewComponent {


  constructor(private http: HttpClient) {

  }

  ngOnInit(): void {

  }


}
