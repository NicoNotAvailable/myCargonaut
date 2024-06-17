import { Component, Input, Output, EventEmitter, inject, isStandalone } from "@angular/core";
import { FaIconComponent } from "@fortawesome/angular-fontawesome";
import { faXmark, faSave, faDeleteLeft } from "@fortawesome/free-solid-svg-icons";
import { VehicleService } from "../../services/vehicle.service";
import { HttpClient } from "@angular/common/http";
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import { response } from "express";
import { Car } from "../Car";

@Component({
  selector: "app-add-car",
  standalone: true,
  imports: [FaIconComponent, FormsModule, NgClass, NgIf],
  templateUrl: "./add-car.component.html",
  styleUrl: "./add-car.component.css"
})
export class AddCarComponent {
  @Input() editingCar!: number;
  @Output() changeAddCar = new EventEmitter<void>();

  seats: number | null = null;
  model: string = "";
  length: number | null = null;
  width: number | null = null;
  height: number | null = null;
  hasTv: boolean = false;
  hasAc: boolean = false;
  weight: number | null = null;
  carImg: string | ArrayBuffer = "example.png";
  errorMessage: string = "";

  uploadCarImgState: boolean = false;
  enableDeletion: boolean = false;


  public vehicleService: VehicleService = inject(VehicleService);


  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    if (this.editingCar != 0) {
      this.vehicleService.readCar(this.editingCar).subscribe(
        response => {
          this.model = response.name;
          this.weight = response.weight;
          this.height = response.height;
          this.width = response.width;
          this.length = response.length;
          this.seats = response.seats;
          this.hasTv = response.hasTelevision;
          this.hasAc = response.hasAC;
          this.carImg = response.carPicture;
          this.enableDeletion = true;
        },
        error => {
          console.error(error, "while reading");
        }
      );
    }
  }

  saveCar(form: any): void {
    if (this.editingCar != 0) {
      this.changeAddCarState();
      return;
    }
    const carData = {
      name: this.model,
      weight: this.weight == null? 0 : this.weight,
      length: this.length == null ? 0 : this.length,
      height: this.height == null? 0 : this.height,
      width: this.width == null ? 0 : this.width,
      seats: this.seats == null ? 0 : this.seats,
      hasAC: this.hasAc,
      hasTelevision: this.hasTv
    };

    this.http.post("http://localhost:8000/vehicle/car", carData, { withCredentials: true }).subscribe(
      response => {
        form.resetForm();
        this.fetchCreatedCar();
        this.enableImageUpload();
      },
      error => {
        console.error(error);
        this.errorMessage = error.error.message || "Bitte überprüfen Sie die eingabe";
        this.removeErrorMessage();
      }
    );
  }

  fetchCreatedCar(): void {
    this.vehicleService.readCars().subscribe(
      response => {
        this.editingCar = response[response.length - 1].id;
        console.log(this.editingCar);
      },
      error => {
        console.error(error);
      }
    );
  }

  changeSeatCount(num: any) {
    if (num < 1) {
      this.errorMessage = "Dein Auto kann nicht weniger als einen Sitz haben wth you talking about";
      this.removeErrorMessage();
      return;
    }
    this.seats = Number(num);
  }

  enableImageUpload(): void {
    this.uploadCarImgState = !this.uploadCarImgState;
  }

  changeAddCarState(): void {
    this.changeAddCar.emit();
  }

  removeErrorMessage(): void {
    setTimeout(() => {
      this.errorMessage = "";
    }, 5000);
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        this.carImg = e.target.result;
      };
      reader.readAsDataURL(file);
      const formData: FormData = new FormData();
      formData.append("file", file);

      this.http.post("http://localhost:8000/vehicle/carPicture/"+this.editingCar, formData, { withCredentials: true }).subscribe(
        response => {
          this.enableImageUpload();
          this.changeAddCarState();
        },
        error => {
          console.error(error);
          this.errorMessage = "Etwas ist schiefgelaufen";
          this.removeErrorMessage();
        }
      );
      return;
    }
    this.errorMessage = "Bitte lade ein Bild von deinem Auto hoch.";
    this.removeErrorMessage();
  }

  deleteCar(id: number) {
    this.http.delete("http://localhost:8000/vehicle/" + id, { withCredentials: true }).subscribe(
      response => {
        this.changeAddCarState();
      },
      error => {
        console.error(error);
      }
    );
  }

  protected readonly faXmark = faXmark;
  protected readonly faSave = faSave;
  protected readonly isStandalone = isStandalone;
  protected readonly faDeleteLeft = faDeleteLeft;
}
