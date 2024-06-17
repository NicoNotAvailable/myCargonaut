import { Component } from '@angular/core';
import {SearchInputComponent} from "./search-input/search-input.component";
import {SearchCardComponent} from "./search-card/search-card.component";

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
