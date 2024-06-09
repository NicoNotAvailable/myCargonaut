import { Component, Output, EventEmitter } from '@angular/core';
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-trailer-overview',
  standalone: true,
  imports: [
    FaIconComponent
  ],
  templateUrl: './trailer-overview.component.html',
  styleUrl: './trailer-overview.component.css'
})
export class TrailerOverviewComponent {
  @Output() changeViewTrailers = new EventEmitter<void>();
  @Output() changeAddTrailers = new EventEmitter<number>();

  changeViewTrailerState(): void {
    this.changeViewTrailers.emit();
  }
  changeAddTrailerState(trailerId: number): void {
    this.changeAddTrailers.emit(trailerId);
  }

  protected readonly faXmark = faXmark;
  protected readonly faPlus = faPlus;
}
