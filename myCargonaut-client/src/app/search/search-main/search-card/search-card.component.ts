import {Component, Input} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import {filter} from "rxjs/operators";

import {offer} from "../../offers"
import {request} from "../../requests"

import {DateFormatPipe} from "../../date-format.pipe";
import { NgForOf, NgIf, NgOptimizedImage } from "@angular/common";


@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [
    DateFormatPipe,
    NgIf,
    NgForOf,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css'
})
export class SearchCardComponent {
  currentRoute: string = '';
  buttonText: string = "";
  plaetze: string = "";
  href:string ="";

  starFillSrc: string = './assets/star-fill.svg';
  starEmptySrc: string = './assets/star.svg';

  bewertungsDummy : number = 4;
  stars: number[] = [1, 2, 3, 4, 5];

  @Input() allOffers!: offer[];
  @Input() allRequests!: request[];
  @Input() gewichte!: number[];
  @Input() masse!: number[];
  @Input() requestBool!: boolean;
  @Input() offerBool!: boolean;
  @Input() lastRideBool!: boolean;
  @Input() pathToImageArray!: string[];

  constructor(private router: Router) {
  }

  ngOnInit(): void {
    this.updateCurrentRoute();

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateCurrentRoute();
    });
  }

  private updateCurrentRoute(): void {
    const route = this.router.url.split('/').pop();
    this.currentRoute = route ? route : '';
    if (this.currentRoute === "searchRequest") {
      this.buttonText = "Suche ansehen";
      this.plaetze = "benötigte Plätze";

    } else if (this.currentRoute === "searchOffer") {
      this.buttonText = "Fahrt ansehen";
      this.plaetze = "verfügbare Plätze";

    } else if (this.currentRoute === "myOffer") {
      this.buttonText = "Anfragen ansehen";
      this.plaetze = "verfügbare Plätze";

    }else if (this.currentRoute === "myRequest") {
      this.buttonText = "Anfragen ansehen";
      this.plaetze = "benötigte Plätze";

    }


  }

  protected readonly window = window;
}
