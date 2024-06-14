import { Component } from '@angular/core';
import { ReviewDriverCreateComponent } from './ReviewDriverCreateComponent/reviewDriverCreate.component';
import { FrontpageComponent } from '../frontpage/frontpage.component';
import { ReviewReadComponent } from './ReviewReadComponent/review-read.component';
import { ReviewPassangerCreateComponent } from './ReviewPassangerCreateComponent/review-passanger-create.component';



@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReviewDriverCreateComponent,
    ReviewReadComponent,
    ReviewPassangerCreateComponent,

  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {


}
