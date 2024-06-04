import { Component } from '@angular/core';
import { faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-add-trailer',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './add-trailer.component.html',
  styleUrl: './add-trailer.component.css'
})
export class AddTrailerComponent {

  protected readonly faSave = faSave;
  protected readonly faXmark = faXmark;
}
