import { Component } from '@angular/core';
import {TopAuswahlComponent} from "../top-auswahl/top-auswahl.component";
import {SearchCardComponent} from "../../search/search-main/search-card/search-card.component";

@Component({
  selector: 'app-meine-anfragen',
  standalone: true,
  imports: [
    TopAuswahlComponent,
    SearchCardComponent
  ],
  templateUrl: './meine-anfragen.component.html',
  styleUrl: './meine-anfragen.component.css'
})
export class MeineAnfragenComponent {

}
