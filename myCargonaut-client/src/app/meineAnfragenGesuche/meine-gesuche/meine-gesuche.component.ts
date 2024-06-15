import { Component } from '@angular/core';
import {SearchCardComponent} from "../../search/search-main/search-card/search-card.component";
import {TopAuswahlComponent} from "../top-auswahl/top-auswahl.component";

@Component({
  selector: 'app-meine-gesuche',
  standalone: true,
  imports: [
    SearchCardComponent,
    TopAuswahlComponent
  ],
  templateUrl: './meine-gesuche.component.html',
  styleUrl: './meine-gesuche.component.css'
})
export class MeineGesucheComponent {

}
