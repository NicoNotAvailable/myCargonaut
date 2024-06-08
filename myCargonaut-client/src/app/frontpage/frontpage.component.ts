import { Component } from '@angular/core';
import bootstrap from "../../main.server";
import {NgbSlide} from "@ng-bootstrap/ng-bootstrap";
import {CarouselComponent} from "./carousel/carousel.component";


@Component({
  selector: 'app-frontpage',
  standalone: true,
  imports: [
    NgbSlide,
    CarouselComponent
  ],
  templateUrl: './frontpage.component.html',
  styleUrl: './frontpage.component.css'
})
export class FrontpageComponent {

}
