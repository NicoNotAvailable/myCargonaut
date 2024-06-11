import { Component, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() editingCar!: number;
  @Output() changeAddCar = new EventEmitter<void>();


  saveCar(): void {

    this.changeAddCarState()
  }

  changeAddCarState(): void {
    this.changeAddCar.emit();
  }

  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
}
