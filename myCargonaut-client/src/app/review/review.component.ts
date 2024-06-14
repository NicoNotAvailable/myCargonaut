import { Component } from '@angular/core';
import { ReviewCreateComponent } from './ReviewCreateComponent/reviewCreate.component';
import { FrontpageComponent } from '../frontpage/frontpage.component';



@Component({
  selector: 'app-review',
  standalone: true,
  imports: [
    ReviewCreateComponent,

  ],
  templateUrl: './review.component.html',
  styleUrl: './review.component.css'
})
export class ReviewComponent {


}
