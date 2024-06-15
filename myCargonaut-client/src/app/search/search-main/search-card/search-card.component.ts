import {Component} from '@angular/core';
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-search-card',
  standalone: true,
  imports: [],
  templateUrl: './search-card.component.html',
  styleUrl: './search-card.component.css'
})
export class SearchCardComponent {
  currentRoute: string = '';
  buttonText: string = "";
  plaetze: string = "";
  href:string ="";

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
      this.plaetze = "ben. Plätze";

    } else if (this.currentRoute === "searchOffer") {
      this.buttonText = "Fahrt ansehen";
      this.plaetze = "verf. Plätze";

    } else if (this.currentRoute === "myOffer") {
      this.buttonText = "Anfragen ansehen";
      this.plaetze = "verf. Plätze";
      this.href = "request";

    }else if (this.currentRoute === "myRequest") {
      this.buttonText = "Anfragen ansehen";
      this.plaetze = "ben. Plätze";
      this.href = "request";

    }


  }
}
