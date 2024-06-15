import { Component } from '@angular/core';
import {SearchInputComponent} from "./search-input/search-input.component";
import {SearchCardComponent} from "./search-card/search-card.component";
import {NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs/operators";

@Component({
  selector: 'app-search-main',
  standalone: true,
  imports: [
    SearchInputComponent,
    SearchCardComponent
  ],
  templateUrl: './search-main.component.html',
  styleUrl: './search-main.component.css'
})
export class SearchMainComponent {

}
