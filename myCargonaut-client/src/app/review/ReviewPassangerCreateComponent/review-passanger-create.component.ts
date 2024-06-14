import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatTooltipModule} from "@angular/material/tooltip";

import { faSave, faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarRegular } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'app-ReviewPassangerCreateComponent',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    FaIconComponent,
    NgForOf,
    FormsModule,
    NgIf,
    MatTooltipModule,
  ],
  templateUrl: './review-passanger-create.component.html',
  styleUrl: './review-passanger-create.component.css'
})
export class ReviewPassangerCreateComponent {

  protected readonly faSave = faSave;

  faStar = faStar;  // Filled star icon
  faStarRegular = faStarRegular;  // Empty star icon

  starsFilledOne: boolean[] = [false, false, false, false, false];
  starsFilledTwo: boolean[] = [false, false, false, false, false];
  starsFilledThree: boolean[] = [false, false, false, false, false ];
  starsFilledFour: boolean[] = [false, false, false, false, false];

  averageStarsFilled: boolean[] = [false, false, false, false, false];

  // Method to handle star clicks and fill stars accordingly for individual sets
  handleStarClickQOne(index: number) {
    this.updateStars(this.starsFilledOne, index);
    this.updateAverageStars();
  }

  handleStarClickQTwo(index: number) {
    this.updateStars(this.starsFilledTwo, index);
    this.updateAverageStars();
  }

  handleStarClickQThree(index: number) {
    this.updateStars(this.starsFilledThree, index);
    this.updateAverageStars();
  }


  // Helper method to update the stars
  updateStars(starsArray: boolean[], index: number) {
    for (let i = 0; i <= index; i++) {
      starsArray[i] = true;
    }
    for (let i = index + 1; i < starsArray.length; i++) {
      starsArray[i] = false;
    }
  }

  // Method to update the average stars
  updateAverageStars() {
    const allStarsArrays = [
      this.starsFilledOne,
      this.starsFilledTwo,
      this.starsFilledThree
    ];

    const totalStars = allStarsArrays.length * this.starsFilledOne.length;
    let filledStarsCount = 0;

    allStarsArrays.forEach(starsArray => {
      starsArray.forEach(star => {
        if (star) filledStarsCount++;
      });
    });

    const averageFilledStars = Math.round(filledStarsCount / allStarsArrays.length);
    for (let i = 0; i < this.averageStarsFilled.length; i++) {
      this.averageStarsFilled[i] = i < averageFilledStars;
    }
  }


}
