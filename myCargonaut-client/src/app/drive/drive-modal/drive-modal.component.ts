import {Component, Inject, ViewEncapsulation} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from "@angular/material/dialog";
import {MatFormField} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatInput} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatButtonModule} from "@angular/material/button";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-drive-modal',
  standalone: true,
  imports: [
    MatFormField,
    FormsModule,
    MatDialogTitle,
    MatFormField,
    MatDialogContent,
    MatInput,
    MatDialogActions,
    MatButton,
    NgIf,
    MatDialogTitle,
    MatDialogContent,
    MatInput,
    MatButton,
    MatDialogActions,
    MatButtonModule,
    MatDialogClose,
  ],
  templateUrl: './drive-modal.component.html',
  styleUrls: [
    './drive-modal.component.css',
    '../../../../node_modules/@angular/material/prebuilt-themes/indigo-pink.css'
  ],
  encapsulation: ViewEncapsulation.None // Oder ViewEncapsulation.Emulated
})
export class DriveModalComponent {
  cargoDescription: string = "";
  cargoWeight:  number | null | null = null;
  cargoLength:  number | null = null;
  cargoWidth:  number | null = null;
  cargoHeight:  number | null = null;
  carWeight:  number | null = null;
  carLength:  number | null = null;
  carWidth:  number | null = null;
  carHeight:  number | null = null;
  trailerWeight:  number | null = null;
  trailerLength:  number | null = null;
  trailerWidth:  number | null = null;
  trailerHeight:  number | null = null;
  stopLand: string = "";
  stopPLZ: string = "";
  stopPlace: string = "";


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
      this.dialogRef.close({
        cargoDescription: this.cargoDescription, cargoWeight: this.cargoWeight,
        cargoLength: this.cargoLength, cargoWidth: this.cargoWidth, cargoHeight: this.cargoHeight
      });
    } else if (this.data.template === 'tripCar') {
      console.log('Car Weight:', this.carWeight, 'Car Length:', this.carLength);
      this.dialogRef.close({
        carWeight: this.carWeight,
        carLength: this.carLength, carWidth: this.carWidth, carHeight: this.carHeight
      });
    } else if (this.data.template === 'tripTrailer') {
      console.log('Trailer Weight:', this.trailerWeight, 'Trailer Length:', this.trailerLength);
      this.dialogRef.close({
        trailerWeight: this.trailerWeight,
        trailerLength: this.trailerLength, trailerWidth: this.trailerWidth, trailerHeight: this.trailerHeight
      });
    }
  }
}
