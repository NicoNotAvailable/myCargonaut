import { Component } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { TripsCreateComponent } from './trips-create/trips-create.component';
import { TripsReadComponent } from './trips-read/trips-read.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [
    NgForOf,
    TripsCreateComponent,
    TripsReadComponent,
    NgIf,
  ],
  templateUrl: './trips.component.html',
  styleUrl: './trips.component.css'
})
export class TripsComponent {
  showTripsRead: boolean = true;
  showTripsCreate: boolean = false;

  starFillSrc: string = './assets/star-fill.svg';
  starEmptySrc: string = './assets/star.svg';

  bewertungsDummy : number = 4;
  stars: number[] = [1, 2, 3, 4, 5];

  protected readonly window = window;
}
