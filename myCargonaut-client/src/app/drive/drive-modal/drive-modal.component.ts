import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import { MatFormField } from "@angular/material/form-field";
import { FormsModule } from "@angular/forms";
import { MatInput } from "@angular/material/input";
import { MatButton } from "@angular/material/button";

@Component({
  selector: 'app-drive-modal',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './drive-modal.component.html',
  styleUrl: './drive-modal.component.css'
})
export class DriveModalComponent {
  cargoDescription: string = "";
  cargoWeight: string = "";
  cargoLength: number = 0;
  cargoWidth: number = 0;
  cargoHeight: number = 0;
  carWeight: number = 0;
  carLength: number = 0;
  carWidth: number = 0;
  carHeight: number = 0;
  trailerWeight: number = 0;
  trailerLength: number = 0;
  trailerWidth: number = 0;
  trailerHeight: number = 0;


  constructor(
    public dialogRef: MatDialogRef<DriveModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.data.template === 'tripCargo') {
      console.log('Weight:', this.cargoWeight);
      this.dialogRef.close({ cargoDescription: this.cargoDescription, cargoWeight: this.cargoWeight,
        cargoLength: this.cargoLength, cargoWidth: this.cargoWidth, cargoHeight: this.cargoHeight });
    } else if (this.data.template === 'tripCar') {
      console.log('Car Weight:', this.carWeight, 'Car Length:', this.carLength);
      this.dialogRef.close({carWeight: this.carWeight,
        carLength: this.carLength, carWidth: this.carWidth, carHeight: this.carHeight });
    } else if (this.data.template === 'tripTrailer') {
      console.log('Trailer Weight:', this.trailerWeight, 'Trailer Length:', this.trailerLength);
      this.dialogRef.close({trailerWeight: this.trailerWeight,
        trailerLength: this.trailerLength, trailerWidth: this.trailerWidth, trailerHeight: this.trailerHeight });
    }
  }
}
