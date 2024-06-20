import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgForOf } from '@angular/common';
import { faSave, faStar } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-ReviewRead' ,
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
  ],
  templateUrl: './review-read.component.html',
  styleUrl: './review-read.component.css'
})
export class ReviewReadComponent {

  protected readonly faStar = faStar;
  protected readonly faSave = faSave;
}
