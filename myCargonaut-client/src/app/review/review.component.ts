import { Component } from '@angular/core';
import { ReviewCreateComponent } from './ReviewCreateComponent/reviewCreate.component';
import { FrontpageComponent } from '../frontpage/frontpage.component';
import { ReviewReadComponent } from './ReviewReadComponent/review-read.component';



@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReviewCreateComponent,
    ReviewReadComponent,

  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {


}
