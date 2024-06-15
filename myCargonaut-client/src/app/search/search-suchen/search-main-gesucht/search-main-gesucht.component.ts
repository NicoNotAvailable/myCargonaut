import { Component } from '@angular/core';
import {SearchCardComponent} from "../../search-main/search-card/search-card.component";
import {SearchInputComponent} from "../../search-main/search-input/search-input.component";

@Component({
  selector: 'app-search-main-gesucht',
  standalone: true,
  imports: [
    SearchCardComponent,
    SearchInputComponent
  ],
  templateUrl: './search-main-gesucht.component.html',
  styleUrl: './search-main-gesucht.component.css'
})
export class SearchMainGesuchtComponent {

}
