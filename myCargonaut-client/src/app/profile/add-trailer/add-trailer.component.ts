import { Component, EventEmitter, inject, Input, Output } from "@angular/core";
import { faDeleteLeft, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { VehicleService } from "../../services/vehicle.service";
import { HttpClient } from "@angular/common/http";
import { response } from "express";
import { FormsModule } from "@angular/forms";
import { NgIf } from "@angular/common";

@Component({
  selector: 'app-add-trailer',
  standalone: true,
  imports: [
    FaIconComponent,
    FormsModule,
    NgIf
  ],
  templateUrl: './add-trailer.component.html',
  styleUrl: './add-trailer.component.css'
})
export class AddTrailerComponent {
  @Input() editingTrailer!: number;
  @Output() changeAddTrailer = new EventEmitter<void>();

  model: string = "";
  width: number | null = null;
  height: number | null = null;
  length: number | null = null;
  weight: number | null = null;
  isEnclosed: boolean = false;
  isCooled: boolean = false;

  errorMessage: string = "";
  enableDeletion: boolean = false;

  public vehicleSerice: VehicleService = inject(VehicleService);

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    if (this.editingTrailer != 0) {
      this.vehicleSerice.readTrailer(this.editingTrailer).subscribe(
        response => {
          this.model = response.name;
          this.width = response.width;
          this.height = response.height;
          this.weight = response.weight;
          this.length = response.length;
          this.isCooled = response.isCooled;
          this.isEnclosed = response.isEnclosed;
        },
        error => {
          console.error(error);
        }
      )
    }
  }


  saveTrailer(form: any): void {
    const trailerData = {
      name: this.model,
      weight: this.weight == null ? 0 : this.weight,
      length: this.length == null ? 0 : this.length,
      width: this.width == null ? 0 : this.width,
      height: this.height == null ? 0 : this.height,
      isCooled: this.isCooled,
      isEnclosed: this.isEnclosed,
    };
    if (this.editingTrailer != 0) {
      this.http.put("http://localhost:8000/vehicle/updateTrailer/"+this.editingTrailer, trailerData, {withCredentials: true}).subscribe(
        response => {
          form.resetForm();
          this.changeAddTrailerState();
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message || "Bitte überprüfen Sie die Eingabe";
          this.removeErrorMessage();
        }
      )
    }
    else {
      this.http.post("http://localhost:8000/vehicle/trailer", trailerData, { withCredentials: true }).subscribe(
        response => {
          this.changeAddTrailerState();
          form.resetForm();
        },
        error => {
          console.error(error);
          this.errorMessage = error.error.message || "Bitte überprüfen Sie die Eingabe";
          this.removeErrorMessage();
        }
      )
    }
  }

  deleteTrailer(id: number) {
    this.http.delete("http://localhost:8000/vehicle/" + id, {withCredentials: true}).subscribe(
      response => {
        this.changeAddTrailerState();
      },
      error => {
        console.error(error);
      }
    )
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  changeAddTrailerState(): void {
    this.changeAddTrailer.emit();
  }


  protected readonly faSave = faSave;
  protected readonly faXmark = faXmark;
  protected readonly faDeleteLeft = faDeleteLeft;
}
