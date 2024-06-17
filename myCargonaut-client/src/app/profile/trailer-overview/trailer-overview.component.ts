import { Component, Output, EventEmitter, inject } from "@angular/core";
import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { NgForOf, NgIf } from "@angular/common";
import { Trailer } from "../Trailer";
import { VehicleService } from "../../services/vehicle.service";
import { HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-trailer-overview',
  standalone: true,
  imports: [
    FaIconComponent,
    NgForOf,
    NgIf
  ],
  templateUrl: './trailer-overview.component.html',
  styleUrl: './trailer-overview.component.css'
})
export class TrailerOverviewComponent {
  @Output() changeViewTrailers = new EventEmitter<void>();
  @Output() changeAddTrailers = new EventEmitter<number>();

  trailers: Trailer[] = [];

  public vehicleService: VehicleService = inject(VehicleService);

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.vehicleService.readTrailers().subscribe(
      response => {
        this.trailers = response;
      },
      error => {
        console.error(error);
      }
    )
  }

  changeViewTrailerState(): void {
    this.changeViewTrailers.emit();
  }
  changeAddTrailerState(trailerId: number): void {
    this.changeAddTrailers.emit(trailerId);
  }

  protected readonly faXmark = faXmark;
  protected readonly faPlus = faPlus;
}
