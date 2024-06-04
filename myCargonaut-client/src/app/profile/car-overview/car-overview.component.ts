import { Component } from '@angular/core';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-car-overview',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './car-overview.component.html',
  styleUrl: './car-overview.component.css'
})
export class CarOverviewComponent {

  protected readonly faXmark = faXmark;
  protected readonly faPlus = faPlus;
}
