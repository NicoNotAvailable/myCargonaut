import { Component } from '@angular/core';
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faXmark, faSave } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-add-car',
  standalone: true,
  imports: [FaIconComponent],
  templateUrl: './add-car.component.html',
  styleUrl: './add-car.component.css'
})
export class AddCarComponent {

  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
}
