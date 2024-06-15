import {Component, Input} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-search-input',
  standalone: true,
  imports: [],
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.css'
})
export class SearchInputComponent {
  currentRoute: string = '';
  topText: string = "";
  placeholderInput: string = "";


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
      this.topText = "Suche";
      this.placeholderInput = "benötigte Plätze";
    } else if (this.currentRoute === "searchOffer") {
      this.topText = "Fahrt";
      this.placeholderInput = "verfügbare Plätze";

    }
  }
}
