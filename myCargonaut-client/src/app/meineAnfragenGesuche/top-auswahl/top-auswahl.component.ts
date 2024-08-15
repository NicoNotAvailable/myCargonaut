import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-top-auswahl',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './top-auswahl.component.html',
  styleUrls: ['./top-auswahl.component.css']
})
export class TopAuswahlComponent implements OnInit {
  currentRoute: string = '';
  @Input() allOffers!: any;
  @Input() allRequests!: any;
  constructor(private router: Router) {}

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

  }
}
