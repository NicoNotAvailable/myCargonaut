import { Component, Output, EventEmitter } from '@angular/core';
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
  @Output() changeViewCars = new EventEmitter<void>();
  @Output() changeAddCars = new EventEmitter<number>();

  changeViewCarsState(): void {
    this.changeViewCars.emit();
  }
  changeAddCarsState(carId: number): void {
    this.changeAddCars.emit(carId);
  }

  protected readonly faXmark = faXmark;
  protected readonly faPlus = faPlus;
}
