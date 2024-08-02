import { Component, Output, EventEmitter, inject } from "@angular/core";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { Car } from "../Car";
import { NgFor, NgIf, NgOptimizedImage } from "@angular/common";
import { VehicleService } from "../../services/vehicle.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-car-overview',
  standalone: true,
  imports: [
    FaIconComponent,
    NgIf,
    NgFor,
    NgOptimizedImage,
  ],
  templateUrl: './car-overview.component.html',
  styleUrl: './car-overview.component.css'
})
export class CarOverviewComponent {
  @Output() changeViewCars = new EventEmitter<void>();
  @Output() changeAddCars = new EventEmitter<number>();

  cars: Car[] = [];
  window = window;

  public vehicleService: VehicleService = inject(VehicleService);


  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.vehicleService.readCars().subscribe(
      response => {
        this.cars = response;
      },
      error => {
        console.error("Ach bruh ", error);
      }
    )
  }

  changeViewCarsState(): void {
    this.changeViewCars.emit();
  }
  changeAddCarsState(carId: number): void {
    this.changeAddCars.emit(carId);
  }

  protected readonly faXmark = faXmark;
  protected readonly faPlus = faPlus;
}
